// aquaponic-assistant/src/screens/SettingsScreen.js
import React, { useState, useCallback } from 'react'; // Added useState, useCallback
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'; // Added RefreshControl
import { globalStyles } from '../styles/appStyles';
import Icon from '../components/Icon';
import AuthForm from '../components/AuthForm';
import { logoutUser } from '../api'; // Import simulated API logout

/**
 * SettingsScreen component: Displays account info if logged in, or auth forms if not.
 * @param {object} props - Component props.
 * @param {object|null} props.currentUser - The current authenticated user object (or null).
 * @param {function} props.onSignOut - Callback to handle user logout.
 * @param {function} props.onAuthSuccess - Callback for successful login/registration.
 */
const SettingsScreen = ({ currentUser, onSignOut, onAuthSuccess }) => {
  const mockLastSession = new Date().toLocaleString(); // Keep for consistency if not logged in
  const [refreshing, setRefreshing] = useState(false); // Added refreshing state

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

  const handleLogout = async () => {
    try {
      await logoutUser(currentUser?.token); // Pass token if your API needs it for logout
      onSignOut(); // Update app state after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out: " + error.message); // Use custom modal in production
    }
  };

  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={globalStyles.screenContentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#10B981']}
          tintColor="#10B981"
          progressBackgroundColor="#ffffff"
        />
      }
    >
      <Text style={styles.title}>Settings</Text>

      {currentUser ? (
        // User is logged in
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
            <Icon name="LogOut" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        // User is not logged in, show auth form
        <AuthForm onAuthSuccess={onAuthSuccess} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
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
    elevation: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  infoList: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  infoTextBold: {
    fontWeight: '600',
  },
  infoNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#4B5563',
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
    elevation: 3,
    marginTop: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SettingsScreen;
