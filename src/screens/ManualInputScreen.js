// aquaponic-assistant/src/screens/ManualInputScreen.js
import React, { useState, useCallback } from 'react'; // Added useState, useCallback
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'; // Added RefreshControl
import { globalStyles } from '../styles/appStyles';

/**
 * ManualInputScreen component: Allows users to manually input data like sensor readings or observations.
 * Adapted for React Native components and styling.
 */
const ManualInputScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Simulated refresh for ManualInputScreen (as it uses static content)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('Refreshing Manual Input screen...');
    // Simulate data fetching/re-initialization
    setTimeout(() => {
      setRefreshing(false);
      console.log('Manual Input screen refresh complete.');
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
      <Text style={styles.title}>Manual Data Entry</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Here you can manually input readings or log actions for your farm.
        </Text>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Data Type</Text>
          {/* In a real RN app, you'd use @react-native-picker/picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerPlaceholder}>Water Temperature (select)</Text>
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Value / Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 25.3 C, pH 6.2, Aphids observed"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Notes (Optional)</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Additional details..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Entry</Text>
        </TouchableOpacity>
        <Text style={styles.noteText}>
          <Text style={styles.noteTextBold}>Note:</Text> This data will be stored in your SQL database via your .NET API.
        </Text>
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
  cardText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
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
  textAreaInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    height: 80, // Fixed height for textarea
    textAlignVertical: 'top', // Align text to top for multiline input
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
  noteText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  noteTextBold: {
    fontWeight: '600',
  },
});

export default ManualInputScreen;
