import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, HelpCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';

function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const textColor = isDark ? COLORS.light.text : COLORS.dark.text;
  const bgColor = isDark ? COLORS.dark.background : COLORS.light.background;

  return (
    <DrawerContentScrollView 
      {...props}
      contentContainerStyle={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: bgColor
      }}
    >
      <View style={[styles.header, { backgroundColor: isDark ? COLORS.dark.card : COLORS.light.card }]}>
        <Text style={[styles.title, { color: textColor }]}>Weather Forecast</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: isDark ? COLORS.light.primary : COLORS.dark.primary,
        drawerInactiveTintColor: isDark ? COLORS.light.text : COLORS.dark.text,
        drawerStyle: {
          backgroundColor: isDark ? COLORS.dark.background : COLORS.light.background,
          width: 280,
        }
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Weather",
          drawerLabel: "Weather",
          drawerIcon: ({ color, size }) => (
            <HelpCircle color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerLabel: "Profile",
          drawerIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="help"
        options={{
          title: "Help",
          drawerLabel: "Help",
          drawerIcon: ({ color, size }) => (
            <HelpCircle color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    marginBottom: 8
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  }
});