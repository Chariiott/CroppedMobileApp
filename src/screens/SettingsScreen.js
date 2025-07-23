import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '../styles/appStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDataFromApi, postDataToApi } from '../api';
import bcrypt from 'bcryptjs';

// Fallback RNG for Expo/React Native environments
bcrypt.setRandomFallback(len => {
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = Math.floor(Math.random() * 256);
  }
  return buf;
});

const SettingsScreen = ({ currentUser, onSignOut, onAuthSuccess, apiBaseUrl, setApiBaseUrlAndPersist }) => {
  const mockLastSession = new Date().toLocaleString();
  const [refreshing, setRefreshing] = useState(false);
  const [apiInputUrl, setApiInputUrl] = useState(apiBaseUrl);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setApiInputUrl(apiBaseUrl);
  }, [apiBaseUrl]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleRegister = async () => {
    if (!email || !username || !password) {
      Alert.alert("Missing Info", "Fill in email, username, and password.");
      return;
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 4);

      const payload = {
        Email: email,
        Username: username,
        PasswordHash: hashedPassword,
        CreatedAt: new Date().toISOString(),
        Role: "user"
      };

      const result = await postDataToApi('Users/AddUser', payload);
      console.log("User registered:", payload);
      Alert.alert("Success", result || "User registered.");
      setEmail('');
      setUsername('');
      setPassword('');

      const users = await fetchDataFromApi('Users/GetAllUsers');
      const foundUser = users.find(user => user.Email === payload.Email);
      if (foundUser) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(foundUser));
        onAuthSuccess(foundUser);
      }
    } catch (err) {
      console.log("Register error:", err);
      Alert.alert("Register Failed", err.message);
    }
  };

  const handleLogin = async () => {
    if (!loginInput || !password) {
      Alert.alert("Missing Info", "Fill in login and password.");
      return;
    }

    try {
      const users = await fetchDataFromApi('Users/GetAllUsers');

      const foundUser = users.find(user =>
        (user.Email.toLowerCase() === loginInput.toLowerCase() ||
         user.Username.toLowerCase() === loginInput.toLowerCase()) &&
        bcrypt.compareSync(password, user.PasswordHash)
      );

      if (foundUser) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(foundUser));
        onAuthSuccess(foundUser);
        setLoginInput('');
        setPassword('');
        console.log("User logged in:", foundUser);
        Alert.alert("Login Success", `Welcome ${foundUser.Username}`);
      } else {
        Alert.alert("Login Failed", "Incorrect username/email or password.");
      }
    } catch (err) {
      console.log("Login error:", err);
      Alert.alert("Login Error", err.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    onSignOut();
    console.log("User logged out");
    Alert.alert("Logged Out", "User data cleared.");
  };

  const handleSaveApiUrl = () => {
    if (!apiInputUrl.startsWith('http://') && !apiInputUrl.startsWith('https://')) {
      Alert.alert("Invalid URL", "Must start with http:// or https://");
      return;
    }
    const formatted = apiInputUrl.endsWith('/api') ? apiInputUrl : `${apiInputUrl}/api`;
    setApiBaseUrlAndPersist(formatted);
    Alert.alert("API URL Saved", `Set to:\n${formatted}`);
  };

  const passwordInput = (value, onChange) => (
    <View style={styles.passwordRow}>
      <TextInput
        placeholder="Password"
        style={[styles.input, styles.passwordInput]}
        value={value}
        secureTextEntry={!showPassword}
        onChangeText={onChange}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Feather
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color="#6B7280"
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
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

        {currentUser && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Information</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoText}><Text style={styles.infoTextBold}>Email:</Text> {currentUser.Email || 'N/A'}</Text>
              <Text style={styles.infoText}><Text style={styles.infoTextBold}>User ID:</Text> {currentUser.UserId || 'N/A'}</Text>
              <Text style={styles.infoText}><Text style={styles.infoTextBold}>Last Session:</Text> {mockLastSession}</Text>
            </View>
          </View>
        )}

        {!currentUser && (isLoginMode ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login</Text>
            <TextInput
              placeholder="Email or Username"
              style={styles.input}
              value={loginInput}
              onChangeText={setLoginInput}
            />
            {passwordInput(password, setPassword)}
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.toggleText}>Don't have an account?{' '}
              <Text style={styles.toggleLink} onPress={() => {
                setIsLoginMode(false);
                setPassword('');
              }}>Register</Text>
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Register</Text>
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {passwordInput(password, setPassword)}
            <TouchableOpacity onPress={handleRegister} style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.toggleText}>Already have an account?{' '}
              <Text style={styles.toggleLink} onPress={() => {
                setIsLoginMode(true);
                setPassword('');
              }}>Login</Text>
            </Text>
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>App Preferences</Text>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Receive Push Notifications</Text>
            <View style={styles.toggleSwitch} />
          </View>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Dark Mode</Text>
            <View style={styles.toggleSwitch} />
          </View>
        </View>

        {currentUser && (
          <TouchableOpacity onPress={handleLogout} style={[styles.button, { backgroundColor: '#EF4444', marginBottom: 16 }]}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>API Configuration</Text>
          <Text style={styles.infoText}>Current API Base URL:</Text>
          <Text style={[styles.infoTextBold, styles.currentApiUrl]}>{apiBaseUrl || 'Not Set'}</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Enter New API Base URL:</Text>
            <TextInput
              style={styles.input}
              value={apiInputUrl}
              onChangeText={setApiInputUrl}
              placeholder="e.g., https://your-server.ngrok.io/api"
              autoCapitalize="none"
              keyboardType="url"
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity onPress={handleSaveApiUrl} style={[styles.button, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.buttonText}>Save API URL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '600', color: '#1F2937', marginBottom: 20 },
  card: {
    backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 12,
    fontSize: 14, color: '#1F2937', backgroundColor: 'white', marginBottom: 10
  },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  button: {
    backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center', marginTop: 5
  },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#4B5563', marginBottom: 4 },
  infoTextBold: { fontWeight: '600' },
  currentApiUrl: { color: '#10B981', marginBottom: 12, fontSize: 14 },
  preferenceItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'
  },
  preferenceLabel: { fontSize: 14, color: '#4B5563' },
  toggleSwitch: {
    width: 40, height: 20, backgroundColor: '#D1D5DB', borderRadius: 10
  },
  infoList: { marginTop: 8 },
  toggleText: { marginTop: 10, textAlign: 'center', fontSize: 14, color: '#4B5563' },
  toggleLink: { color: '#10B981', fontWeight: '600' }
});

export default SettingsScreen;
