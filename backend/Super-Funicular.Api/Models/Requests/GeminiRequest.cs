namespace SuperFunicular.Api.Models.Gemini;

public class GeminiRequest
{
    public List<GeminiRequestContent> Contents { get; set; } = new();
}

public class GeminiRequestContent
{
    public List<GeminiRequestPart> Parts { get; set; } = new();
}

public class GeminiRequestPart
{
    public string Text { get; set; } = string.Empty;
}
