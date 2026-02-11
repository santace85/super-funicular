namespace SuperFunicular.Api.Models.Requests;

public class CoverLetterRequest
{
    public string ResumeSummary { get; set; } = string.Empty;

    public string JobDescription { get; set; } = string.Empty;

    public bool IsDemo { get; set; } = true;
}
