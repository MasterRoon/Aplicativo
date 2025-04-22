import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { LocationData } from '@/types/location';
import { useSettingsStore } from '@/stores/settingsStore';

interface LocationDisplayProps {
  location: LocationData;
}

export function LocationDisplay({ location }: LocationDisplayProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { highContrast, fontScale } = useSettingsStore();
  
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);

  return (
    <View style={styles.locationContainer}>
      <MapPin 
        size={20} 
        color={isDark ? COLORS.dark.primary : COLORS.light.primary} 
        style={styles.locationIcon} 
      />
      <Text style={[styles.locationText, { color: textColor, fontSize: 16 * fontScale }]}>
        {location.name}, {location.country}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontFamily: 'Inter-SemiBold',
  },
});