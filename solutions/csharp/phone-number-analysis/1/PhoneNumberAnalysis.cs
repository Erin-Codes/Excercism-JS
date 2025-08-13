public static class PhoneNumber
{
    public static (bool IsNewYork, bool IsFake, string LocalNumber) Analyze(string phoneNumber)
    {         
        return (phoneNumber[..3].Contains("212"), phoneNumber[4..7].Contains("555"), phoneNumber.Substring(phoneNumber.Length - 4));
    }

    public static bool IsFake((bool IsNewYork, bool IsFake, string LocalNumber) phoneNumberInfo)
    {
        return phoneNumberInfo.IsFake;
    }
}
