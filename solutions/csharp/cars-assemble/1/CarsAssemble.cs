static class AssemblyLine
{
    public static double SuccessRate(int speed)
    {
        if (speed == 0) {return 0;}
        else if (speed >= 1 && speed <= 4) {return 1.0;} 
        else if (speed >= 5 && speed <= 8) {return 0.90;}
        else if (speed == 9) {return 0.80;}
        else if (speed == 10) {return 0.77;}
        else {return speed;} 
    }

    public static double ProductionRatePerHour(int speed) => 221 * AssemblyLine.SuccessRate(speed) * speed;

    public static int WorkingItemsPerMinute(int speed) => (int)AssemblyLine.ProductionRatePerHour(speed) / 60;
}
