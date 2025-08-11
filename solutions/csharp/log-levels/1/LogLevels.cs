static class LogLine
{
    public static string Message(string logLine) => logLine.Split(": ")[1].Trim();

    public static string LogLevel(string logLine) => logLine.Split("]: ")[0].Trim(new Char[] { '[' }).ToLower();

    public static string Reformat(string logLine) => $"{LogLine.Message(logLine)} ({LogLevel(logLine)})";
    
}
