using System.Collections.Concurrent;
using System.Threading.RateLimiting;

public class UserRateLimiter
{
    private readonly ConcurrentDictionary<string, RateLimiter> _limiters = new();

    public async Task<bool> TryAcquireAsync(string userId, CancellationToken ct)
    {
        var limiter = _limiters.GetOrAdd(userId, _ =>
            new FixedWindowRateLimiter(new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5, // 5 requests
                Window = TimeSpan.FromSeconds(10),
                QueueLimit = 0
            }));

        var lease = await limiter.AcquireAsync(1, ct);
        return lease.IsAcquired;
    }
}
