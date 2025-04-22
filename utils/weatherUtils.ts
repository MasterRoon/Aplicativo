export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function getWeatherConditionColor(conditionId: number): string {
  // Colors for different weather conditions
  // Based on condition ID from OpenWeatherMap API
  
  // 2xx: Thunderstorm
  if (conditionId >= 200 && conditionId < 300) {
    return '#9333EA'; // Purple
  }
  
  // 3xx: Drizzle
  if (conditionId >= 300 && conditionId < 400) {
    return '#60A5FA'; // Light blue
  }
  
  // 5xx: Rain
  if (conditionId >= 500 && conditionId < 600) {
    return '#3B82F6'; // Blue
  }
  
  // 6xx: Snow
  if (conditionId >= 600 && conditionId < 700) {
    return '#E5E7EB'; // Light gray
  }
  
  // 7xx: Atmosphere (fog, mist, etc.)
  if (conditionId >= 700 && conditionId < 800) {
    return '#9CA3AF'; // Gray
  }
  
  // 800: Clear
  if (conditionId === 800) {
    return '#FBBF24'; // Yellow
  }
  
  // 80x: Clouds
  if (conditionId > 800) {
    return '#94A3B8'; // Blue-gray
  }
  
  // Default
  return '#3B82F6'; // Blue
}