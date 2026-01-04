import { useFavorites, useDeleteFavorite, useAddFavorite } from "@/hooks/use-favorites";
import { type GeoLocation } from "@/hooks/use-weather";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, MapPin, X, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoritesSidebarProps {
  currentLocation?: GeoLocation;
  onSelect: (location: GeoLocation) => void;
  className?: string;
}

export function FavoritesSidebar({ currentLocation, onSelect, className }: FavoritesSidebarProps) {
  const { data: favorites, isLoading } = useFavorites();
  const deleteMutation = useDeleteFavorite();
  const addMutation = useAddFavorite();

  const isCurrentFavorite = favorites?.some(
    f => Math.abs(f.latitude - (currentLocation?.latitude || 0)) < 0.01 && 
         Math.abs(f.longitude - (currentLocation?.longitude || 0)) < 0.01
  );

  const handleToggleFavorite = () => {
    if (!currentLocation) return;
    
    if (isCurrentFavorite) {
      const fav = favorites?.find(
        f => Math.abs(f.latitude - currentLocation.latitude) < 0.01
      );
      if (fav) deleteMutation.mutate(fav.id);
    } else {
      addMutation.mutate({
        name: currentLocation.name,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        country: currentLocation.country || null,
      });
    }
  };

  return (
    <div className={cn("glass-card rounded-2xl flex flex-col h-full", className)}>
      <div className="p-6 border-b border-border/50">
        <h2 className="text-xl font-bold font-display mb-1">Favorites</h2>
        <p className="text-sm text-muted-foreground">Your saved locations</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : favorites?.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">No favorites yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Search for a city and add it to your list.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {favorites?.map((fav) => (
              <div 
                key={fav.id}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/50"
              >
                <button 
                  onClick={() => onSelect({ ...fav, id: fav.id })}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{fav.name}</div>
                    <div className="text-xs text-muted-foreground">{fav.country}</div>
                  </div>
                </button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(fav.id);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {currentLocation && (
        <div className="p-4 border-t border-border/50 bg-white/30 backdrop-blur-sm rounded-b-2xl">
          <Button 
            className="w-full gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300" 
            variant={isCurrentFavorite ? "secondary" : "default"}
            onClick={handleToggleFavorite}
            disabled={addMutation.isPending || deleteMutation.isPending}
          >
            {isCurrentFavorite ? (
              <>
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                Saved to Favorites
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Current City
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
