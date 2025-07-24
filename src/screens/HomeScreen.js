// aquaponic-assistant/src/screens/HomeScreen.js
import React, { useState, useCallback, useEffect } from 'react'; // Added useEffect
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { globalStyles } from '../styles/appStyles';
import Icon from '../components/Icon';
import { fetchDataFromApi } from '../api'; // Added API import

const HomeScreen = ({ setActivePage }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [sensorReadings, setSensorReadings] = useState([]); // New state

  const fetchSensorData = useCallback(async () => {
    try {
      const readings = await fetchDataFromApi('SensorReadings/GetAllSensorReadings');
      setSensorReadings(readings);
    } catch (err) {
      console.error("HomeScreen API error:", err);
    }
  }, []);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const data = await fetchDataFromApi('SensorReadings/GetAllSensorReadings');
        setSensorReadings(data);
      } catch (err) {
        console.error("Failed to fetch sensor data:", err);
      }
    };

    fetchSensorData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSensorData().finally(() => setRefreshing(false));
  }, [fetchSensorData]);



  const getLatestValueBySensorId = (sensorId) => {
    const filtered = sensorReadings
      .filter(r => r.SensorId === sensorId)
      .sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

    return filtered[0]?.Value ?? '--';
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
      <Text style={styles.title}>Welcome to Your Aquaponic Assistant!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>System Overview</Text>
        <Text style={styles.cardText}>
          Get a quick glance at your farm's health and performance.
        </Text>
        <View style={styles.overviewGrid}>
          <View style={[styles.overviewItem, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.overviewValue, { color: '#047857' }]}>--%</Text>
            <Text style={[styles.overviewLabel, { color: '#059669' }]}>Overall Health</Text>
          </View>
          <View style={[styles.overviewItem, { backgroundColor: '#DBEAFE' }]}>
            <Text style={[styles.overviewValue, { color: '#2563EB' }]}>
              {getLatestValueBySensorId(3)} °C
            </Text>
            <Text style={[styles.overviewLabel, { color: '#3B82F6' }]}>Water Temp</Text>
          </View>
          <View style={[styles.overviewItem, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.overviewValue, { color: '#D97706' }]}>
              {getLatestValueBySensorId(1)}
            </Text>
            <Text style={[styles.overviewLabel, { color: '#F59E0B' }]}>pH Level</Text>
          </View>
          <View style={[styles.overviewItem, { backgroundColor: '#EDE9FE' }]}>
            <Text style={[styles.overviewValue, { color: '#8B5CF6' }]}>
              {getLatestValueBySensorId(2)} 
            </Text>
            <Text style={[styles.overviewLabel, { color: '#8B5CF6' }]}>EC Level (µS/cm)</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#22C55E' }]}
            onPress={() => alert("Take Photo feature is under development.")}
          >
            <Icon name="camera" size={20} color="white" type="feather"/>
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
            onPress={() => setActivePage('learning')}
          >
            <Icon name="insights" size={20} color="white" type="matico"/>
            <Text style={styles.actionButtonText}>View Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
            onPress={() => setActivePage('manual-input')}
          >
            <Icon name="add-chart" size={20} color="white" type="matico"/>
            <Text style={styles.actionButtonText}>Add Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
            onPress={() => setActivePage('settings')}
          >
            <Icon name="settings" size={20} color="white" type="feather"/>
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Latest Alerts</Text>
        <View style={styles.alertList}>
          <View style={styles.alertItem}>
            <Icon name="bell" size={20} color="#DC2626" type="feather"/>
            <Text style={styles.alertText}><Text style={styles.alertTextBold}>Alert:</Text></Text>
          </View>
          <View style={styles.alertItem}>
            <Icon name="bell" size={20} color="#EA580C" type="feather"/>
            <Text style={styles.alertText}><Text style={styles.alertTextBold}>Warning:</Text></Text>
          </View>
          <View style={styles.alertItem}>
            <Icon name="bell" size={20} color="#4B5563" type="feather"/>
            <Text style={styles.alertText}><Text style={styles.alertTextBold}>Info:</Text></Text>
          </View>
        </View>
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewItem: {
    width: '48%',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  overviewLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  alertList: {
    marginTop: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flexShrink: 1,
  },
  alertTextBold: {
    fontWeight: '600',
  },
});

export default HomeScreen;
