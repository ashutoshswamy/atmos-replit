import { useState, useEffect } from "react";
import { useWeather, type GeoLocation } from "@/hooks/use-weather";
import { CitySearch } from "@/components/CitySearch";
import { CurrentWeather } from "@/components/CurrentWeather";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast";
import { Loader2, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Default to San Francisco
const DEFAULT_LOCATION: GeoLocation = {
  id: 1,
  name: "San Francisco",
  latitude: 37.7749,
  longitude: -122.4194,
  country: "United States"
};

export default function Dashboard() {
  const [location, setLocation] = useState<GeoLocation>(DEFAULT_LOCATION);
  const { data: weather, isLoading, error } = useWeather(location.latitude, location.longitude);

  return (
    <div className="min-h-screen pb-12 pt-6 px-4 md:px-8 flex flex-col">
      <header className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-12 relative z-20">
        <div className="w-full md:w-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Atmos
          </h1>
        </div>

        <div className="flex-1 w-full md:max-w-md">
          <CitySearch onSelect={setLocation} />
        </div>

        <div className="w-full md:w-auto hidden md:block">
           <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full flex-grow">
        {/* Main Content Area */}
        <div className="space-y-8 min-w-0">
          {isLoading ? (
            <div className="h-[400px] flex flex-col items-center justify-center glass-card rounded-3xl animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin text-primary/50 mb-4" />
              <p className="text-muted-foreground font-medium">Fetching forecast...</p>
            </div>
          ) : error ? (
            <div className="h-[400px] flex flex-col items-center justify-center glass-card rounded-3xl text-center p-8">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Weather Unavailable</h3>
              <p className="text-muted-foreground">{error.message}</p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : weather ? (
            <>
              <CurrentWeather weather={weather} locationName={location.name} />
              
              <div className="space-y-8">
                <HourlyForecast weather={weather} />
                <DailyForecast weather={weather} />
              </div>
            </>
          ) : null}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© 2026 Atmos Weather. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="font-medium text-foreground/80">Developed by Ashutosh Swamy</span>
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/ashutoshswamy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors p-1"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/in/ashutoshswamy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors p-1"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
