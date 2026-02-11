using Microsoft.AspNetCore.Mvc;
using SuperFunicular.Api.Models.Requests;
using SuperFunicular.Api.Models.Responses;
using SuperFunicular.Api.Services;

namespace SuperFunicular.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("AI Career Tools")]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;

    public AiController(IAiService aiService)
    {
        _aiService = aiService;
    }

    /// <summary>
    /// Generates a tailored cover letter
    /// </summary>
    [HttpPost("cover-letter")]
    public async Task<ActionResult<AiResponse>> GenerateCoverLetter(
        [FromBody] CoverLetterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var prompt = $"""
        You are a professional career coach.

        Resume:
        {request.ResumeSummary}

        Job Description:
        {request.JobDescription}

        Write a concise, professional cover letter.
        """;

        var result = await _aiService.GenerateAsync(prompt);

        return Ok(new AiResponse
        {
            Result = result,
            Provider = "Mock",
        });
    }

    /// <summary>
    /// Improves a resume bullet point
    /// </summary>
    [HttpPost("resume-improve")]
    public async Task<ActionResult<AiResponse>> ImproveResume(
        [FromBody] ResumeImproveRequest request)
    {
        var prompt = $"""
        Improve this resume bullet point:

        {request.BulletPoint}

        Make it results-oriented and professional.
        """;

        var result = await _aiService.GenerateAsync(prompt);

        return Ok(new AiResponse
        {
            Result = result,
            Provider = "Mock"
        });
    }

    /// <summary>
    /// Generates an interview answer
    /// </summary>
    [HttpPost("interview-answer")]
    public async Task<ActionResult<AiResponse>> GenerateInterviewAnswer(
        [FromBody] InterviewAnswerRequest request)
    {
        var prompt = $"""
        Answer this interview question using the STAR method:

        {request.Question}
        """;

        var result = await _aiService.GenerateAsync(prompt);

        return Ok(new AiResponse
        {
            Result = result,
            Provider = "Mock"
        });
    }
}
