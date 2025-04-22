import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WeatherHistoryState {
  history: any[];
  addHistoryItem: (item: any) => void;
  getHistory: () => Promise<any[]>;
  clearHistory: () => Promise<void>;
}

export const useWeatherHistoryStore = create<WeatherHistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      
      // Add a history item (keep only most recent 5)
      addHistoryItem: (item: any) => {
        set((state) => {
          const existingItemIndex = state.history.findIndex(
            (histItem) => histItem.location.id === item.location.id
          );
          
          let newHistory = [...state.history];
          
          if (existingItemIndex !== -1) {
            // Replace existing item for this location
            newHistory[existingItemIndex] = item;
          } else {
            // Add new item
            newHistory = [item, ...newHistory];
          }
          
          // Limit to 5 most recent checks
          if (newHistory.length > 5) {
            newHistory = newHistory.slice(0, 5);
          }
          
          return { history: newHistory };
        });
      },
      
      // Get history items (sorted by timestamp)
      getHistory: async () => {
        const { history } = get();
        return [...history].sort((a, b) => b.timestamp - a.timestamp);
      },
      
      // Clear all history
      clearHistory: async () => {
        set({ history: [] });
      },
    }),
    {
      name: 'weather-app-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);