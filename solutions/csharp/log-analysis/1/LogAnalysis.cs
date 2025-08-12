public static class LogAnalysis 
{

    public static string SubstringAfter(this string str, string delimiter){
        return str.Split(delimiter)[1];
    }

    public static string SubstringBetween(this string str, string start, string end){
        return str.Split(start)[1].Split(end)[0];
    }

    public static string Message(this string str){
        return str.Split(": ")[1];
    }

    public static string LogLevel(this string str){
        return str[1..str.IndexOf("]")];
    }
}