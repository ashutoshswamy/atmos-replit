import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// Zod schemas for Open-Meteo responses to ensure type safety
const GeoSearchSchema = z.object({
  results: z.array(z.object({
    id: z.number(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    country: z.string().optional(),
    admin1: z.string().optional(), // State/Region
  })).optional(),
});

export type GeoLocation = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

const WeatherSchema = z.object({
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    relative_humidity_2m: z.number(),
    apparent_temperature: z.number(),
    is_day: z.number(),
    weather_code: z.number(),
    wind_speed_10m: z.number(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    weather_code: z.array(z.number()),
    is_day: z.array(z.number()),
  }),
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    sunrise: z.array(z.string()),
    sunset: z.array(z.string()),
  }),
  current_units: z.object({
    temperature_2m: z.string(),
    wind_speed_10m: z.string(),
  }).optional(),
});

export type WeatherData = z.infer<typeof WeatherSchema>;

export function useCitySearch(query: string) {
  return useQuery({
    queryKey: ["geo-search", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      if (!res.ok) throw new Error("Failed to search city");
      const data = GeoSearchSchema.parse(await res.json());
      return data.results || [];
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useWeather(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: async () => {
      if (lat === null || lon === null) return null;
      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m",
        hourly: "temperature_2m,weather_code,is_day",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
        timezone: "auto",
      });

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch weather data");
      return WeatherSchema.parse(await res.json());
    },
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
