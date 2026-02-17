namespace SuperFunicular.Api.Models.Requests;

public class InterviewAnswerRequest
{
    public string Question { get; set; } = string.Empty;
    public string Tone { get; set; } = "confident";
    public string ExperienceLevel { get; set; } = "mid";

}