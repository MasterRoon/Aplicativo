import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { useColorScheme } from 'react-native';
import { weatherService } from '@/services/weatherService';
import { WeatherData } from '@/types/weather';
import { CurrentWeather } from '@/components/home/CurrentWeather';
import { WeatherGraph } from '@/components/home/WeatherGraph';
import { DailyForecast } from '@/components/home/DailyForecast';
import { useLocationStore } from '@/stores/locationStore';
import { useSpeech } from '@/hooks/useSpeech';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { LocationDisplay } from '@/components/common/LocationDisplay';
import { Share2, VolumeX, Volume2 } from 'lucide-react-native';
import { useSettingsStore } from '@/stores/settingsStore';
import { NetworkStatus } from '@/components/common/NetworkStatus';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { currentLocation } = useLocationStore();
  const { highContrast, fontScale } = useSettingsStore();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, stop } = useSpeech();

  const bgColor = highContrast 
    ? (isDark ? COLORS.highContrast.dark.background : COLORS.highContrast.light.background) 
    : (isDark ? COLORS.dark.background : COLORS.light.background);
  
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);

  useEffect(() => {
    if (currentLocation) {
      loadWeatherData();
    }
  }, [currentLocation]);

  const loadWeatherData = async () => {
    if (!currentLocation) return;
    
    setLoading(true);
    try {
      const data = await weatherService.getWeather(
        currentLocation.lat,
        currentLocation.lon
      );
      setWeather(data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!weather || !currentLocation) return;
    
    try {
      const message = `Current weather in ${currentLocation.name}: ${weather.current.temp}°C, ${weather.current.weather[0].description}. Feels like: ${weather.current.feels_like}°C`;
      
      await Share.share({
        message,
        title: `Weather in ${currentLocation.name}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSpeak = () => {
    if (!weather || !currentLocation) return;
    
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
      return;
    }
    
    const message = `Current weather in ${currentLocation.name} is ${weather.current.temp} degrees Celsius, with ${weather.current.weather[0].description}. It feels like ${weather.current.feels_like} degrees. Humidity is at ${weather.current.humidity} percent. Today's forecast shows a high of ${weather.daily[0].temp.max} and a low of ${weather.daily[0].temp.min} degrees.`;
    
    speak(message, () => setIsSpeaking(false));
    setIsSpeaking(true);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
        <Text style={[styles.loadingText, { color: textColor, fontSize: 16 * fontScale }]}>
          Loading weather data...
        </Text>
      </View>
    );
  }

  if (!weather || !currentLocation) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <Text style={[styles.errorText, { color: textColor, fontSize: 16 * fontScale }]}>
          No weather data available. Please check your connection or select a location.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <NetworkStatus />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LocationDisplay location={currentLocation} />
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleSpeak}
            accessibilityLabel={isSpeaking ? "Stop reading weather" : "Read weather out loud"}
            accessibilityHint={isSpeaking ? "Stops the voice reading the weather information" : "Reads the current weather information out loud"}
          >
            {isSpeaking ? (
              <VolumeX size={24} color={textColor} />
            ) : (
              <Volume2 size={24} color={textColor} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleShare}
            accessibilityLabel="Share weather information"
            accessibilityHint="Opens options to share current weather data"
          >
            <Share2 size={24} color={textColor} />
          </TouchableOpacity>
        </View>
        
        <CurrentWeather data={weather.current} />
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor, fontSize: 18 * fontScale }]}>
            Hourly Forecast
          </Text>
          <WeatherGraph hourlyData={weather.hourly.slice(0, 24)} />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor, fontSize: 18 * fontScale }]}>
            7-Day Forecast
          </Text>
          <DailyForecast dailyData={weather.daily} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    padding: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 12,
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
});