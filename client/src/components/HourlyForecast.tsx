import { type WeatherData } from "@/hooks/use-weather";
import { WeatherIcon } from "./WeatherIcon";
import { format } from "date-fns";

interface HourlyForecastProps {
  weather: WeatherData;
}

export function HourlyForecast({ weather }: HourlyForecastProps) {
  // Get next 24 hours
  const hours = weather.hourly.time.slice(0, 24).map((time, i) => ({
    time,
    temp: weather.hourly.temperature_2m[i],
    code: weather.hourly.weather_code[i],
    isDay: weather.hourly.is_day[i],
  }));

  const currentHour = new Date().getHours();

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-bold font-display mb-4 text-foreground/80">Hourly Forecast</h3>
      
      <div className="overflow-x-auto scrollbar-hide -mx-2">
        <div className="flex gap-4 px-2 min-w-max pb-2">
          {hours.map((hour, i) => {
            const date = new Date(hour.time);
            const hourNum = date.getHours();
            const isNow = hourNum === currentHour && i === 0; // Rough approximation

            return (
              <div 
                key={hour.time}
                className={`
                  flex flex-col items-center gap-3 min-w-[4rem] p-3 rounded-xl transition-all
                  ${isNow ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105' : 'hover:bg-muted/50'}
                `}
              >
                <span className="text-xs font-medium opacity-80">
                  {i === 0 ? 'Now' : format(date, 'h a')}
                </span>
                <WeatherIcon 
                  code={hour.code} 
                  isDay={hour.isDay} 
                  className={isNow ? "text-white" : "text-primary"}
                />
                <span className="text-lg font-bold">
                  {Math.round(hour.temp)}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
