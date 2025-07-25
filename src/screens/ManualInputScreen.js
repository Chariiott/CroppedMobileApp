import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { globalStyles } from '../styles/appStyles';
import { fetchDataFromApi, postDataToApi } from '../api';


const ManualInputScreen = () => {
  const [sensors, setSensors] = useState([]);
  const [selectedSensorId, setSelectedSensorId] = useState(null);
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [loadingSensors, setLoadingSensors] = useState(false);
  const [sensorError, setSensorError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Same fetch pattern as DashboardScreen
  const fetchData = async (endpoint, setData, setLoading, setError) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDataFromApi(endpoint);
      if (Array.isArray(data)) {
        setData(data);
      } else {
        setData([]);
        setError('Unexpected API format. Expected an array.');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('Sensors/GetAllSensors', setSensors, setLoadingSensors, setSensorError);
  }, []);

  const handleSensorChange = (sensorId) => {
    setSelectedSensorId(sensorId);
    const selected = sensors.find(sensor => sensor.SensorId === sensorId);
    setUnit(selected?.Unit || '');
  };


  const handleSubmit = async () => {
    if (!selectedSensorId || !value || !unit) {
      Alert.alert('Validation Error', 'Please select a sensor and enter a value.');
      return;
    }

    const payload = {
      SensorId: selectedSensorId,
      Value: parseFloat(value),
      Unit: unit
    };

    console.log("Submitting:", payload);

    setSubmitting(true);
    try {
      const result = await postDataToApi('SensorReadings/AddSensorReading', payload);
      console.log("POST response:", result);

      Alert.alert('Success', 'Sensor reading submitted!');
      setSelectedSensorId(null);
      setUnit('');
      setValue('');
    } catch (error) {
      console.error("POST failed:", error);
      Alert.alert('Error', error.message);
    }
    setSubmitting(false);
  };


  return (
    <View style={[globalStyles.container, styles.wrapper]}>
      <Text style={globalStyles.title}>Manual Sensor Input</Text>

      <Text style={styles.label}>Select Sensor</Text>
      {loadingSensors ? (
        <ActivityIndicator />
      ) : (
        <Picker
          selectedValue={selectedSensorId}
          onValueChange={handleSensorChange}
          style={[styles.picker, { color: '#000' }]}
        >
          <Picker.Item label="-- Select Sensor --" value={null} />
          {sensors.map(sensor => (
            <Picker.Item
              key={sensor.SensorId}
              label={sensor.Name}
              value={sensor.SensorId}
            />

          ))}
        </Picker>
      )}
      {sensorError && <Text style={styles.errorText}>{sensorError}</Text>}

      <Text style={styles.label}>Unit</Text>
      <Text style={styles.unitBox}>{unit || '--'}</Text>

      <Text style={styles.label}>Value</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        placeholder="Enter value"
        value={value}
        onChangeText={setValue}
      />

      {submitting ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Submit Reading" onPress={handleSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { padding: 20 },
  label: { fontWeight: '600', marginTop: 15, marginBottom: 5 },
  picker: { backgroundColor: '#f0f0f0', borderRadius: 5 },
  input: {
    backgroundColor: '#fff', padding: 10,
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5
  },
  unitBox: {
    backgroundColor: '#eee', padding: 10, borderRadius: 5
  },
  errorText: {
    color: 'red', marginTop: 5
  }
});

export default ManualInputScreen;
