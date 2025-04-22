import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import { Stack } from 'expo-router';
import { ChevronLeft, Home, Search, Settings, User, HelpCircle, Volume2 } from 'lucide-react-native';
import { useSpeech } from '@/hooks/useSpeech';

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { highContrast, fontScale } = useSettingsStore();
  const { speak } = useSpeech();

  const bgColor = highContrast 
    ? (isDark ? COLORS.highContrast.dark.background : COLORS.highContrast.light.background) 
    : (isDark ? COLORS.dark.background : COLORS.light.background);
  
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);

  const cardBgColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.card : COLORS.highContrast.light.card)
    : (isDark ? COLORS.dark.card : COLORS.light.card);

  const helpSections = [
    {
      title: 'Home Screen',
      icon: <Home size={24} color={isDark ? COLORS.dark.primary : COLORS.light.primary} />,
      content: 'The Home screen displays the current weather for your selected location. You can see the current temperature, condition, and thermal sensation. The screen also shows hourly and daily forecasts. You can share the weather information by tapping the share button, or have it read aloud by tapping the voice button.'
    },
    {
      title: 'Search Screen',
      icon: <Search size={24} color={isDark ? COLORS.dark.primary : COLORS.light.primary} />,
      content: 'The Search screen allows you to find locations by entering at least 3 characters of a city name. Tap on a location to select it as your current location. Long press on a location to add it to or remove it from your favorites. You can have up to 3 favorite locations.'
    },
    {
      title: 'Settings Screen',
      icon: <Settings size={24} color={isDark ? COLORS.dark.primary : COLORS.light.primary} />,
      content: 'The Settings screen allows you to customize the app. You can change temperature units (Celsius/Fahrenheit), wind speed units (km/h or mph), and accessibility settings like high contrast mode and font size. You can also adjust the speech rate for voice reading.'
    },
    {
      title: 'Profile Screen',
      icon: <User size={24} color={isDark ? COLORS.dark.primary : COLORS.light.primary} />,
      content: 'The Profile screen shows your weather check history for the last 5 days. Each entry shows the location name, date, and weather information at the time of check. You can clear your history by tapping the Clear History button at the bottom of the screen.'
    },
    {
      title: 'Voice Reading',
      icon: <Volume2 size={24} color={isDark ? COLORS.dark.primary : COLORS.light.primary} />,
      content: 'Voice reading allows the app to read weather information aloud. Tap the voice button on the Home screen to start or stop voice reading. You can adjust the speech rate in the Settings screen.'
    },
    {
      title: 'Offline Mode',
      icon: <HelpCircle size={24} color={isDark ? COLORS.dark.primary : COLORS.light.primary} />,
      content: 'When you have no internet connection, the app will show cached weather data if available. A message will appear indicating that you\'re viewing cached data.'
    }
  ];

  const handleReadSection = (title: string, content: string) => {
    speak(`${title}. ${content}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: isDark ? COLORS.dark.card : COLORS.light.card },
          headerTintColor: textColor,
          headerTitle: "Help",
          headerTitleStyle: { 
            fontFamily: 'Inter-SemiBold', 
            fontSize: 18 * fontScale 
          },
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                // Navigate back to the home tab
                // For Expo Router, this will depend on how navigation is set up
              }}
            >
              <ChevronLeft size={24} color={textColor} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.pageTitle, { color: textColor, fontSize: 22 * fontScale }]}>
          How to Use the App
        </Text>
        
        {helpSections.map((section, index) => (
          <View 
            key={index} 
            style={[styles.helpSection, { backgroundColor: cardBgColor }]}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                {section.icon}
              </View>
              <Text style={[styles.sectionTitle, { color: textColor, fontSize: 18 * fontScale }]}>
                {section.title}
              </Text>
              <TouchableOpacity 
                style={styles.readButton}
                onPress={() => handleReadSection(section.title, section.content)}
                accessibilityLabel={`Read ${section.title} help section`}
                accessibilityHint={`Reads the ${section.title} help information aloud`}
              >
                <Volume2 size={20} color={isDark ? COLORS.dark.primary : COLORS.light.primary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.sectionContent, { color: textColor, fontSize: 16 * fontScale }]}>
              {section.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
  },
  pageTitle: {
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  helpSection: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  readButton: {
    padding: 8,
  },
  sectionContent: {
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 24,
  },
});