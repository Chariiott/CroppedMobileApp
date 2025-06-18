// aquaponic-assistant/src/components/AuthForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { loginUser, registerUser } from '../api'; // Import simulated API calls

/**
 * AuthForm component for user login and registration.
 * It uses simulated API calls for authentication.
 * @param {object} props - Component props.
 * @param {function} props.onAuthSuccess - Callback function to run on successful authentication.
 */
const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const userData = await loginUser(email, password);
        onAuthSuccess(userData);
      } else {
        const userData = await registerUser(email, password);
        onAuthSuccess(userData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.authTitle}>{isLogin ? 'Login' : 'Register'}</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Email</Text>
        <TextInput
          style={styles.textInput}
          placeholder="your@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Password</Text>
        <TextInput
          style={styles.textInput}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />
      </View>
      <TouchableOpacity
        style={[styles.submitButton, loading ? styles.submitButtonDisabled : {}]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>
      <Text style={styles.switchModeText}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <Text style={styles.switchModeButton} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Login'}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1F2937',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#10B981', // Green-600
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  switchModeText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    color: '#4B5563',
  },
  switchModeButton: {
    color: '#10B981', // Green-600
    fontWeight: '600',
  },
});

export default AuthForm;
