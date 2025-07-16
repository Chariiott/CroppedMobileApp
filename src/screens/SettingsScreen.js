// aquaponic-assistant/src/screens/SettingsScreen.js
import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Alert, // Used for showing messages instead of 'alert()'
  KeyboardAvoidingView, // For handling keyboard overlap
  Platform // To differentiate between iOS and Android for KeyboardAvoidingView behavior
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather for logout icon
import { globalStyles } from '../styles/appStyles';
import Icon from '../components/Icon'; // Custom Icon component (for other icons if still used)
import AuthForm from '../components/AuthForm';
import { logoutUser } from '../api'; // Import simulated API logout

/**
 * SettingsScreen component: Displays account info if logged in, or auth forms if not.
 * Allows user to configure API base URL.
 * @param {object} props - Component props.
 * @param {object|null} props.currentUser - The current authenticated user object (or null).
 * @param {function} props.onSignOut - Callback to handle user logout.
 * @param {function} props.onAuthSuccess - Callback for successful login/registration.
 * @param {string} props.apiBaseUrl - The current API base URL.
 * @param {function} props.setApiBaseUrlAndPersist - Function to set and persist the API base URL.
 */
const SettingsScreen = ({ currentUser, onSignOut, onAuthSuccess, apiBaseUrl, setApiBaseUrlAndPersist }) => {
  const mockLastSession = new Date().toLocaleString(); // Keep for consistency if not logged in
  const [refreshing, setRefreshing] = useState(false); // Added refreshing state
  const [apiInputUrl, setApiInputUrl] = useState(apiBaseUrl); // State for the input field

  // Update input field when apiBaseUrl prop changes from App.js (e.g., on initial load)
  useEffect(() => {
    setApiInputUrl(apiBaseUrl);
  }, [apiBaseUrl]);

  // Simulated refresh for SettingsScreen
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('Refreshing Settings screen content...');
    // Simulate data re-initialization or fetching (e.g., if preferences were loaded from API)
    setTimeout(() => {
      setRefreshing(false);
      console.log('Settings screen refresh complete.');
    }, 1500); // Simulate a 1.5 second loading time
  }, []);

  /**
   * Handles user logout.
   * Calls the simulated logout API and updates app state.
   */
  const handleLogout = async () => {
    try {
      await logoutUser(currentUser?.token); // Pass token if your API needs it for logout
      onSignOut(); // Update app state after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Logout Failed", error.message); // Use Alert from RN instead of window.alert
    }
  };

  /**
   * Handles saving the new API URL entered by the user.
   * Performs basic validation and calls the persistence function from App.js.
   */
  const handleSaveApiUrl = () => {
    // Basic validation for URL format
    if (!apiInputUrl.startsWith('http://') && !apiInputUrl.startsWith('https://')) {
      Alert.alert("Invalid URL", "Please enter a valid URL starting with http:// or https://");
      return;
    }
    // Ensure it ends with /api if it's a base URL for API endpoints
    // This assumes your .NET API always has a /api suffix. Adjust if your API is different.
    const formattedUrl = apiInputUrl.endsWith('/api') ? apiInputUrl : `${apiInputUrl}/api`;

    setApiBaseUrlAndPersist(formattedUrl); // Call the function passed from App.js
    Alert.alert("API URL Saved", `API Base URL set to:\n${formattedUrl}`);
  };

  return (
    // KeyboardAvoidingView helps prevent the keyboard from obscuring input fields
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' for iOS, 'height' for Android
      style={{ flex: 1 }} // It must take up the full available space
      // Adjust keyboardVerticalOffset if your header or other elements are causing issues
      // A common value for iOS is the header height + status bar height.
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        style={globalStyles.screenContainer}
        contentContainerStyle={globalStyles.screenContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10B981']} // Green-600
            tintColor="#10B981" // Green-600
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <Text style={styles.title}>Settings</Text>

        {currentUser ? (
          // User is logged in: Show account info, preferences, and logout button
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Account Information</Text>
              <View style={styles.infoList}>
                <Text style={styles.infoText}><Text style={styles.infoTextBold}>Email:</Text> {currentUser.email || 'N/A'}</Text>
                <Text style={styles.infoText}><Text style={styles.infoTextBold}>User ID:</Text> {currentUser.id || 'N/A'}</Text>
                <Text style={styles.infoText}><Text style={styles.infoTextBold}>Last Session:</Text> {mockLastSession}</Text>
                <Text style={styles.infoNote}>
                  (Note: User profiles and farm details would be managed via your .NET API.)
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>App Preferences</Text>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Receive Push Notifications</Text>
                {/* Placeholder for a React Native Switch component */}
                <View style={styles.toggleSwitch} />
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Dark Mode</Text>
                {/* Placeholder for a React Native Switch component */}
                <View style={styles.toggleSwitch} />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              {/* Using Feather icon for logout */}
              <Feather name="log-out" size={20} color="white" />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          // User is not logged in: Show authentication form
          <AuthForm onAuthSuccess={onAuthSuccess} />
        )}

        {/* API IP Address Configuration Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>API Configuration</Text>
          <Text style={styles.infoText}>Current API Base URL:</Text>
          {/* Display the active API URL */}
          <Text style={[styles.infoTextBold, styles.currentApiUrl]}>{apiBaseUrl || 'Not Set'}</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Enter New API Base URL:</Text>
            <TextInput
              style={styles.textInput}
              value={apiInputUrl+'/api'}
              onChangeText={setApiInputUrl}
              placeholder="e.g., https://your-server.ngrok.io/api"
              autoCapitalize="none" // Prevent auto-capitalization for URLs
              keyboardType="url" // Optimize keyboard for URL input
              autoCorrect={false} // Disable auto-correction for URLs
            />
          </View>
          <TouchableOpacity
            onPress={handleSaveApiUrl}
            style={styles.saveApiButton}
          >
            <Text style={styles.saveApiButtonText}>Save API URL</Text>
          </TouchableOpacity>
          <Text style={styles.infoNote}>
            (Ensure your URL includes the full path to your API, e.g., `https://your-domain.com/api`)
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937', // Gray-800
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Android shadow
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151', // Gray-700
    marginBottom: 12,
  },
  infoList: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563', // Gray-600
    marginBottom: 4,
  },
  infoTextBold: {
    fontWeight: '600',
  },
  infoNote: {
    fontSize: 12,
    color: '#6B7280', // Gray-500
    marginTop: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', // Gray-100
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#4B5563', // Gray-600
  },
  toggleSwitch: {
    width: 40,
    height: 20,
    backgroundColor: '#D1D5DB', // Gray-300 (off state)
    borderRadius: 10,
    // Add more styling here for the active state to mimic a toggle
  },
  logoutButton: {
    backgroundColor: '#EF4444', // Red-500
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    marginTop: 16,
    marginBottom: 16, // Add margin bottom to separate from API config
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  // New styles for API Configuration section
  currentApiUrl: {
    color: '#10B981', // Green-600
    marginBottom: 12,
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // Gray-700
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // Gray-300
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937', // Gray-800
    backgroundColor: 'white',
  },
  saveApiButton: {
    backgroundColor: '#3B82F6', // Blue-500
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    marginTop: 8,
  },
  saveApiButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SettingsScreen;
