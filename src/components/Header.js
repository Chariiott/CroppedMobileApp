// aquaponic-assistant/src/components/Header.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon'; // Custom Icon component
import { Feather } from '@expo/vector-icons'; 

/**
 * Header component displayed at the top of the app.
 * Adapted for React Native styling.
 * @param {object} props - Component props.
 * @param {string} props.title - The title of the current page.
 * @param {object|null} props.currentUser - The current authenticated user object (or null if not logged in).
 */
const Header = ({ title, currentUser }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    {currentUser && (
      <View style={styles.userInfo}>
        <Feather name="user" size={16} color="#6B7280" />
        <Text style={styles.userName}>
          {currentUser.email ? currentUser.email.split('@')[0] : 'User'}
        </Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 40, // Adjust for status bar on mobile
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Android shadow
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937', // Gray-800
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    color: '#6B7280', // Gray-500
    marginLeft: 5,
  },
});

export default Header;
