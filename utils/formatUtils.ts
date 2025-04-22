// Format temperature according to the selected unit
export function formatTemperature(temp: number, useCelsius: boolean, includeUnit: boolean = true): string {
  if (useCelsius) {
    return `${Math.round(temp)}${includeUnit ? '°C' : ''}`;
  } else {
    // Convert Celsius to Fahrenheit: F = C * 9/5 + 32
    const fahrenheit = (temp * 9/5) + 32;
    return `${Math.round(fahrenheit)}${includeUnit ? '°F' : ''}`;
  }
}

// Format wind speed according to the selected unit
export function formatWindSpeed(speed: number, useKmh: boolean, includeUnit: boolean = true): string {
  if (useKmh) {
    // OpenWeatherMap provides wind speed in m/s, convert to km/h
    const kmh = speed * 3.6;
    return `${Math.round(kmh)}${includeUnit ? ' km/h' : ''}`;
  } else {
    // Convert to mph: mph = m/s * 2.237
    const mph = speed * 2.237;
    return `${Math.round(mph)}${includeUnit ? ' mph' : ''}`;
  }
}

// Format date from Unix timestamp (seconds)
export function formatDate(timestamp: number): { dayName: string; fullDate: string } {
  const date = new Date(timestamp * 1000);
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  
  return {
    dayName,
    fullDate: `${day} ${month}`,
  };
}

// Format time from Unix timestamp (seconds)
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  return `${hours}:${minutes} ${ampm}`;
}