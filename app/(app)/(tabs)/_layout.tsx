import { Tabs } from 'expo-router';
import { Home, Search, Settings } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { highContrast } = useSettingsStore();
  
  // Select appropriate colors based on current theme and contrast settings
  const activeColor = highContrast 
    ? (isDark ? COLORS.highContrast.dark.primary : COLORS.highContrast.light.primary)
    : (isDark ? COLORS.dark.primary : COLORS.light.primary);
  
  const inactiveColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.inactive : COLORS.highContrast.light.inactive)
    : (isDark ? COLORS.dark.inactive : COLORS.light.inactive);
  
  const backgroundColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.card : COLORS.highContrast.light.card)
    : (isDark ? COLORS.dark.card : COLORS.light.card);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopColor: isDark ? '#2D3748' : '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 12,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}