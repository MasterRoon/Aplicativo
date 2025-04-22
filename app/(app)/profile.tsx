import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import { useWeatherHistoryStore } from '@/stores/weatherHistoryStore';
import { Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { WeatherHistoryItem } from '@/components/profile/WeatherHistoryItem';
import { formatDate } from '@/utils/dateUtils';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { highContrast, fontScale } = useSettingsStore();
  const { getHistory, clearHistory } = useWeatherHistoryStore();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const bgColor = highContrast 
    ? (isDark ? COLORS.highContrast.dark.background : COLORS.highContrast.light.background) 
    : (isDark ? COLORS.dark.background : COLORS.light.background);
  
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const historyData = await getHistory();
      setHistory(historyData || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={[styles.emptyStateText, { color: textColor, fontSize: 16 * fontScale }]}>
        No weather history available yet.
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: textColor, fontSize: 14 * fontScale }]}>
        Weather data will appear here as you check different locations.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: isDark ? COLORS.dark.card : COLORS.light.card },
          headerTintColor: textColor,
          headerTitle: "Profile",
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

      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: textColor, fontSize: 20 * fontScale }]}>
          Weather History
        </Text>
        <Text style={[styles.headerSubtitle, { color: textColor, fontSize: 14 * fontScale }]}>
          Last 5 days of weather checks
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? COLORS.dark.primary : COLORS.light.primary} />
          <Text style={[styles.loadingText, { color: textColor, fontSize: 16 * fontScale }]}>
            Loading history...
          </Text>
        </View>
      ) : (
        <>
          {history.length > 0 ? (
            <>
              <FlatList
                data={history}
                renderItem={({ item }) => (
                  <WeatherHistoryItem 
                    item={item} 
                    isDark={isDark} 
                    fontScale={fontScale}
                    highContrast={highContrast}
                  />
                )}
                keyExtractor={(item, index) => `${item.location.id}-${index}`}
                contentContainerStyle={styles.listContent}
              />
              
              <TouchableOpacity 
                style={[
                  styles.clearButton, 
                  { backgroundColor: isDark ? '#EF4444' : '#F87171' }
                ]}
                onPress={handleClearHistory}
                accessibilityLabel="Clear history"
                accessibilityHint="Removes all weather history data"
              >
                <Text style={[styles.clearButtonText, { fontSize: 16 * fontScale }]}>
                  Clear History
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            renderEmptyState()
          )}
        </>
      )}
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
  headerContainer: {
    padding: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    marginTop: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    maxWidth: '80%',
  },
  clearButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});