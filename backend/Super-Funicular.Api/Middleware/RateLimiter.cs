using System.Threading.RateLimiting;

public static class RateLimiterFactory
{
    public static RateLimiter Create()
    {
        return new FixedWindowRateLimiter(new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10, // 10 requests
            Window = TimeSpan.FromSeconds(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 2
        });
    }

    
}


public class RateLimitExceededException : Exception
{
    public RateLimitExceededException(string message) 
        : base(message) { }
}

