import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { HourlyWeatherData } from '@/types/weather';
import { VictoryLine, VictoryAxis, VictoryChart, VictoryTheme, VictoryScatter } from 'victory-native';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatTemperature, formatWindSpeed, formatTime } from '@/utils/formatUtils';

interface WeatherGraphProps {
  hourlyData: HourlyWeatherData[];
}

type DataType = 'temperature' | 'humidity' | 'wind';

export function WeatherGraph({ hourlyData }: WeatherGraphProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { useCelsius, useKmh, highContrast, fontScale } = useSettingsStore();
  const [activeType, setActiveType] = useState<DataType>('temperature');
  
  const textColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.text : COLORS.highContrast.light.text)
    : (isDark ? COLORS.dark.text : COLORS.light.text);
  
  const cardBgColor = highContrast
    ? (isDark ? COLORS.highContrast.dark.card : COLORS.highContrast.light.card)
    : (isDark ? COLORS.dark.card : COLORS.light.card);

  const primaryColor = isDark ? COLORS.dark.primary : COLORS.light.primary;
  const secondaryColor = isDark ? COLORS.dark.secondary : COLORS.light.secondary;
  const accentColor = isDark ? COLORS.dark.accent : COLORS.light.accent;

  // Prepare data for the graph
  const graphData = hourlyData.map((hour, index) => {
    // Take every 3 hours to avoid overcrowding
    if (index % 3 === 0 || index === hourlyData.length - 1) {
      let y: number;
      
      switch (activeType) {
        case 'temperature':
          y = hour.temp;
          break;
        case 'humidity':
          y = hour.humidity;
          break;
        case 'wind':
          y = hour.wind_speed;
          break;
      }
      
      return {
        x: index,
        y,
        time: formatTime(hour.dt)
      };
    }
    return null;
  }).filter(Boolean);

  // Set up graph colors and styles
  const graphColor = activeType === 'temperature' 
    ? primaryColor 
    : activeType === 'humidity'
      ? secondaryColor
      : accentColor;
  
  const getYAxisLabel = () => {
    switch (activeType) {
      case 'temperature':
        return useCelsius ? '°C' : '°F';
      case 'humidity':
        return '%';
      case 'wind':
        return useKmh ? 'km/h' : 'mph';
    }
  };

  const formatYAxis = (value: number) => {
    switch (activeType) {
      case 'temperature':
        return formatTemperature(value, useCelsius, false);
      case 'humidity':
        return `${value}%`;
      case 'wind':
        return formatWindSpeed(value, useKmh, false);
    }
  };

  const getDataTypeButtonStyle = (type: DataType) => [
    styles.dataTypeButton,
    activeType === type && { backgroundColor: graphColor },
  ];

  const getDataTypeTextStyle = (type: DataType) => [
    styles.dataTypeText,
    { fontSize: 14 * fontScale },
    activeType === type ? { color: '#FFFFFF' } : { color: textColor },
  ];

  return (
    <View style={[styles.container, { backgroundColor: cardBgColor }]}>
      <View style={styles.dataTypeButtons}>
        <TouchableOpacity 
          style={getDataTypeButtonStyle('temperature')}
          onPress={() => setActiveType('temperature')}
          accessibilityLabel="Temperature graph"
          accessibilityState={{ selected: activeType === 'temperature' }}
        >
          <Text style={getDataTypeTextStyle('temperature')}>Temperature</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={getDataTypeButtonStyle('humidity')}
          onPress={() => setActiveType('humidity')}
          accessibilityLabel="Humidity graph"
          accessibilityState={{ selected: activeType === 'humidity' }}
        >
          <Text style={getDataTypeTextStyle('humidity')}>Humidity</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={getDataTypeButtonStyle('wind')}
          onPress={() => setActiveType('wind')}
          accessibilityLabel="Wind speed graph"
          accessibilityState={{ selected: activeType === 'wind' }}
        >
          <Text style={getDataTypeTextStyle('wind')}>Wind</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        <VictoryChart
          width={Dimensions.get('window').width - 64}
          height={200}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
          domainPadding={{ x: 10, y: 10 }}
        >
          <VictoryAxis
            tickFormat={(x) => {
              const dataPoint = graphData.find(point => point?.x === x);
              return dataPoint ? dataPoint.time : '';
            }}
            style={{
              axis: { stroke: isDark ? '#475569' : '#CBD5E1' },
              tickLabels: { 
                fill: textColor,
                fontSize: 12 * fontScale,
                fontFamily: 'Inter-Regular'
              }
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={formatYAxis}
            style={{
              axis: { stroke: isDark ? '#475569' : '#CBD5E1' },
              tickLabels: { 
                fill: textColor,
                fontSize: 12 * fontScale,
                fontFamily: 'Inter-Regular'
              }
            }}
            label={getYAxisLabel()}
            axisLabelComponent={
              <VictoryLabel style={{ fill: textColor, fontFamily: 'Inter-Regular' }} />
            }
          />
          <VictoryLine
            data={graphData}
            style={{
              data: { stroke: graphColor, strokeWidth: 2 }
            }}
            interpolation="monotoneX"
          />
          <VictoryScatter
            data={graphData}
            size={5}
            style={{
              data: { fill: graphColor }
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  dataTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  dataTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  dataTypeText: {
    fontFamily: 'Inter-SemiBold',
  },
  chartContainer: {
    alignItems: 'center',
  },
});