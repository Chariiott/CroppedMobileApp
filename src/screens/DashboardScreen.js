
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions
} from 'react-native';
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
  

  const selectedPointRef = useRef(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  
  const screenWidth = Dimensions.get("window").width;

  const appFeatures = useMemo(() => [
    { icon: "bell", label: "Notifications", type: "feather" },
    { icon: "camera", label: "Camera", type: "feather" },
    { icon: "map-pin", label: "Location", type: "feather" },
    { icon: "wifi-off", label: "Offline Mode", type: "feather" },
    { icon: "search", label: "Search", type: "feather" },
    { icon: "filter", label: "Filter By", type: "feather" },
    { icon: "sort", label: "Sort By", type: "matco" },
  ], []);

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
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  useEffect(() => {
    if (sensorsData.length > 0) {
      const allSensorIds = sensorsData.map(s => s.SensorId);
      setVisibleChartIds(allSensorIds);
    }
  }, [sensorsData]);

  const getSensorName = useCallback((sensorId) => {
    const sensor = sensorsData.find(s => s.SensorId === parseInt(sensorId));
    return sensor?.Name || `Sensor ID ${sensorId}`;
  }, [sensorsData]);

  const handleAddChart = useCallback(() => {
    if (selectedSensorToAdd && !visibleChartIds.includes(selectedSensorToAdd)) {
      setVisibleChartIds(prev => [...prev, selectedSensorToAdd]);
      setSelectedSensorToAdd(null);
    }
  }, [selectedSensorToAdd, visibleChartIds]);

  const handleRemoveChart = useCallback((sensorId) => {
    setVisibleChartIds(prev => prev.filter(id => id !== sensorId));
  }, []);

  const availableSensorOptions = useMemo(() => 
    sensorsData.filter(s => !visibleChartIds.includes(s.SensorId)),
    [sensorsData, visibleChartIds]
  );

  const handleFeatureClick = useCallback((feature) => {
    alert(`${feature} feature under development.`);
  }, []);

 
  const chartData = useMemo(() => {
    const grouped = {};
    sensorReadingsData.forEach((reading) => {
      if (!grouped[reading.SensorId]) {
        grouped[reading.SensorId] = [];
      }
      grouped[reading.SensorId].push(reading);
    });
    
    return visibleChartIds.map((sensorId) => {
      const readings = grouped[sensorId] || [];
      const sorted = [...readings].sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
      const recent = sorted.slice(-15);

    
      const formattedDates = recent.map(r => ({
        full: new Date(r.Timestamp).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: 'short'
        }),
        short: new Date(r.Timestamp).toLocaleDateString('en-GB', {
          hour: '2-digit',
          day: '2-digit',
          month: 'short'
        })
      }));

      const labels = formattedDates.map((date, index) => 
        index % 2 === 0 ? date.full : ''
      );

      const data = recent.map(r => r.Value);

      return {
        sensorId,
        readings: recent,
        labels,
        data,
        formattedDates,
        sensorName: getSensorName(sensorId)
      };
    });
  }, [sensorReadingsData, visibleChartIds, getSensorName]);

  // Handle point press without causing re-renders
  const handlePointPress = useCallback((sensorId, value, index, formattedDates) => {
    selectedPointRef.current = {
      value,
      timestamp: formattedDates[index].full,
      sensorId
    };
    setTooltipVisible(true);
  }, []);

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
      onScrollBeginDrag={() => setTooltipVisible(false)}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historical Sensor Data</Text>
        
        {chartData.map(({ sensorId, labels, data, formattedDates, sensorName }) => (
          <View key={sensorId} style={{ marginBottom: 20 }}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>{sensorName}</Text>
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
                propsForBackgroundLines: {
                  strokeDasharray: "",
                },
                dotRadius: 10,
              }}
              bezier
              style={{ borderRadius: 8 }}
              onDataPointClick={({ value, index }) => 
                handlePointPress(sensorId, value, index, formattedDates)
              }
            />

            {tooltipVisible && selectedPointRef.current?.sensorId === sensorId && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>
                  📅 {selectedPointRef.current.timestamp}
                </Text>
                <Text style={styles.tooltipValue}>
                  📊 Value: {selectedPointRef.current.value}
                </Text>
              </View>
            )}
          </View>
        ))}

        {availableSensorOptions.length > 0 && (
          <View style={styles.addChartContainer}>
            <Picker
              selectedValue={selectedSensorToAdd}
              onValueChange={setSelectedSensorToAdd}
              style={[styles.picker, { color: '#000' }]}
              dropdownIconColor="#6B7280"
            >
              <Picker.Item label="Select a sensor to add" value={null} />
              {availableSensorOptions.map(sensor => (
                <Picker.Item 
                  key={sensor.SensorId} 
                  label={sensor.Name} 
                  value={sensor.SensorId} 
                />
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
          {appFeatures.map(({ icon, label, type }, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => handleFeatureClick(label)} 
              style={styles.featureButton}
            >
              <Icon name={icon} size={20} color="#4B5563" type={type} />
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
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1F2937', 
    marginBottom: 12 
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chartTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#374151' 
  },
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
  featureGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
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
  tooltip: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderColor: '#10B981',
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  tooltipText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500'
  },
  tooltipValue: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2
  },
});

export default DashboardScreen;