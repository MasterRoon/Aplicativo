import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '@/constants/theme';
import { formatTemperature, formatDate, formatTime } from '@/utils/formatUtils';
import { getWeatherIconUrl } from '@/utils/weatherUtils';

interface WeatherHistoryItemProps {
  item: any;
  isDark: boolean;
  fontScale: number;
  highContrast: boolean;
}

export function WeatherHistoryItem({ item, isDark, fontScale, highContrast }: WeatherHistoryItemProps) {
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);
  
  const cardBgColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.card : COLORS.highContrast.light.card)
    : (isDark ? COLORS.dark.card : COLORS.light.card);

  const secondaryTextColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.secondaryText : COLORS.highContrast.light.secondaryText)
    : (isDark ? COLORS.dark.secondaryText : COLORS.light.secondaryText);
  
  const date = formatDate(item.timestamp);
  const time = formatTime(item.timestamp);
  
  return (
    <View style={[styles.container, { backgroundColor: cardBgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.locationName, { color: textColor, fontSize: 16 * fontScale }]}>
          {item.location.name}, {item.location.country}
        </Text>
        <Text style={[styles.dateTime, { color: secondaryTextColor, fontSize: 14 * fontScale }]}>
          {date.fullDate} {time}
        </Text>
      </View>
      
      <View style={styles.weatherInfo}>
        <View style={styles.weatherIconContainer}>
          <Image 
            source={{ uri: getWeatherIconUrl(item.weather.icon) }} 
            style={styles.weatherIcon}
            accessibilityLabel={item.weather.description}
          />
          <Text 
            style={[styles.weatherDescription, { color: textColor, fontSize: 14 * fontScale }]}
          >
            {item.weather.description}
          </Text>
        </View>
        
        <View style={styles.temperatureContainer}>
          <Text style={[styles.temperature, { color: textColor, fontSize: 20 * fontScale }]}>
            {formatTemperature(item.temperature, true)}
          </Text>
          <Text style={[styles.feelsLike, { color: secondaryTextColor, fontSize: 14 * fontScale }]}>
            Feels like {formatTemperature(item.feelsLike, true)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  locationName: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  dateTime: {
    fontFamily: 'Inter-Regular',
  },
  weatherInfo: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  weatherIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  weatherDescription: {
    fontFamily: 'Inter-Regular',
    textTransform: 'capitalize',
  },
  temperatureContainer: {
    alignItems: 'flex-end',
  },
  temperature: {
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  feelsLike: {
    fontFamily: 'Inter-Regular',
  },
});