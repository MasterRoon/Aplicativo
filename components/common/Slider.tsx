import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';

interface SliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  onValueChange: (value: number) => void;
  style?: any;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function Slider({
  value,
  minimumValue,
  maximumValue,
  step = 0.1,
  onValueChange,
  style,
  minimumTrackTintColor = '#3B82F6',
  maximumTrackTintColor = '#E2E8F0',
  thumbTintColor = '#3B82F6',
  accessibilityLabel,
  accessibilityHint
}: SliderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Convert value to percentage
  const getPercentage = (value: number) => {
    return ((value - minimumValue) / (maximumValue - minimumValue)) * 100;
  };
  
  // Convert percentage to value
  const getValueFromPercentage = (percentage: number) => {
    let rawValue = (percentage / 100) * (maximumValue - minimumValue) + minimumValue;
    
    // Apply step if provided
    if (step) {
      rawValue = Math.round(rawValue / step) * step;
    }
    
    // Ensure value is within bounds
    return Math.max(minimumValue, Math.min(maximumValue, rawValue));
  };
  
  // Initial position
  const initialPercentage = getPercentage(value);
  const position = useSharedValue(initialPercentage);
  
  // Update position when value changes externally
  React.useEffect(() => {
    position.value = getPercentage(value);
  }, [value]);
  
  // Gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startPosition = position.value;
    },
    onActive: (event, ctx) => {
      // Calculate new position based on translation
      const sliderWidth = 150; // This should match the width in styles
      const newPercentage = ctx.startPosition + (event.translationX / sliderWidth) * 100;
      position.value = Math.max(0, Math.min(100, newPercentage));
    },
    onEnd: () => {
      // Snap to nearest step
      const currentValue = getValueFromPercentage(position.value);
      const steppedValue = Math.round(currentValue / step) * step;
      position.value = getPercentage(steppedValue);
      
      // Call callback with new value
      onValueChange(Number(steppedValue.toFixed(2)));
    },
  });
  
  // Animated styles
  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: (position.value / 100) * 142 }], // Adjust for thumb width
    };
  });
  
  const trackStyle = useAnimatedStyle(() => {
    return {
      width: `${position.value}%`,
    };
  });
  
  // Format value for display
  const displayValue = value.toFixed(step < 1 ? 1 : 0);
  
  return (
    <View style={[styles.container, style]}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View 
          style={styles.sliderContainer}
          accessibilityRole="adjustable"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityValue={{
            min: minimumValue,
            max: maximumValue,
            now: value
          }}
        >
          <View style={[styles.track, { backgroundColor: maximumTrackTintColor }]}>
            <Animated.View 
              style={[
                styles.filledTrack, 
                trackStyle, 
                { backgroundColor: minimumTrackTintColor }
              ]} 
            />
          </View>
          <Animated.View 
            style={[
              styles.thumb, 
              thumbStyle, 
              { backgroundColor: thumbTintColor }
            ]} 
          />
        </Animated.View>
      </PanGestureHandler>
      
      <Text style={[
        styles.valueText, 
        { color: isDark ? COLORS.dark.text : COLORS.light.text }
      ]}>
        {displayValue}×
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  sliderContainer: {
    width: 150,
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  filledTrack: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    left: -8, // Half of thumb width
  },
  valueText: {
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    width: 36,
    textAlign: 'center',
  },
});