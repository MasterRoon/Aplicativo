import { formatTemperature, formatWindSpeed, formatDate, formatTime } from '../utils/formatUtils';
import { getWeatherIconUrl, getWeatherConditionColor } from '../utils/weatherUtils';

// Mock weather data response
const mockCurrentWeather = {
  dt: 1619432400,
  sunrise: 1619411980,
  sunset: 1619458869,
  temp: 21.5,
  feels_like: 20.8,
  pressure: 1014,
  humidity: 56,
  dew_point: 12.32,
  uvi: 6.7,
  clouds: 0,
  visibility: 10000,
  wind_speed: 3.6,
  wind_deg: 150,
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }
  ]
};

const mockHourlyWeather = [
  {
    dt: 1619432400,
    temp: 21.5,
    feels_like: 20.8,
    pressure: 1014,
    humidity: 56,
    dew_point: 12.32,
    uvi: 6.7,
    clouds: 0,
    visibility: 10000,
    wind_speed: 3.6,
    wind_deg: 150,
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }
    ],
    pop: 0
  }
];

const mockDailyWeather = [
  {
    dt: 1619438400,
    sunrise: 1619411980,
    sunset: 1619458869,
    moonrise: 1619412600,
    moonset: 1619466600,
    moon_phase: 0.97,
    temp: {
      day: 21.5,
      min: 11.21,
      max: 22.71,
      night: 15.84,
      eve: 21.23,
      morn: 11.21
    },
    feels_like: {
      day: 20.8,
      night: 15.11,
      eve: 20.43,
      morn: 10.26
    },
    pressure: 1014,
    humidity: 56,
    dew_point: 12.32,
    wind_speed: 3.6,
    wind_deg: 150,
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }
    ],
    clouds: 0,
    pop: 0,
    uvi: 6.7
  }
];

describe('Weather API Response Parsing', () => {
  test('Parses current weather data correctly', () => {
    // Testing temperature formatting
    expect(formatTemperature(mockCurrentWeather.temp, true)).toBe('22°C');
    expect(formatTemperature(mockCurrentWeather.temp, false)).toBe('70°F');
    
    // Testing wind speed formatting
    expect(formatWindSpeed(mockCurrentWeather.wind_speed, true)).toBe('13 km/h');
    expect(formatWindSpeed(mockCurrentWeather.wind_speed, false)).toBe('8 mph');
    
    // Testing weather icon URL
    expect(getWeatherIconUrl(mockCurrentWeather.weather[0].icon))
      .toBe('https://openweathermap.org/img/wn/01d@2x.png');
  });

  test('Parses hourly weather data correctly', () => {
    const hourData = mockHourlyWeather[0];
    
    // Date and time formatting
    const formattedDate = formatDate(hourData.dt);
    expect(formattedDate).toHaveProperty('dayName');
    expect(formattedDate).toHaveProperty('fullDate');
    
    const formattedTime = formatTime(hourData.dt);
    expect(formattedTime).toMatch(/\d{1,2}:\d{2} [AP]M/);
    
    // Weather condition color
    const conditionColor = getWeatherConditionColor(hourData.weather[0].id);
    expect(conditionColor).toBe('#FBBF24'); // Clear sky color
  });

  test('Parses daily weather data correctly', () => {
    const dayData = mockDailyWeather[0];
    
    // Temperature formatting
    expect(formatTemperature(dayData.temp.max, true)).toBe('23°C');
    expect(formatTemperature(dayData.temp.min, true)).toBe('11°C');
    
    // Date formatting
    const formattedDate = formatDate(dayData.dt);
    expect(formattedDate.dayName).toBeDefined();
  });
});