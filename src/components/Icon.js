// aquaponic-assistant/src/components/Icon.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

/**
 * Simple Icon component using Unicode emojis for React Native.
 * In a real React Native app, you'd replace this with `react-native-vector-icons`.
 * @param {object} props - Component props.
 * @param {string} props.name - The name of the icon (e.g., 'Home', 'Dashboard').
 * @param {number} [props.size=24] - Size of the icon.
 * @param {string} [props.color='gray'] - Color of the icon.
 */
const Icon = ({ name, size = 24, color = 'gray' }) => {
  let iconChar;
  switch (name) {
    case 'Home': iconChar = '🏠'; break;
    case 'Dashboard': iconChar = '📊'; break;
    case 'ManualInput': iconChar = '📝'; break;
    case 'Learning': iconChar = '📚'; break;
    case 'Settings': iconChar = '⚙️'; break;
    case 'Bell': iconChar = '🔔'; break;
    case 'Camera': iconChar = '📸'; break;
    case 'MapPin': iconChar = '📍'; break;
    case 'WifiOff': iconChar = '🚫📶'; break;
    case 'Search': iconChar = '🔍'; break;
    case 'Filter': iconChar = '🎛️'; break; // Changed to a common filter emoji
    case 'User': iconChar = '👤'; break;
    case 'LogOut': iconChar = '➡️🚪'; break;
    case 'LogIn': iconChar = '✅'; break; // For login form
    case 'UserPlus': iconChar = '➕👤'; break; // For register form
    case 'Droplet': iconChar = '💧'; break;
    case 'Thermometer': iconChar = '🌡️'; break;
    case 'Flower': iconChar = '🌸'; break;
    case 'Leaf': iconChar = '🍃'; break;
    case 'Sun': iconChar = '☀️'; break;
    case 'CloudRain': iconChar = '☁️💧'; break;
    default: iconChar = '❓';
  }
  return <Text style={[{ fontSize: size, color }, styles.iconBase]}>{iconChar}</Text>;
};

const styles = StyleSheet.create({
  iconBase: {
    // Add any base styles applicable to all icons
  },
});

export default Icon;
