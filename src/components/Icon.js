// src/components/Icon.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { 
  Feather, 
  MaterialCommunityIcons, 
  AntDesign, 
  FontAwesome6,
  FontAwesome,
  Octicons,
  Entypo,
  MaterialIcons,
  Ionicons
} from '@expo/vector-icons';

/**
 * Enhanced Icon component that supports both emoji icons and vector icons
 * @param {object} props - Component props
 * @param {string} props.name - Name of the icon (for emoji) or vector icon
 * @param {number} [props.size=24] - Size of the icon
 * @param {string} [props.color='gray'] - Color of the icon
 * @param {string} [props.type='emoji'] - Type of icon ('emoji', 'feather', 'material', 'ant', 'awe6')
 */

const Icon = ({ name, size = 24, color = 'gray', type = 'emoji' }) => {
  // Handle vector icons
  if (type !== 'emoji') {
    switch (type) {
      case 'feather':
        return <Feather name={name} size={size} color={color} />;
      case 'matco':
        return <MaterialCommunityIcons name={name} size={size} color={color} />;
      case 'antd':
        return <AntDesign name={name} size={size} color={color} />;
      case 'awe6':
        return <FontAwesome6 name={name} size={size} color={color} />;
      case 'awe':
        return <FontAwesome name={name} size={size} color={color} />;
      case 'octi':
        return <Octicons name={name} size={size} color={color} />;
      case 'entypo':
        return <Entypo name={name} size={size} color={color} />;
      case 'matico':
        return <MaterialIcons name={name} size={size} color={color} />;
      case 'ion':
        return <Ionicons name={name} size={size} color={color} />;
      default:
        return <Feather name={name} size={size} color={color} />;
    }
  }

  // Handle emoji icons (original functionality)
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
    case 'Filter': iconChar = '🎛️'; break;
    case 'User': iconChar = '👤'; break;
    case 'LogOut': iconChar = '➡️🚪'; break;
    case 'LogIn': iconChar = '✅'; break;
    case 'UserPlus': iconChar = '➕👤'; break;
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