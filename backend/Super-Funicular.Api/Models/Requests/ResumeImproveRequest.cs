namespace SuperFunicular.Api.Models.Requests;

public class ImproveResumeBulletRequest
{
    public string BulletPoint { get; set; } = string.Empty;

}

public class OptimizeResumeRequest
{
    public string ResumeText { get; set; } = string.Empty;
    public bool AtsOptimized { get; set; }
}


public class TailorResumeRequest
{
    public string ResumeText { get; set; } = string.Empty;
    public string JobDescription { get; set; } = string.Empty;
    public bool AtsOptimized { get; set; }
}
