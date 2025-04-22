import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData } from '@/types/location';
import { locationService } from '@/services/locationService';

interface LocationState {
  // Currently selected location
  currentLocation: LocationData | null;
  setCurrentLocation: (location: LocationData) => void;
  
  // Favorite locations (max 3)
  favorites: LocationData[];
  addFavorite: (location: LocationData) => void;
  removeFavorite: (locationId: string) => void;
  
  // Initialize with default location
  initializeLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      
      setCurrentLocation: (location: LocationData) => 
        set({ currentLocation: location }),
      
      favorites: [],
      
      addFavorite: (location: LocationData) => {
        const { favorites } = get();
        
        // Check if already in favorites
        if (favorites.some(fav => fav.id === location.id)) {
          return;
        }
        
        // Max 3 favorites
        if (favorites.length >= 3) {
          return;
        }
        
        set({ favorites: [...favorites, location] });
      },
      
      removeFavorite: (locationId: string) => {
        const { favorites } = get();
        set({ 
          favorites: favorites.filter(location => location.id !== locationId) 
        });
      },
      
      initializeLocation: async () => {
        const { currentLocation } = get();
        
        // Only initialize if no location is set
        if (!currentLocation) {
          try {
            const initialLocation = await locationService.getInitialLocation();
            set({ currentLocation: initialLocation });
          } catch (error) {
            console.error('Failed to initialize location:', error);
          }
        }
      },
    }),
    {
      name: 'weather-app-locations',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);