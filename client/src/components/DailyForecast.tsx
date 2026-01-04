import { type WeatherData } from "@/hooks/use-weather";
import { WeatherIcon } from "./WeatherIcon";
import { format } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";

interface DailyForecastProps {
  weather: WeatherData;
}

export function DailyForecast({ weather }: DailyForecastProps) {
  const days = weather.daily.time.map((time, i) => ({
    time,
    code: weather.daily.weather_code[i],
    max: weather.daily.temperature_2m_max[i],
    min: weather.daily.temperature_2m_min[i],
  }));

  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <h3 className="text-lg font-bold font-display mb-4 text-foreground/80">7-Day Forecast</h3>
      
      <div className="flex flex-col gap-1">
        {days.map((day, i) => {
          const date = new Date(day.time);
          const isToday = i === 0;

          return (
            <div 
              key={day.time}
              className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-xl transition-colors group"
            >
              <div className="w-24 font-medium">
                {isToday ? 'Today' : format(date, 'EEEE')}
              </div>
              
              <div className="flex items-center gap-3 flex-1">
                <WeatherIcon code={day.code} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-muted-foreground hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Could put weather description here */}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <ArrowDown className="w-3 h-3" />
                  {Math.round(day.min)}°
                </span>
                <span className="flex items-center gap-1 text-foreground font-bold w-10 justify-end">
                  <ArrowUp className="w-3 h-3 text-primary" />
                  {Math.round(day.max)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
