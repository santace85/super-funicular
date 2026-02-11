namespace SuperFunicular.Api.Services;

public interface IAiService
{
    Task<string> GenerateAsync(string prompt);
}