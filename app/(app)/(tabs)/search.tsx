import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { locationService } from '@/services/locationService';
import { LocationData } from '@/types/location';
import { useLocationStore } from '@/stores/locationStore';
import { Search, Star, MapPin } from 'lucide-react-native';
import { useSettingsStore } from '@/stores/settingsStore';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { highContrast, fontScale } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [searching, setSearching] = useState(false);
  const { favorites, addFavorite, removeFavorite, setCurrentLocation, currentLocation } = useLocationStore();

  const bgColor = highContrast 
    ? (isDark ? COLORS.highContrast.dark.background : COLORS.highContrast.light.background) 
    : (isDark ? COLORS.dark.background : COLORS.light.background);
  
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);

  const cardBgColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.card : COLORS.highContrast.light.card)
    : (isDark ? COLORS.dark.card : COLORS.light.card);

  const handleSearch = async () => {
    if (searchQuery.length < 3) {
      Alert.alert('Search Error', 'Please enter at least 3 characters');
      return;
    }
    
    setSearching(true);
    try {
      const results = await locationService.searchLocations(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to search locations. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectLocation = (location: LocationData) => {
    setCurrentLocation(location);
  };

  const toggleFavorite = (location: LocationData) => {
    const isFavorite = favorites.some(fav => fav.id === location.id);
    
    if (isFavorite) {
      removeFavorite(location.id);
    } else {
      if (favorites.length >= 3) {
        Alert.alert(
          'Favorites Limit Reached',
          'You can only have 3 favorite locations. Remove one before adding a new one.',
          [{ text: 'OK' }]
        );
        return;
      }
      addFavorite(location);
    }
  };

  const renderLocationItem = ({ item }: { item: LocationData }) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    const isSelected = currentLocation?.id === item.id;
    
    return (
      <TouchableOpacity 
        style={[
          styles.locationItem, 
          { backgroundColor: cardBgColor },
          isSelected && styles.selectedLocation
        ]}
        onPress={() => handleSelectLocation(item)}
        onLongPress={() => toggleFavorite(item)}
        delayLongPress={500}
        accessibilityLabel={`${item.name}, ${item.country}${isFavorite ? ', favorite' : ''}`}
        accessibilityHint={`Tap to select this location, long press to ${isFavorite ? 'remove from' : 'add to'} favorites`}
      >
        <View style={styles.locationInfo}>
          <Text style={[styles.locationName, { color: textColor, fontSize: 16 * fontScale }]}>
            {item.name}
          </Text>
          <Text style={[styles.locationDetail, { color: textColor, fontSize: 14 * fontScale }]}>
            {item.state ? `${item.state}, ` : ''}{item.country}
          </Text>
        </View>
        
        <View style={styles.locationActions}>
          {isSelected && (
            <MapPin 
              size={20} 
              color={isDark ? COLORS.dark.primary : COLORS.light.primary} 
              style={styles.selectedIcon}
            />
          )}
          <TouchableOpacity 
            onPress={() => toggleFavorite(item)}
            accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={styles.starButton}
          >
            <Star 
              size={20} 
              color={isFavorite ? '#F59E0B' : (isDark ? '#475569' : '#94A3B8')}
              fill={isFavorite ? '#F59E0B' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput, 
            { 
              backgroundColor: cardBgColor, 
              color: textColor,
              borderColor: isDark ? '#475569' : '#CBD5E1',
              fontSize: 16 * fontScale
            }
          ]}
          placeholder="Enter city name (min 3 chars)"
          placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          accessibilityLabel="Search location input"
          accessibilityHint="Enter at least 3 characters to search for a location"
        />
        <TouchableOpacity 
          style={[styles.searchButton, { backgroundColor: isDark ? COLORS.dark.primary : COLORS.light.primary }]}
          onPress={handleSearch}
          disabled={searching || searchQuery.length < 3}
          accessibilityLabel="Search button"
          accessibilityHint="Tap to search for the entered location"
        >
          <Search size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {favorites.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor, fontSize: 18 * fontScale }]}>
            Favorite Locations
          </Text>
          <FlatList
            data={favorites}
            renderItem={renderLocationItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            horizontal={false}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor, fontSize: 18 * fontScale }]}>
          {searchResults.length > 0 ? 'Search Results' : 'Search for a location'}
        </Text>
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderLocationItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: textColor, fontSize: 16 * fontScale }]}>
              {searching ? 'Searching...' : 'Enter a location name and tap search'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontFamily: 'Inter-Regular',
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedLocation: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  locationDetail: {
    fontFamily: 'Inter-Regular',
  },
  locationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedIcon: {
    marginRight: 12,
  },
  starButton: {
    padding: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});