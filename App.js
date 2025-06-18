import React, { useState, useEffect } from 'react';
import { View, StatusBar, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
import FooterNav from './src/components/FooterNav';

const { height } = Dimensions.get('window');

// Custom SafeAreaView replacement to avoid the warning
const SafeContainer = ({ children }) => (
  <View style={[
    globalStyles.safeArea,
    { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }
  ]}>
    {children}
  </View>
);

function App() {
  const [activePage, setActivePage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user data:", e);
        await AsyncStorage.removeItem('currentUser');
      }
    };
    loadCurrentUser();
  }, []);

  const handleAuthSuccess = async (userData) => {
    setCurrentUser(userData);
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save user data:", e);
    }
    setActivePage('dashboard');
  };

  const handleSignOut = async () => {
    setCurrentUser(null);
    try {
      await AsyncStorage.removeItem('currentUser');
    } catch (e) {
      console.error("Failed to remove user data:", e);
    }
    setActivePage('home');
  };

  const getPageTitle = (page) => {
    switch (page) {
      case 'home': return 'Aquaponic Overview';
      case 'dashboard': return 'Farm Dashboard';
      case 'manual-input': return 'Manual Data';
      case 'learning': return 'Learn & Feedback';
      case 'settings': return 'App Settings';
      default: return 'Aquaponic Assistant';
    }
  };


  return (
    <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <Header title={getPageTitle(activePage)} currentUser={currentUser} />
        <View style={[globalStyles.mainContent,globalStyles.screenContentContainer, {paddingTop: height * 0.15, paddingBottom: height * 0.075 }]}>
          {activePage === 'home' ? <HomeScreen /> : null}
          {activePage === 'dashboard' ? <DashboardScreen /> : null}
          {activePage === 'manual-input' ? <ManualInputScreen /> : null}
          {activePage === 'learning' ? <LearningScreen /> : null}
          {activePage === 'settings' ? (<SettingsScreen currentUser={currentUser} onSignOut={handleSignOut} onAuthSuccess={handleAuthSuccess}/>) : null}
        </View>
        <FooterNav activePage={activePage} setActivePage={setActivePage} />
    </SafeAreaProvider>
  );
}

export default App;