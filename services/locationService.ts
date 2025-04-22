import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData } from '@/types/location';

// Note: In a real application, this would be in an environment variable
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with a real API key
const BASE_URL = 'https://api.openweathermap.org/geo/1.0';

class LocationService {
  async searchLocations(query: string): Promise<LocationData[]> {
    try {
      // Check if we have cached results
      const cachedResults = await this.getCachedSearchResults(query);
      if (cachedResults) {
        return cachedResults;
      }
      
      // Fetch from API if no cache
      const response = await fetch(
        `${BASE_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
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
      
      // Transform data to our format and add unique IDs
      const locations: LocationData[] = data.map((item: any, index: number) => ({
        id: `${item.lat}_${item.lon}`,
        name: item.name,
        state: item.state || '',
        country: item.country,
        lat: item.lat,
        lon: item.lon,
      }));
      
      // Cache the results
      await this.cacheSearchResults(query, locations);
      
      return locations;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  }
  
  private async cacheSearchResults(query: string, results: LocationData[]): Promise<void> {
    try {
      const normalizedQuery = query.toLowerCase().trim();
      const cacheKey = `location_search_${normalizedQuery}`;
      const cacheData = {
        results,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching search results:', error);
    }
  }
  
  private async getCachedSearchResults(query: string): Promise<LocationData[] | null> {
    try {
      const normalizedQuery = query.toLowerCase().trim();
      const cacheKey = `location_search_${normalizedQuery}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (!cachedData) {
        return null;
      }
      
      const { results, timestamp } = JSON.parse(cachedData);
      
      // Check if cache is older than 24 hours (86400000 ms)
      const cacheAge = Date.now() - timestamp;
      if (cacheAge > 86400000) {
        return null;
      }
      
      return results;
    } catch (error) {
      console.error('Error getting cached search results:', error);
      return null;
    }
  }
  
  async getInitialLocation(): Promise<LocationData> {
    // Default to Rio Paranaíba as requested
    return {
      id: 'rio_paranaiba',
      name: 'Rio Paranaíba',
      state: 'Minas Gerais',
      country: 'BR',
      lat: -19.1851,
      lon: -46.2481,
    };
  }
}

export const locationService = new LocationService();