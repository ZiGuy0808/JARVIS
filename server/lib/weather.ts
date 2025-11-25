export async function getWeather() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    // Return fallback data if no API key
    return {
      temp: 72,
      condition: 'Clear',
      icon: '01d',
      location: 'Malibu'
    };
  }

  try {
    // Default to Malibu, CA (Tony Stark's location!)
    const lat = 34.0259;
    const lon = -118.7798;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const data = await response.json();

    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      location: data.name
    };
  } catch (error) {
    console.error('Weather API error:', error);
    // Return fallback data
    return {
      temp: 72,
      condition: 'Clear',
      icon: '01d',
      location: 'Malibu'
    };
  }
}
