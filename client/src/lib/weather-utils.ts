import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Moon,
  CloudMoon
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
export function getWeatherConfig(code: number, isDay: number = 1): { 
  label: string; 
  icon: LucideIcon; 
  description: string;
  gradient: string;
} {
  const isNight = isDay === 0;

  // Clear sky
  if (code === 0) {
    return {
      label: "Clear Sky",
      icon: isNight ? Moon : Sun,
      description: "Perfectly clear view",
      gradient: isNight 
        ? "from-slate-900 to-slate-800" 
        : "from-blue-400 to-blue-300",
    };
  }

  // Mainly clear, partly cloudy, and overcast
  if (code === 1 || code === 2 || code === 3) {
    return {
      label: code === 1 ? "Mainly Clear" : code === 2 ? "Partly Cloudy" : "Overcast",
      icon: isNight ? CloudMoon : CloudSun,
      description: "Clouds passing by",
      gradient: isNight
        ? "from-slate-800 to-gray-800"
        : "from-blue-300 to-gray-200",
    };
  }

  // Fog
  if (code === 45 || code === 48) {
    return {
      label: "Foggy",
      icon: CloudFog,
      description: "Low visibility",
      gradient: "from-gray-400 to-gray-300",
    };
  }

  // Drizzle
  if ([51, 53, 55].includes(code)) {
    return {
      label: "Drizzle",
      icon: CloudDrizzle,
      description: "Light rain",
      gradient: "from-blue-200 to-gray-300",
    };
  }

  // Rain
  if ([61, 63, 65, 80, 81, 82].includes(code)) {
    return {
      label: "Rain",
      icon: CloudRain,
      description: "Bring an umbrella",
      gradient: "from-blue-700 to-blue-500",
    };
  }

  // Snow
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      label: "Snow",
      icon: CloudSnow,
      description: "Snowflakes falling",
      gradient: "from-white to-gray-200",
    };
  }

  // Thunderstorm
  if ([95, 96, 99].includes(code)) {
    return {
      label: "Thunderstorm",
      icon: CloudLightning,
      description: "Stormy weather",
      gradient: "from-indigo-900 to-purple-900",
    };
  }

  // Default
  return {
    label: "Unknown",
    icon: Cloud,
    description: "Unknown weather",
    gradient: "from-gray-400 to-gray-300",
  };
}
