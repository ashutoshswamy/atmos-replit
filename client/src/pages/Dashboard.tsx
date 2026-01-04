import { useState, useEffect } from "react";
import { useWeather, type GeoLocation } from "@/hooks/use-weather";
import { CitySearch } from "@/components/CitySearch";
import { CurrentWeather } from "@/components/CurrentWeather";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast";
import { FavoritesSidebar } from "@/components/FavoritesSidebar";
import { Loader2, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
    <div className="min-h-screen pb-12 pt-6 px-4 md:px-8">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-12 relative z-20">
        <div className="w-full md:w-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Atmos
          </h1>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-0 bg-transparent shadow-none w-80">
              <FavoritesSidebar 
                currentLocation={location} 
                onSelect={(loc) => setLocation(loc)}
                className="h-full border-r border-white/20"
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 w-full md:max-w-md">
          <CitySearch onSelect={setLocation} />
        </div>

        <div className="w-full md:w-auto hidden md:block">
           {/* Spacer for desktop layout balance */}
           <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <HourlyForecast weather={weather} />
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Sidebar Desktop */}
        <div className="hidden lg:block space-y-8">
          {weather && <DailyForecast weather={weather} />}
          <FavoritesSidebar 
            currentLocation={location}
            onSelect={setLocation}
            className="h-[500px]"
          />
        </div>

        {/* Mobile Daily Forecast (shows below main content on mobile) */}
        <div className="lg:hidden">
          {weather && <DailyForecast weather={weather} />}
        </div>
      </main>
    </div>
  );
}
