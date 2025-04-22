import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import { Wifi, WifiOff } from 'lucide-react-native';
import NetInfo from '@react-native-community/netinfo';

export function NetworkStatus() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { highContrast, fontScale } = useSettingsStore();
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [showBanner, setShowBanner] = useState(false);
  const bannerOpacity = new Animated.Value(0);
  
  useEffect(() => {
    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    // Show banner when offline
    if (isConnected === false) {
      setShowBanner(true);
      Animated.timing(bannerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else if (isConnected === true && showBanner) {
      // Hide banner when back online
      Animated.timing(bannerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setShowBanner(false);
      });
    }
  }, [isConnected]);
  
  if (!showBanner) return null;
  
  return (
    <Animated.View 
      style={[
        styles.banner, 
        { 
          backgroundColor: isConnected 
            ? (isDark ? COLORS.dark.success : COLORS.light.success)
            : (isDark ? COLORS.dark.warning : COLORS.light.warning),
          opacity: bannerOpacity
        }
      ]}
      accessibilityLiveRegion="polite"
      accessibilityLabel={isConnected ? "Network connected" : "No connection - showing cached data"}
    >
      {isConnected === false ? (
        <>
          <WifiOff size={16} color="#FFFFFF" style={styles.icon} />
          <Text style={[styles.bannerText, { fontSize: 14 * fontScale }]}>
            No connection - showing cached data
          </Text>
        </>
      ) : (
        <>
          <Wifi size={16} color="#FFFFFF" style={styles.icon} />
          <Text style={[styles.bannerText, { fontSize: 14 * fontScale }]}>
            Connected
          </Text>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  bannerText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});