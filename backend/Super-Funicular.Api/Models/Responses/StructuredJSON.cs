using System.Text.Json.Serialization;

namespace SuperFunicular.Api.Models.Gemini;

public class StructuredResumeResponse
{
    [JsonPropertyName("header")]
    public ResumeHeader? Header { get; set; }

    [JsonPropertyName("sections")]
    public List<ResumeSection> Sections { get; set; } = new();
}

public class ResumeHeader
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("location")]
    public string? Location { get; set; }

    [JsonPropertyName("links")]
    public List<ResumeLink>? Links { get; set; }
}

public class ResumeLink
{
    [JsonPropertyName("label")]
    public string Label { get; set; } = "";

    [JsonPropertyName("url")]
    public string Url { get; set; } = "";
}

public class ResumeSection
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "";

    [JsonPropertyName("title")]
    public string Title { get; set; } = "";

    [JsonPropertyName("content")]
    public string? Content { get; set; }

    [JsonPropertyName("items")]
    public List<ResumeItem>? Items { get; set; }
}

public class ResumeItem
{
    [JsonPropertyName("heading")]
    public string? Heading { get; set; }

    [JsonPropertyName("subheading")]
    public string? Subheading { get; set; }

    [JsonPropertyName("bullets")]
    public List<string>? Bullets { get; set; }

    [JsonPropertyName("value")]
    public string? Value { get; set; }
}
