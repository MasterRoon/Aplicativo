import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { CurrentWeatherData } from '@/types/weather';
import { useSettingsStore } from '@/stores/settingsStore';
import { getWeatherIconUrl } from '@/utils/weatherUtils';
import { formatTemperature, formatWindSpeed } from '@/utils/formatUtils';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { useCelsius, useKmh, highContrast, fontScale } = useSettingsStore();
  
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);
  
  const cardBgColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.card : COLORS.highContrast.light.card)
    : (isDark ? COLORS.dark.card : COLORS.light.card);

  const secondaryTextColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.secondaryText : COLORS.highContrast.light.secondaryText)
    : (isDark ? COLORS.dark.secondaryText : COLORS.light.secondaryText);

  // Get formatted temperature and wind speed
  const temperature = formatTemperature(data.temp, useCelsius);
  const feelsLike = formatTemperature(data.feels_like, useCelsius);
  const windSpeed = formatWindSpeed(data.wind_speed, useKmh);

  return (
    <View style={[styles.container, { backgroundColor: cardBgColor }]}>
      <View style={styles.mainInfo}>
        <View style={styles.temperatureContainer}>
          <Text style={[styles.temperature, { color: textColor, fontSize: 48 * fontScale }]}>
            {temperature}
          </Text>
          <Text style={[styles.feelsLike, { color: secondaryTextColor, fontSize: 16 * fontScale }]}>
            Feels like {feelsLike}
          </Text>
        </View>
        
        <View style={styles.weatherIconContainer}>
          <Image 
            source={{ uri: getWeatherIconUrl(data.weather[0].icon) }} 
            style={styles.weatherIcon}
            accessibilityLabel={data.weather[0].description}
          />
          <Text style={[styles.weatherDescription, { color: textColor, fontSize: 16 * fontScale }]}>
            {data.weather[0].description}
          </Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: secondaryTextColor, fontSize: 14 * fontScale }]}>
            Humidity
          </Text>
          <Text style={[styles.detailValue, { color: textColor, fontSize: 16 * fontScale }]}>
            {data.humidity}%
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: secondaryTextColor, fontSize: 14 * fontScale }]}>
            Wind
          </Text>
          <Text style={[styles.detailValue, { color: textColor, fontSize: 16 * fontScale }]}>
            {windSpeed}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: secondaryTextColor, fontSize: 14 * fontScale }]}>
            UV Index
          </Text>
          <Text style={[styles.detailValue, { color: textColor, fontSize: 16 * fontScale }]}>
            {Math.round(data.uvi)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontFamily: 'Inter-Bold',
  },
  feelsLike: {
    fontFamily: 'Inter-Regular',
  },
  weatherIconContainer: {
    alignItems: 'center',
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  weatherDescription: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
  },
});