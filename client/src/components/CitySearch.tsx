import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useCitySearch, type GeoLocation } from "@/hooks/use-weather";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CitySearchProps {
  onSelect: (city: GeoLocation) => void;
}

// Simple debounce hook implementation inline for completeness
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function CitySearch({ onSelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounceValue(query, 500);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: results, isLoading } = useCitySearch(debouncedQuery);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    onSelect(city);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search city..."
          className="pl-9 glass-input rounded-full border-white/40 h-10 shadow-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
        )}
      </div>

      {isOpen && results && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 w-full bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <ul className="py-2">
            {results.map((city) => (
              <li key={city.id}>
                <button
                  onClick={() => handleSelect(city)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{city.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
