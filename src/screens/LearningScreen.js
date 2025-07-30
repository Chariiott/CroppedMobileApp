// aquaponic-assistant/src/screens/LearningScreen.js
import React, { useState, useCallback, useEffect } from 'react'; // Added useEffect
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { globalStyles } from '../styles/appStyles';
import { fetchDataFromApi } from '../api'; // Added

const LearningScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [sensorReadings, setSensorReadings] = useState([]); // New state
  const [sensors, setSensors] = useState([]);


  const fetchSensorData = useCallback(async () => {
    try {
      const readings = await fetchDataFromApi('SensorReadings/GetAllSensorReadings');
      setSensorReadings(readings);
    } catch (err) {
      console.error("LearningScreen API error:", err);
    }
  }, []);

  useEffect(() => {
    const fetchSensors = async () => {
      const s = await fetchDataFromApi('Sensors/GetAllSensors');
      setSensors(s);
    };
    const fetchReadings = async () => {
      const r = await fetchDataFromApi('SensorReadings/GetAllSensorReadings');
      setSensorReadings(r);
    };
    fetchSensors();
    fetchReadings();
  }, []);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSensorData().finally(() => setRefreshing(false));
  }, [fetchSensorData]);

  const [chatInput, setChatInput] = useState('');
  const [chatReply, setChatReply] = useState('');

  const handleChatSend = () => {
    const msg = chatInput.toLowerCase().trim();
    let reply = '';

    if (msg.includes('ph')) {
      reply = "pH measures acidity/alkalinity. Ideal range for aquaponics is 6.5–7.5.";
    } else if (msg.includes("ec") || msg.includes("tds")) {
      reply = "EC/TDS shows nutrient concentration. Keep it between 700–1500 µS/cm.";
    } else if (msg.includes('water temp')) {
      reply = "Water temperature should stay between 20–28°C for healthy plants and fish.";
    } else if (msg.includes("oxygen")) {
      reply = "Dissolved oxygen is vital for fish. Keep it above 5 mg/L.";
    } else if (msg.includes("chlorophyll")) {
      reply = "Chlorophyll measurement helps track plant health. Use it to monitor leaf stress.";
    } else if (msg.includes("ammonia")) {
      reply = "Ammonia should be close to 0 ppm. High levels harm fish and indicate imbalance.";
    } else if (msg.includes("nitrite")) {
      reply = "Nitrite should be near 0 ppm. It’s toxic to fish in high amounts.";
    } else if (msg.includes("nitrate")) {
      reply = "Nitrate is a plant nutrient. 40–80 ppm is good, but too much causes algae.";
    } else if (msg.includes("air temp")) {
      reply = "Air temperature affects plant and fish growth. Keep it within your crop's optimal range.";
    } else if (msg.includes("humidity")) {
      reply = "Relative humidity of 50–70% is usually best for leafy greens in aquaponics.";
    } else if (msg.includes("air pressure")) {
      reply = "Air pressure readings help predict weather changes. Useful for greenhouse planning.";
    } else if (msg.includes("light")) {
      reply = "Light intensity impacts photosynthesis. Provide 12–16 hours of light for most crops.";


    } else if (msg.includes("how to start")) {
      reply = "Start by cycling your system (build up nitrifying bacteria), then add fish and plants. Monitor pH, ammonia, nitrite, and nitrate.";
    } else if (msg.includes("improve") || msg.includes("optimize")) {
      reply = "To improve your aquaponic farm, ensure stable pH, good filtration, and consistent monitoring of water quality.";
    } else if (msg.includes("fish")) {
      reply = "Tilapia, catfish, and trout are common in aquaponics. Choose fish that suit your temperature and local regulations.";
    } else if (msg.includes("plants")) {
      reply = "Leafy greens like lettuce, basil, spinach, and herbs grow well in aquaponic systems.";
    } else if (msg.includes("balance") || msg.includes("cycle")) {
      reply = "A balanced aquaponics system has ammonia → nitrite → nitrate conversion. Ensure good biofiltration and don’t overload with fish.";
    } else if (msg.includes("daily check") || msg.includes("monitor")) {
      reply = "Check pH, water temp, ammonia, nitrite, and nitrate daily. Clean filters weekly.";


    } else if (msg.includes('add data') || msg.includes('manual input')) {
      reply = "To add sensor data manually, go to the 'Add Data' screen in the bottom navigation.";
    } else {
      reply = "Sorry, I don't understand. Try asking about 'pH', 'EC', or 'temperature'.";
    }

    
    setChatReply(reply);
    setChatInput('');
  };

 


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={globalStyles.screenContainer}
          contentContainerStyle={{ ...globalStyles.screenContentContainer, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
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
            <Text style={styles.formLabel}>Your Feedback</Text>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Tell us what you think..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => alert("This feature is under development.")}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>

              
          <View style={{ marginTop: 20 }}>
            <Text style={styles.cardTitle}>Ask the Assistant</Text>
            <TextInput
              style={styles.chatInput}
              placeholder="e.g., What is pH?"
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity onPress={handleChatSend} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Ask</Text>
            </TouchableOpacity>

            {chatReply !== '' && (
              <View style={styles.chatReplyBox}>
                <Text style={styles.chatReplyLabel}>Bot:</Text>
                <Text style={styles.chatReplyText}>{chatReply}</Text>
              </View>
            )}
          </View>


        </View>


      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
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
    color: '#000000ff',
    backgroundColor: 'white',
    color: '#000',
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
  chatInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  chatReplyBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    padding: 12,
    marginTop: 10,
  },
  chatReplyLabel: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  chatReplyText: {
    color: '#4B5563',
    fontSize: 14,
  },

});

export default LearningScreen;
