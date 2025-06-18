// aquaponic-assistant/src/screens/LearningScreen.js
import React, { useState, useCallback } from 'react'; // Added useState, useCallback
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'; // Added RefreshControl
import { globalStyles } from '../styles/appStyles';

/**
 * LearningScreen component: Provides resources and a feedback mechanism.
 * Adapted for React Native components and styling.
 */
const LearningScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Simulated refresh for LearningScreen (as it uses static content)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('Refreshing Learning screen content...');
    // Simulate data fetching/re-initialization
    setTimeout(() => {
      setRefreshing(false);
      console.log('Learning screen refresh complete.');
    }, 1500); // Simulate a 1.5 second loading time
  }, []);

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
      <Text style={styles.title}>Learning & Resources</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Guides & Tutorials</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Beginner's Guide to Aquaponics</Text>
          <Text style={styles.listItem}>• Troubleshooting Common Plant Issues</Text>
          <Text style={styles.listItem}>• Nutrient Management in Aquaponics</Text>
          <Text style={styles.listItem}>• Sensor Calibration Best Practices</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Feedback & Improvements</Text>
        <Text style={styles.cardText}>
          Your feedback helps us make the app better! Please share your thoughts.
        </Text>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Type of Feedback</Text>
          {/* In a real RN app, you'd use @react-native-picker/picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerPlaceholder}>General Feedback (select)</Text>
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Your Feedback</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Tell us what you think..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
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
  cardText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  list: {
    marginTop: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  pickerPlaceholder: {
    color: '#6B7280',
    fontSize: 14,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LearningScreen;
