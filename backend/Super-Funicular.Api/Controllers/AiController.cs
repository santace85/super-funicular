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
                Result = result
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
    [HttpPost("improve-resume-bullet")]
    public async Task<ActionResult<AiResponse>> ImproveResumeBullet(
        [FromBody] ImproveResumeBulletRequest request,
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
                Result = result
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
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var toneInstruction = request.Tone switch
        {
            "technical" => "Respond with strong technical depth and specificity.",
            "leadership" => "Emphasize leadership, ownership, and strategic thinking.",
            "concise" => "Keep the answer clear, tight, and impactful.",
            _ => "Respond confidently and professionally."
        };

        var experienceInstruction = request.ExperienceLevel switch
        {
            "entry" => "Frame the response as an early-career professional with foundational experience and strong learning ability.",
            "senior" => "Frame the response as a senior-level professional with deep expertise and ownership.",
            "executive" => "Frame the response as an executive-level leader focused on business impact and strategic outcomes.",
            _ => "Frame the response as a mid-level professional with solid hands-on experience."
        };

        var prompt = $"""
        You are a professional interview coach.

        Answer the following interview question using the STAR method:

        QUESTION:
        {request.Question}

        STRUCTURE REQUIREMENTS:
        - Clearly label Situation
        - Clearly label Task
        - Clearly label Action
        - Clearly label Result
        - Focus on measurable impact when possible
        - Do not fabricate experience
        - Keep it realistic and professional

        TONE:
        {toneInstruction}

        EXPERIENCE LEVEL:
        {experienceInstruction}

        Output only the interview answer.
        """;

        try
        {
            var result = await _aiService.GenerateAsync(
                prompt,
                GetUserId(),
                cancellationToken);

            return Ok(new AiResponse
            {
                Result = result
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
    /// Tailors a resume to a specific job description
    /// </summary>
    [HttpPost("tailor-resume")]
    public async Task<ActionResult<AiResponse>> TailorResume(
        [FromBody] TailorResumeRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var atsSection = request.AtsOptimized
            ? """
            Additionally:
            - Optimize for ATS scanning systems.
            - Align keywords directly with the job description.
            - Increase keyword matching rate.
            - Ensure formatting remains ATS-friendly.
            """
            : string.Empty;

        var prompt = $"""
        You are a high-level career strategist.

        Tailor the following resume specifically to match the job description provided.

        Objectives:
        - Align experience with job requirements.
        - Increase relevance.
        - Reorder bullet points for impact.
        - Emphasize matching skills.
        - Keep content truthful and do not invent experience.

        {atsSection}

        IMPORTANT:
        - Do not fabricate companies or roles.
        - Do not exaggerate beyond provided experience.
        - Output only the tailored resume text.

        Resume:
        {request.ResumeText}

        Job Description:
        {request.JobDescription}
        """;

        try
        {
            var result = await _aiService.GenerateAsync(
                prompt,
                GetUserId(),
                cancellationToken);

            return Ok(new AiResponse { Result = result });
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
    /// Optimizes an entire resume
    /// </summary>
    [HttpPost("optimize-resume")]
    public async Task<ActionResult<AiResponse>> OptimizeResume(
        [FromBody] OptimizeResumeRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var atsSection = request.AtsOptimized
            ? """
            Additionally:
            - Optimize for Applicant Tracking Systems (ATS).
            - Use strong industry keywords.
            - Avoid graphics or special formatting.
            - Ensure keyword density matches modern AI resume scanners.
            """
            : string.Empty;

        var prompt = $"""
        You are an elite executive career coach.

        Improve and optimize the following resume to make it:
        - More impactful
        - Results-oriented
        - Concise
        - Modern and professional

        {atsSection}

        IMPORTANT:
        - Do not invent experience.
        - Do not fabricate metrics.
        - Keep all content truthful.
        - Output only the improved resume text.

        Resume:
        {request.ResumeText}
        """;

        try
        {
            var result = await _aiService.GenerateAsync(
                prompt,
                GetUserId(),
                cancellationToken);

            return Ok(new AiResponse { Result = result });
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
