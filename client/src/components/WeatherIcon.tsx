import { getWeatherConfig } from "@/lib/weather-utils";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
}

export function WeatherIcon({ code, isDay = 1, className }: WeatherIconProps) {
  const { icon: Icon } = getWeatherConfig(code, isDay);
  return <Icon className={cn("w-6 h-6", className)} />;
}
