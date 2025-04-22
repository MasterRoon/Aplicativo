import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  // Temperature unit
  useCelsius: boolean;
  setUseCelsius: (value: boolean) => void;
  
  // Wind speed unit
  useKmh: boolean;
  setUseKmh: (value: boolean) => void;
  
  // Speech rate (0.5 to 3.0)
  speechRate: number;
  setSpeechRate: (value: number) => void;
  
  // Accessibility settings
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  
  // Font scale (0.8 to 2.0)
  fontScale: number;
  setFontScale: (value: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default settings
      useCelsius: true,
      setUseCelsius: (value: boolean) => set({ useCelsius: value }),
      
      useKmh: true,
      setUseKmh: (value: boolean) => set({ useKmh: value }),
      
      speechRate: 1.0,
      setSpeechRate: (value: number) => set({ speechRate: value }),
      
      highContrast: false,
      setHighContrast: (value: boolean) => set({ highContrast: value }),
      
      fontScale: 1.0,
      setFontScale: (value: number) => set({ fontScale: value }),
    }),
    {
      name: 'weather-app-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);