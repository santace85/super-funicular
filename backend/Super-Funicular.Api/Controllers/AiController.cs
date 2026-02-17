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

    private string GetUserId()
    {
        return User.Identity?.Name 
               ?? HttpContext.Connection.RemoteIpAddress?.ToString() 
               ?? "anonymous";
    }

    /// <summary>
    /// Generates a tailored cover letter
    /// </summary>
    [HttpPost("cover-letter")]
    public async Task<ActionResult<AiResponse>> GenerateCoverLetter(
        [FromBody] CoverLetterRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var today = DateTime.UtcNow.ToString("MMMM dd, yyyy");

        var prompt = $"""
        You are a professional career coach.

        Generate a polished, professional cover letter using the information below.

        FORMATTING REQUIREMENTS:
        - Use today's date: {today}
        - Do NOT include a subject line.
        - Do NOT include placeholders like [Your Name].
        - Do NOT include commentary, explanations, or separators.
        - Output ONLY the final cover letter text.
        - If the company name appears in the job description, use it.
        - If a hiring manager name is not provided, use "Hiring Manager".
        - Do not invent names.
        - Use proper business letter formatting.

        Resume Summary:
        {request.ResumeSummary}

        Job Description:
        {request.JobDescription}

        Write a concise, tailored cover letter.
        """;

        try
        {
            var result = await _aiService.GenerateAsync(
                prompt,
                GetUserId(),
                cancellationToken);

            return Ok(new AiResponse
            {
                Result = result,
                Provider = "Gemini"
            });
        }
        catch (OperationCanceledException)
        {
            return StatusCode(499); // Client Closed Request
        }
        catch (RateLimitExceededException)
        {
            return StatusCode(429, "Rate limit exceeded. Please try again later.");
        }
    }

    /// <summary>
    /// Improves a resume bullet point
    /// </summary>
    [HttpPost("resume-improve")]
    public async Task<ActionResult<AiResponse>> ImproveResume(
        [FromBody] ResumeImproveRequest request,
        CancellationToken cancellationToken)
    {
        var prompt = $"""
        Improve this resume bullet point:

        {request.BulletPoint}

        Make it results-oriented and professional.
        """;

        try
        {
            var result = await _aiService.GenerateAsync(
                prompt,
                GetUserId(),
                cancellationToken);

            return Ok(new AiResponse
            {
                Result = result,
                Provider = "Gemini"
            });
        }
        catch (OperationCanceledException)
        {
            return StatusCode(499);
        }
        catch (RateLimitExceededException)
        {
            return StatusCode(429, "Rate limit exceeded. Please try again later.");
        }
    }

    /// <summary>
    /// Generates an interview answer
    /// </summary>
    [HttpPost("interview-answer")]
    public async Task<ActionResult<AiResponse>> GenerateInterviewAnswer(
        [FromBody] InterviewAnswerRequest request,
        CancellationToken cancellationToken)
    {
        var prompt = $"""
        Answer this interview question using the STAR method:

        {request.Question}
        """;

        try
        {
            var result = await _aiService.GenerateAsync(
                prompt,
                GetUserId(),
                cancellationToken);

            return Ok(new AiResponse
            {
                Result = result,
                Provider = "Gemini"
            });
        }
        catch (OperationCanceledException)
        {
            return StatusCode(499);
        }
        catch (RateLimitExceededException)
        {
            return StatusCode(429, "Rate limit exceeded. Please try again later.");
        }
    }
}
