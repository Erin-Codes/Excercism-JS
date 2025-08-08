class Lasagna
{
    public int ExpectedMinutesInOven() => 40;

    public int RemainingMinutesInOven(int used) => this.ExpectedMinutesInOven() - used; 

    public int PreparationTimeInMinutes(int layers) => layers * 2 ;

    public int ElapsedTimeInMinutes(int layers, int minutes)
    {
        int prepTime = this.PreparationTimeInMinutes(layers);
        return (minutes) + prepTime ; 
    }
}
