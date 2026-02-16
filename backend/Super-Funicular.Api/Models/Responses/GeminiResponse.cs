namespace SuperFunicular.Api.Models.Gemini;

public class GeminiResponse
{
    public List<GeminiResponseCandidate>? Candidates { get; set; }
}

public class GeminiResponseCandidate
{
    public GeminiResponseContent? Content { get; set; }
}

public class GeminiResponseContent
{
    public List<GeminiResponsePart>? Parts { get; set; }
}

public class GeminiResponsePart
{
    public string Text { get; set; } = string.Empty;
}