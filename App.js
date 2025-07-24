// aquaponic-assistant/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StatusBar, Dimensions, StyleSheet } from 'react-native'; // Removed SafeAreaView, added StyleSheet
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'; // Added these imports

// Import global styles
import { globalStyles } from './src/styles/appStyles';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ManualInputScreen from './src/screens/ManualInputScreen';
import LearningScreen from './src/screens/LearningScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import components
import Header from './src/components/Header';
import FooterNav from './src/components/FooterNav.js'; // Ensure correct import path

// Import setApiBaseUrl from your api.js
import { setApiBaseUrl } from './src/api';


const { height } = Dimensions.get('window'); // Get screen height for responsive padding

// Define a key for AsyncStorage
const API_URL_STORAGE_KEY = 'api_base_url';

/**
 * RootAppContent component: Encapsulates the main app content and uses useSafeAreaInsets.
 * This component is necessary because `useSafeAreaInsets` must be used within a `SafeAreaProvider`.
 */
const RootAppContent = ({ activePage, setActivePage, currentUser, handleAuthSuccess, handleSignOut, getPageTitle, apiBaseUrl, setApiBaseUrlAndPersist }) => {
  const insets = useSafeAreaInsets(); // Get safe area insets (including bottom for Android nav bar)

  return (
    // The main container for the app's visible content
    // globalStyles.container should typically have flex: 1
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <Header title={getPageTitle(activePage)} currentUser={currentUser} />

      {/* Main content area, dynamically rendered based on activePage */}
      {/* We add paddingTop and paddingBottom to ensure content is not hidden behind fixed Header/Footer */}
      {/* The bottom padding here accounts for FooterNav height and bottom inset */}
      <View style={[
        globalStyles.mainContent,
        globalStyles.screenContentContainer, // Added for consistent horizontal padding
        {
          paddingTop: height * 0.1, // Adjusted from 0.15 to account for header
          paddingBottom: height * 0.08 + insets.bottom // Adjusted from 0.075 to account for footer + safe area
        }
      ]}>
        {activePage === 'home' && <HomeScreen setActivePage={setActivePage} />}
        {activePage === 'dashboard' && <DashboardScreen />}
        {activePage === 'manual-input' && (
          <ManualInputScreen apiBaseUrl={apiBaseUrl} />
        )}

        {activePage === 'learning' && <LearningScreen />}
        {activePage === 'settings' && (
          <SettingsScreen
            currentUser={currentUser}
            onSignOut={handleSignOut}
            onAuthSuccess={handleAuthSuccess}
            apiBaseUrl={apiBaseUrl} // Pass API URL to settings
            setApiBaseUrlAndPersist={setApiBaseUrlAndPersist} // Pass setter to settings
          />
        )}
      </View>

      {/* Footer Navigation Bar - now includes padding from safe area insets */}
      {/* We wrap FooterNav in a View and apply paddingBottom to it */}
      {/* This View matches the FooterNav's background to ensure seamless look */}
      <View style={[styles.footerWrapper, { paddingBottom: insets.bottom }]}>
        <FooterNav activePage={activePage} setActivePage={setActivePage} />
      </View>
    </View>
  );
};


/**
 * Main App component: Manages page routing and simulated authentication state.
 * Wraps the entire application in `SafeAreaProvider`.
 */
function App() {
  const [activePage, setActivePage] = useState('home'); // Default page on load
  const [currentUser, setCurrentUser] = useState(null); // Stores simulated user object
  const [apiBaseUrl, setApiBaseUrlState] = useState(''); // New state for API URL

  // Function to set API URL and persist it
  const setApiBaseUrlAndPersist = useCallback(async (url) => {
    setApiBaseUrlState(url); // Update local state
    setApiBaseUrl(url); // Update the variable in api.js
    try {
      await AsyncStorage.setItem(API_URL_STORAGE_KEY, url); // Persist to AsyncStorage
      console.log("API URL persisted:", url);
    } catch (e) {
      console.error("Failed to persist API URL:", e);
    }
  }, []);

  // --- Load API URL and Current User on App Start ---
  useEffect(() => {
    const loadInitialData = async () => {
      // Load API URL
      try {
        const storedApiUrl = await AsyncStorage.getItem(API_URL_STORAGE_KEY);
        if (storedApiUrl) {
          setApiBaseUrlAndPersist(storedApiUrl); // Set and persist (updates api.js)
        } else {
          // Set a default if nothing is stored (e.g., your ngrok URL or a local IP)
          const defaultUrl = 'https://0993-2a09-bac5-55f9-18d2-00-279-4b.ngrok-free.app/api';
          setApiBaseUrlAndPersist(defaultUrl);
        }
      } catch (e) {
        console.error("Failed to load stored API URL:", e);
        // Fallback to default if loading fails
        const defaultUrl = 'https://0993-2a09-bac5-55f9-18d2-00-279-4b.ngrok-free.app/api';
        setApiBaseUrlAndPersist(defaultUrl);
      }

      // Load Current User
      try {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load stored user data from AsyncStorage:", e);
        await AsyncStorage.removeItem('currentUser'); // Clear invalid data
      }
    };
    loadInitialData();
  }, [setApiBaseUrlAndPersist]); // Dependency on setApiBaseUrlAndPersist to ensure it's stable

  /**
   * Handles successful login or registration.
   * Stores mock user data in AsyncStorage and redirects to dashboard.
   * @param {object} userData - Mock user data (e.g., { email, id, mockToken }).
   */
  const handleAuthSuccess = async (userData) => {
    setCurrentUser(userData);
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(userData)); // Store simulated user
    } catch (e) {
      console.error("Failed to save user data to AsyncStorage:", e);
    }
  };

  /**
   * Handles user logout.
   * Clears mock user data from AsyncStorage and redirects to home page.
   */
  const handleSignOut = async () => {
    setCurrentUser(null);
    try {
      await AsyncStorage.removeItem('currentUser'); // Clear simulated user
    } catch (e) {
      console.error("Failed to remove user data from AsyncStorage:", e);
    }
  };

  /**
   * Helper function to get the appropriate title for the Header based on the active page.
   * @param {string} page - The name of the active page.
   * @returns {string} The title for the header.
   */
  const getPageTitle = useCallback((page) => {
    switch (page) {
      case 'home': return 'Aquaponic Overview';
      case 'dashboard': return 'Farm Dashboard';
      case 'manual-input': return 'Manual Data';
      case 'learning': return 'Learn & Feedback'; // Keeping this for now, but consider "Insights"
      case 'settings': return 'App Settings';
      default: return 'Aquaponic Assistant';
    }
  }, []); // Memoize getPageTitle as it doesn't depend on external values

  return (
    // SafeAreaProvider MUST wrap your entire application at the highest level
    // for useSafeAreaInsets to work correctly throughout your component tree.
    
    <SafeAreaProvider style={globalStyles.safeArea}>
      <RootAppContent
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        handleAuthSuccess={handleAuthSuccess}
        handleSignOut={handleSignOut}
        getPageTitle={getPageTitle}
        apiBaseUrl={apiBaseUrl} // Pass apiBaseUrl to RootAppContent (and then SettingsScreen)
        setApiBaseUrlAndPersist={setApiBaseUrlAndPersist} // Pass setter to RootAppContent
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  footerWrapper: {
    // This View wraps the FooterNav and applies the bottom padding
    backgroundColor: 'white', // Match your FooterNav's background
    position: 'absolute', // FooterNav is absolutely positioned within this wrapper
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    // The paddingBottom will be applied dynamically by RootAppContent
  },
});

export default App;
