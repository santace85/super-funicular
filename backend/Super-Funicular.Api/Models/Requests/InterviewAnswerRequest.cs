namespace SuperFunicular.Api.Models.Requests;

public class InterviewAnswerRequest
{
    public string Question { get; set; } = string.Empty;

    public bool IsDemo { get; set; } = true;
}