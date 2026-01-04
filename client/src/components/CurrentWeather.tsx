import { motion } from "framer-motion";
import { type WeatherData } from "@/hooks/use-weather";
import { getWeatherConfig } from "@/lib/weather-utils";
import { Wind, Droplets, ThermometerSun } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrentWeatherProps {
  weather: WeatherData;
  locationName: string;
}

export function CurrentWeather({ weather, locationName }: CurrentWeatherProps) {
  const { current } = weather;
  const config = getWeatherConfig(current.weather_code, current.is_day);
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-8 md:p-12 text-white shadow-2xl",
        "bg-gradient-to-br",
        config.gradient
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Icon className="w-64 h-64 -mr-16 -mt-16" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <span className="text-sm font-medium tracking-wider uppercase">{locationName}</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter">
              {Math.round(current.temperature_2m)}°
            </h1>
            <div className="flex flex-col gap-1">
               <Icon className="w-12 h-12 mb-2" />
               <span className="text-2xl font-medium">{config.label}</span>
            </div>
          </div>
          <p className="mt-2 text-white/80 max-w-xs text-lg">
            {config.description}. Feels like {Math.round(current.apparent_temperature)}°.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full md:w-auto bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <div className="flex flex-col items-center justify-center text-center gap-1">
            <Wind className="w-5 h-5 opacity-70" />
            <span className="text-lg font-bold">{Math.round(current.wind_speed_10m)}</span>
            <span className="text-xs opacity-60">km/h</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-1 border-l border-white/10">
            <Droplets className="w-5 h-5 opacity-70" />
            <span className="text-lg font-bold">{current.relative_humidity_2m}</span>
            <span className="text-xs opacity-60">%</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-1 border-l border-white/10">
            <ThermometerSun className="w-5 h-5 opacity-70" />
            <span className="text-lg font-bold">{Math.round(current.apparent_temperature)}°</span>
            <span className="text-xs opacity-60">Real Feel</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
