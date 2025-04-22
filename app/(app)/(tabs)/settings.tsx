import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import Slider from '@/components/common/Slider';
import { Check } from 'lucide-react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { 
    useCelsius, 
    setUseCelsius,
    useKmh, 
    setUseKmh,
    speechRate, 
    setSpeechRate,
    highContrast, 
    setHighContrast,
    fontScale,
    setFontScale
  } = useSettingsStore();

  const bgColor = highContrast 
    ? (isDark ? COLORS.highContrast.dark.background : COLORS.highContrast.light.background) 
    : (isDark ? COLORS.dark.background : COLORS.light.background);
  
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);

  const cardBgColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.card : COLORS.highContrast.light.card)
    : (isDark ? COLORS.dark.card : COLORS.light.card);

  const renderSection = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: textColor, fontSize: 18 * fontScale }]}>
        {title}
      </Text>
    </View>
  );

  const renderSetting = (
    title: string, 
    description: string, 
    component: React.ReactNode
  ) => (
    <View style={[styles.settingContainer, { backgroundColor: cardBgColor }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: textColor, fontSize: 16 * fontScale }]}>
          {title}
        </Text>
        <Text style={[styles.settingDescription, { color: textColor, fontSize: 14 * fontScale }]}>
          {description}
        </Text>
      </View>
      <View style={styles.settingControl}>
        {component}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView>
        {renderSection('Units')}
        
        {renderSetting(
          'Temperature',
          'Choose between Celsius and Fahrenheit',
          <View style={styles.unitToggle}>
            <TouchableOpacity 
              style={[
                styles.unitButton, 
                useCelsius && styles.unitButtonActive,
                { borderColor: isDark ? '#475569' : '#CBD5E1' }
              ]}
              onPress={() => setUseCelsius(true)}
              accessibilityLabel="Celsius"
              accessibilityHint="Select Celsius temperature unit"
              accessibilityState={{ selected: useCelsius }}
            >
              <Text 
                style={[
                  styles.unitText, 
                  useCelsius && styles.unitTextActive,
                  { color: textColor, fontSize: 14 * fontScale }
                ]}
              >
                °C
              </Text>
              {useCelsius && <Check size={14} color={isDark ? COLORS.dark.primary : COLORS.light.primary} style={styles.checkIcon} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.unitButton, 
                !useCelsius && styles.unitButtonActive,
                { borderColor: isDark ? '#475569' : '#CBD5E1' }
              ]}
              onPress={() => setUseCelsius(false)}
              accessibilityLabel="Fahrenheit"
              accessibilityHint="Select Fahrenheit temperature unit"
              accessibilityState={{ selected: !useCelsius }}
            >
              <Text 
                style={[
                  styles.unitText, 
                  !useCelsius && styles.unitTextActive,
                  { color: textColor, fontSize: 14 * fontScale }
                ]}
              >
                °F
              </Text>
              {!useCelsius && <Check size={14} color={isDark ? COLORS.dark.primary : COLORS.light.primary} style={styles.checkIcon} />}
            </TouchableOpacity>
          </View>
        )}
        
        {renderSetting(
          'Wind Speed',
          'Choose between kilometers and miles per hour',
          <View style={styles.unitToggle}>
            <TouchableOpacity 
              style={[
                styles.unitButton, 
                useKmh && styles.unitButtonActive,
                { borderColor: isDark ? '#475569' : '#CBD5E1' }
              ]}
              onPress={() => setUseKmh(true)}
              accessibilityLabel="Kilometers per hour"
              accessibilityHint="Select kilometers per hour wind speed unit"
              accessibilityState={{ selected: useKmh }}
            >
              <Text 
                style={[
                  styles.unitText, 
                  useKmh && styles.unitTextActive,
                  { color: textColor, fontSize: 14 * fontScale }
                ]}
              >
                km/h
              </Text>
              {useKmh && <Check size={14} color={isDark ? COLORS.dark.primary : COLORS.light.primary} style={styles.checkIcon} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.unitButton, 
                !useKmh && styles.unitButtonActive,
                { borderColor: isDark ? '#475569' : '#CBD5E1' }
              ]}
              onPress={() => setUseKmh(false)}
              accessibilityLabel="Miles per hour"
              accessibilityHint="Select miles per hour wind speed unit"
              accessibilityState={{ selected: !useKmh }}
            >
              <Text 
                style={[
                  styles.unitText, 
                  !useKmh && styles.unitTextActive,
                  { color: textColor, fontSize: 14 * fontScale }
                ]}
              >
                mph
              </Text>
              {!useKmh && <Check size={14} color={isDark ? COLORS.dark.primary : COLORS.light.primary} style={styles.checkIcon} />}
            </TouchableOpacity>
          </View>
        )}
        
        {renderSection('Accessibility')}
        
        {renderSetting(
          'High Contrast Mode',
          'Increase contrast for better visibility',
          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ 
              false: isDark ? '#475569' : '#CBD5E1', 
              true: isDark ? COLORS.dark.primary : COLORS.light.primary 
            }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={isDark ? '#475569' : '#CBD5E1'}
            accessibilityLabel="High contrast mode"
            accessibilityHint="Toggle high contrast mode for better visibility"
            accessibilityState={{ checked: highContrast }}
          />
        )}
        
        {renderSetting(
          'Font Size',
          'Adjust text size for better readability',
          <Slider
            value={fontScale}
            minimumValue={0.8}
            maximumValue={2.0}
            step={0.1}
            onValueChange={setFontScale}
            style={styles.slider}
            minimumTrackTintColor={isDark ? COLORS.dark.primary : COLORS.light.primary}
            maximumTrackTintColor={isDark ? '#475569' : '#CBD5E1'}
            thumbTintColor={isDark ? COLORS.dark.primary : COLORS.light.primary}
            accessibilityLabel="Font size slider"
            accessibilityHint="Adjust the font size between 0.8 and 2.0 times normal size"
          />
        )}
        
        {renderSection('Voice Reading')}
        
        {renderSetting(
          'Speech Rate',
          'Adjust the speed of voice reading',
          <Slider
            value={speechRate}
            minimumValue={0.5}
            maximumValue={3.0}
            step={0.25}
            onValueChange={setSpeechRate}
            style={styles.slider}
            minimumTrackTintColor={isDark ? COLORS.dark.primary : COLORS.light.primary}
            maximumTrackTintColor={isDark ? '#475569' : '#CBD5E1'}
            thumbTintColor={isDark ? COLORS.dark.primary : COLORS.light.primary}
            accessibilityLabel="Speech rate slider"
            accessibilityHint="Adjust the voice reading speed between 0.5 and 3.0 times normal speed"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
  },
  settingControl: {
    alignItems: 'flex-end',
  },
  unitToggle: {
    flexDirection: 'row',
  },
  unitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  unitButtonActive: {
    borderColor: '#3B82F6',
  },
  unitText: {
    fontFamily: 'Inter-Regular',
  },
  unitTextActive: {
    fontFamily: 'Inter-SemiBold',
  },
  checkIcon: {
    marginLeft: 4,
  },
  slider: {
    width: 150,
    height: 40,
  },
});