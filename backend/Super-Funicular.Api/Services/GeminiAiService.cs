using System.Net;
using System.Net.Http.Json;
using Polly;
using SuperFunicular.Api.Models.Gemini;
namespace SuperFunicular.Api.Services;


public class GeminiAiService : IAiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly UserRateLimiter _rateLimiter;
    private readonly UsageTracker _usageTracker;

    private readonly AsyncPolicy<HttpResponseMessage> _retryPolicy;

    public GeminiAiService(
        HttpClient httpClient,
        IConfiguration config,
        UserRateLimiter rateLimiter,
        UsageTracker usageTracker)
    {
        _httpClient = httpClient;
        _config = config;
        _rateLimiter = rateLimiter;
        _usageTracker = usageTracker;

        _retryPolicy = Policy
            .HandleResult<HttpResponseMessage>(r =>
                r.StatusCode == HttpStatusCode.TooManyRequests ||
                (int)r.StatusCode >= 500)
            .Or<HttpRequestException>()
            .WaitAndRetryAsync(3,
                retry => TimeSpan.FromSeconds(Math.Pow(2, retry)));
    }

    public async Task<string> GenerateAsync(
        string prompt,
        string userId,
        CancellationToken cancellationToken)
    {
        // Per-user rate limit
        if (!await _rateLimiter.TryAcquireAsync(userId, cancellationToken))
            throw new Exception("User rate limit exceeded.");

        var apiKey = _config["Gemini:ApiKey"];
        var model = _config["Gemini:Model"] ?? "gemini-2.5-flash-lite";

        var url =
            $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

        var request = new GeminiRequest
        {
            Contents =
            {
                new GeminiRequestContent
                {
                    Parts =
                    {
                        new GeminiRequestPart { Text = prompt }
                    }
                }
            }
        };

        var response = await _retryPolicy.ExecuteAsync(() =>
            _httpClient.PostAsJsonAsync(url, request, cancellationToken)
        );

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new Exception($"Gemini API error: {error}");
        }

        var geminiResponse =
            await response.Content.ReadFromJsonAsync<GeminiResponse>(cancellationToken: cancellationToken);

        var text = geminiResponse?
            .Candidates?
            .FirstOrDefault()?
            .Content?
            .Parts?
            .FirstOrDefault()?
            .Text;

        // Rough token estimate (1 token ≈ 4 chars)
        var estimatedTokens = prompt.Length / 4;
        _usageTracker.RecordUsage(userId, estimatedTokens);

        return text ?? "No response from Gemini.";
    }

}
