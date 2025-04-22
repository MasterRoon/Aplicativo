import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from '@/types/weather';
import { useWeatherHistoryStore } from '@/stores/weatherHistoryStore';
import { useLocationStore } from '@/stores/locationStore';

// Note: In a real application, this would be in an environment variable
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with a real API key
const BASE_URL = 'https://api.openweathermap.org/data/3.0';

class WeatherService {
  async getWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      // Try to fetch from network
      const response = await fetch(
        `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the result
      await this.cacheWeatherData(lat, lon, data);
      
      // Add to history
      this.addToHistory(lat, lon, data);
      
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      
      // Try to get from cache
      const cachedData = await this.getCachedWeatherData(lat, lon);
      if (cachedData) {
        return cachedData;
      }
      
      throw error;
    }
  }
  
  private async cacheWeatherData(lat: number, lon: number, data: WeatherData): Promise<void> {
    try {
      const cacheKey = `weather_${lat}_${lon}`;
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching weather data:', error);
    }
  }
  
  private async getCachedWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      const cacheKey = `weather_${lat}_${lon}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (!cachedData) {
        return null;
      }
      
      const { data, timestamp } = JSON.parse(cachedData);
      
      // Check if cache is older than 1 hour (3600000 ms)
      const cacheAge = Date.now() - timestamp;
      if (cacheAge > 3600000) {
        console.log('Cache is too old, should refresh');
      }
      
      return data;
    } catch (error) {
      console.error('Error getting cached weather data:', error);
      return null;
    }
  }
  
  private async addToHistory(lat: number, lon: number, data: WeatherData): Promise<void> {
    try {
      // Get current location
      const { currentLocation } = useLocationStore.getState();
      if (!currentLocation) return;
      
      const { addHistoryItem } = useWeatherHistoryStore.getState();
      
      // Create history entry
      const historyItem = {
        location: currentLocation,
        timestamp: Date.now(),
        temperature: data.current.temp,
        feelsLike: data.current.feels_like,
        weather: {
          id: data.current.weather[0].id,
          main: data.current.weather[0].main,
          description: data.current.weather[0].description,
          icon: data.current.weather[0].icon,
        },
      };
      
      addHistoryItem(historyItem);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  }
}

export const weatherService = new WeatherService();