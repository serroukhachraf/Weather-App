const weatherIcons = {
  "01d": "sun.png",
  "01n": "sun.png",
  "02d": "cloudy1.png",
  "02n": "cloudy1.png",
  "03d": "cloudy2.png",
  "03n": "cloudy2.png",
  "04d": "cloudy.png",
  "04n": "cloudy.png",
  "09d": "weather.png",
  "09n": "weather.png",
  "10d": "weather.png",
  "10n": "weather.png",
  "11d": "weather.png",
  "11n": "weather.png",
  "13d": "weather.png",
  "13n": "weather.png",
  "50d": "cloud.png",
  "50n": "cloud.png",
};

export const getWeatherIcon = (icon) => {
  return `/icons/${weatherIcons[icon] || "default.png"}`;
};
