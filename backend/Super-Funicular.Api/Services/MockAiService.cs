namespace SuperFunicular.Api.Services;

public class MockAiService : IAiService
{
    public Task<string> GenerateAsync(string prompt)
    {
        var fakeResponse = $"""
        [DEMO MODE]

        This is a simulated AI response.

        Prompt received:
        {prompt}

        """;

        return Task.FromResult(fakeResponse);
    }
}