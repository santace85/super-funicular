namespace SuperFunicular.Api.Models.Responses;

public class AiResponse
{
    public string Result { get; set; } = string.Empty;

    public string Provider { get; set; } = string.Empty;

    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}