import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { DailyWeatherData } from '@/types/weather';
import { useSettingsStore } from '@/stores/settingsStore';
import { getWeatherIconUrl } from '@/utils/weatherUtils';
import { formatTemperature, formatDate } from '@/utils/formatUtils';

interface DailyForecastProps {
  dailyData: DailyWeatherData[];
}

export function DailyForecast({ dailyData }: DailyForecastProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { useCelsius, highContrast, fontScale } = useSettingsStore();
  
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);
  
  const cardBgColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.card : COLORS.highContrast.light.card)
    : (isDark ? COLORS.dark.card : COLORS.light.card);

  const secondaryTextColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.secondaryText : COLORS.highContrast.light.secondaryText)
    : (isDark ? COLORS.dark.secondaryText : COLORS.light.secondaryText);

  const renderDailyItem = ({ item, index }: { item: DailyWeatherData; index: number }) => {
    const isToday = index === 0;
    const maxTemp = formatTemperature(item.temp.max, useCelsius);
    const minTemp = formatTemperature(item.temp.min, useCelsius);
    const date = formatDate(item.dt);
    
    return (
      <View style={[
        styles.dailyItem,
        index < dailyData.length - 1 && styles.dailyItemBorder
      ]}>
        <View style={styles.dateContainer}>
          <Text style={[styles.dayName, { color: textColor, fontSize: 16 * fontScale }]}>
            {isToday ? 'Today' : date.dayName}
          </Text>
          <Text style={[styles.date, { color: secondaryTextColor, fontSize: 14 * fontScale }]}>
            {date.fullDate}
          </Text>
        </View>
        
        <View style={styles.weatherContainer}>
          <Image 
            source={{ uri: getWeatherIconUrl(item.weather[0].icon) }} 
            style={styles.weatherIcon}
            accessibilityLabel={item.weather[0].description}
          />
          <Text 
            style={[styles.weatherDescription, { color: textColor, fontSize: 14 * fontScale }]}
            numberOfLines={1}
          >
            {item.weather[0].description}
          </Text>
        </View>
        
        <View style={styles.temperatureContainer}>
          <Text style={[styles.maxTemp, { color: textColor, fontSize: 16 * fontScale }]}>
            {maxTemp}
          </Text>
          <Text style={[styles.minTemp, { color: secondaryTextColor, fontSize: 14 * fontScale }]}>
            {minTemp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: cardBgColor }]}>
      <FlatList
        data={dailyData}
        renderItem={renderDailyItem}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dailyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dateContainer: {
    flex: 2,
  },
  dayName: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
  },
  weatherContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  weatherDescription: {
    fontFamily: 'Inter-Regular',
    textTransform: 'capitalize',
    flex: 1,
  },
  temperatureContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  maxTemp: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  minTemp: {
    fontFamily: 'Inter-Regular',
  },
});