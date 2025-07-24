// aquaponic-assistant/src/screens/DashboardScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { globalStyles } from '../styles/appStyles';
import Icon from '../components/Icon';
import { fetchDataFromApi } from '../api';
import { LineChart } from 'react-native-chart-kit';

const DashboardScreen = () => {
  const [sensorReadingsData, setSensorReadingsData] = useState([]);
  const [sensorsData, setSensorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleChartIds, setVisibleChartIds] = useState([]);
  const [selectedSensorToAdd, setSelectedSensorToAdd] = useState(null);

  const screenWidth = Dimensions.get("window").width;


   const appFeatures = [
      { icon: "bell", label: "Notifications", type: "feather" },
      { icon: "camera", label: "Camera" , type: "feather" },
      { icon: "map-pin", label: "Location", type: "feather"  },
      { icon: "wifi-off", label: "Offline Mode", type: "feather"  },
      { icon: "search", label: "Search" , type: "feather" },
      { icon: "filter", label: "Filter By" , type: "feather" },
      { icon: "sort", label: "Sort By", type: "matco"  },
    ];



  const fetchAllDashboardData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [sensorReadings, sensors] = await Promise.all([
        fetchDataFromApi('SensorReadings/GetAllSensorReadings'),
        fetchDataFromApi('Sensors/GetAllSensors'),
      ]);
      setSensorReadingsData(sensorReadings);
      setSensorsData(sensors);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    }
    setRefreshing(false);
    setLoading(false);
  }, [visibleChartIds.length]);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  const getSensorName = (sensorId) => {
    const sensor = sensorsData.find(s => s.SensorId === parseInt(sensorId));
    return sensor?.Name || `Sensor ID ${sensorId}`;
  };

  const handleAddChart = () => {
    if (selectedSensorToAdd && !visibleChartIds.includes(selectedSensorToAdd)) {
      setVisibleChartIds(prev => [...prev, selectedSensorToAdd]);
      setSelectedSensorToAdd(null);
    }
  };

  const handleRemoveChart = (sensorId) => {
    setVisibleChartIds(prev => prev.filter(id => id !== sensorId));
  };

  const getSensorCharts = () => {
    const grouped = {};
    sensorReadingsData.forEach((reading) => {
      if (!grouped[reading.SensorId]) {
        grouped[reading.SensorId] = [];
      }
      grouped[reading.SensorId].push(reading);
    });

    
   

    return visibleChartIds.map((sensorId) => {
      const readings = grouped[sensorId] || [];
      const sorted = readings.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
      const labels = sorted.map(r => new Date(r.Timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
      const data = sorted.map(r => r.Value);

      return (
        <View key={sensorId} style={{ marginBottom: 20 }}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>{getSensorName(sensorId)}</Text>
            <TouchableOpacity onPress={() => handleRemoveChart(sensorId)}>
              <Icon name="x-circle" type="feather" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
          <LineChart
            data={{ labels, datasets: [{ data }] }}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
              propsForDots: {
                r: '3',
                strokeWidth: '1',
                stroke: '#10B981',
              },
            }}
            bezier
            style={{ borderRadius: 8 }}
          />
        </View>
      );
    });
  };

  const availableSensorOptions = sensorsData.filter(
    s => !visibleChartIds.includes(s.SensorId)
  );

  const handleFeatureClick = (feature) => {
    alert(`${feature} feature under development.`);
  };

  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={globalStyles.screenContentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchAllDashboardData}
          colors={['#10B981']}
          tintColor="#10B981"
        />
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historical Sensor Data</Text>
        {getSensorCharts()}

        {availableSensorOptions.length > 0 && (
          <View style={styles.addChartContainer}>
            <Picker
              selectedValue={selectedSensorToAdd}
              onValueChange={(itemValue) => setSelectedSensorToAdd(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a sensor to add" value={null} />
              {availableSensorOptions.map(sensor => (
                <Picker.Item key={sensor.SensorId} label={sensor.Name} value={sensor.SensorId} />
              ))}
            </Picker>
            <TouchableOpacity onPress={handleAddChart} style={styles.addButton}>
              <Icon name="plus" type="feather" size={18} color="white" />
              <Text style={styles.addButtonText}>Add Chart</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Features</Text>
        <View style={styles.featureGrid}>
          {appFeatures.map(({ icon, label , type}, index) => (
            <TouchableOpacity key={index} onPress={() => handleFeatureClick(label)} style={styles.featureButton}>
                <Icon name={icon} size={20} color="#4B5563" type={type}/>
                <Text style={styles.featureButtonText}>{label}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chartTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
  addChartContainer: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderColor: '#D1D5DB',
    borderWidth: 1,
  },
  picker: {
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureButton: {
    width: '48%',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    elevation: 1,
  },
  featureButtonText: {
    color: '#374151',
    fontWeight: '500',
    marginLeft: 8,
    fontSize: 13,
  },
});

export default DashboardScreen;
