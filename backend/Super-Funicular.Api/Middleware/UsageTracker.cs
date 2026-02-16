using System.Collections.Concurrent;

public class UsageTracker
{
    private readonly ConcurrentDictionary<string, int> _usage = new();

    public void RecordUsage(string userId, int tokens)
    {
        _usage.AddOrUpdate(userId, tokens, (_, existing) => existing + tokens);
    }

    public int GetUsage(string userId)
    {
        return _usage.TryGetValue(userId, out var usage)
            ? usage
            : 0;
    }
}
