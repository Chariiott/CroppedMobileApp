// aquaponic-assistant/src/screens/DashboardScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { globalStyles } from '../styles/appStyles';
import Icon from '../components/Icon';
import DataTable from '../components/DataTable';
import { fetchDataFromApi } from '../api';
import { LineChart } from 'react-native-chart-kit';

const sensorDisplayData = [
  { label: 'Water Temp', value: '28.5', unit: '°C', iconName: 'thermometer-half', iconType: 'awe', color: '#3B82F6' },
  { label: 'pH Level', value: '6.3', unit: '', iconName: 'water-outline', iconType: 'ion', color: '#10B981' },
  { label: 'EC (Nutrient)', value: '720', unit: 'PPM', iconName: 'lightning-bolt-outline', iconType: 'matco', color: '#8B5CF6' },
  { label: 'Humidity', value: '70', unit: '%', iconName: 'cloud-rain', iconType: 'feather', color: '#0EA5E9' },
  { label: 'Light', value: '1200', unit: 'Lux', iconName: 'sun', iconType: 'feather', color: '#F59E0B' },
];

const plantHealthData = [
  { name: 'Tomato Plant 1', status: 'Healthy', imageUrl: 'https://placehold.co/60x60/4ADE80/FFFFFF?text=P1' },
  { name: 'Lettuce Bed 2', status: 'Healthy', imageUrl: 'https://placehold.co/60x60/4ADE80/FFFFFF?text=P2' },
  { name: 'Basil Pot 3', status: 'Mild Stress', imageUrl: 'https://placehold.co/60x60/FCD34D/FFFFFF?text=P3' },
  { name: 'Cucumber Vine 4', status: 'Healthy', imageUrl: 'https://placehold.co/60x60/4ADE80/FFFFFF?text=P4' },
];

const DashboardScreen = () => {
  const [farmData, setFarmData] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [farmError, setFarmError] = useState(null);

  const [plantData, setPlantData] = useState([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [plantError, setPlantError] = useState(null);

  const [plantSpeciesData, setPlantSpeciesData] = useState([]);
  const [loadingPlantSpecies, setLoadingPlantSpecies] = useState(true);
  const [plantSpeciesError, setPlantSpeciesError] = useState(null);

  const [sensorReadingsData, setSensorReadingsData] = useState([]);
  const [loadingSensorReadings, setLoadingSensorReadings] = useState(true);
  const [sensorReadingsError, setSensorReadingsError] = useState(null);

  const [sensorsData, setSensorsData] = useState([]);
  const [loadingSensors, setLoadingSensors] = useState(true);
  const [sensorsError, setSensorsError] = useState(null);

  const [usersData, setUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [chartVisibility, setChartVisibility] = useState({});


  const toggleChartVisibility = (sensorId) => {
    setChartVisibility(prev => ({
      ...prev,
      [sensorId]: !prev[sensorId]
    }));
  };


  const fetchData = async (endpoint, setData, setLoading, setError) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDataFromApi(endpoint);
      if (Array.isArray(data)) {
        setData(data);
      } else {
        setData([]);
        setError("API returned data in an unexpected format. Expected an array.");
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDashboardData = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchData('Farms/GetAllFarms', setFarmData, setLoadingFarms, setFarmError),
      fetchData('Plants/GetAllPlants', setPlantData, setLoadingPlants, setPlantError),
      fetchData('PlantSpecies/GetAllPlantSpecies', setPlantSpeciesData, setLoadingPlantSpecies, setPlantSpeciesError),
      fetchData('SensorReadings/GetAllSensorReadings', setSensorReadingsData, setLoadingSensorReadings, setSensorReadingsError),
      fetchData('Sensors/GetAllSensors', setSensorsData, setLoadingSensors, setSensorsError),
      fetchData('Users/GetAllUsers', setUsersData, setLoadingUsers, setUsersError),
    ]);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  const onRefresh = useCallback(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  const handleFeatureClick = (feature) => {
    alert(`${feature} feature under development.`);
  };

  const screenWidth = Dimensions.get("window").width;

  const getSensorName = (sensorId) => {
    const sensor = sensorsData.find(s => s.SensorId === parseInt(sensorId));
    return sensor?.Name || `Sensor ID ${sensorId}`;
  };

  const getSensorCharts = () => {
    const grouped = {};
    sensorReadingsData.forEach((reading) => {
      if (!grouped[reading.SensorId]) {
        grouped[reading.SensorId] = [];
      }
      grouped[reading.SensorId].push(reading);
    });

    return Object.entries(grouped)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([sensorId, readings]) => {
        const sorted = readings.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
        const labels = sorted.map(r => new Date(r.Timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
        const data = sorted.map(r => r.Value);
        const isVisible = chartVisibility[sensorId];

        return (
          <View key={sensorId} style={{ marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => toggleChartVisibility(sensorId)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 12,
                backgroundColor: '#F9FAFB',
                borderRadius: 6,
                borderColor: '#D1D5DB',
                borderWidth: 1,
                marginBottom: 6,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
                {getSensorName(sensorId)}
              </Text>
              <Icon
                name={isVisible ? 'chevron-up' : 'chevron-down'}
                type="feather"
                size={18}
                color="#6B7280"
              />
            </TouchableOpacity>

            {isVisible && (
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
            )}
          </View>
        );
      });
  };


  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={globalStyles.screenContentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} tintColor="#10B981" progressBackgroundColor="#ffffff" />}
    >
      {/* <DataTable title="Your Farms" data={farmData} loading={loadingFarms} error={farmError} />
      <DataTable title="All Plants" data={plantData} loading={loadingPlants} error={plantError} />
      <DataTable title="Plant Species" data={plantSpeciesData} loading={loadingPlantSpecies} error={plantSpeciesError} />
      <DataTable title="Sensor Readings" data={sensorReadingsData} loading={loadingSensorReadings} error={sensorReadingsError} />
      <DataTable title="All Sensors" data={sensorsData} loading={loadingSensors} error={sensorsError} />
      <DataTable title="All Users" data={usersData} loading={loadingUsers} error={usersError} /> */}

      

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historical Sensor Data</Text>
        {getSensorCharts()}
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plant Health Overview</Text>
        <View style={styles.plantHealthList}>
          {plantHealthData.map((plant, index) => (
            <View key={index} style={styles.plantHealthCard}>
              <Image source={{ uri: plant.imageUrl }} style={styles.plantHealthImage} />
              <View>
                <Text style={styles.plantHealthName}>{plant.name}</Text>
                <Text style={[styles.plantHealthStatus, { color: plant.status === 'Healthy' ? '#059669' : '#D97706' }]}> <Icon name="leaf-outline" size={16} type="ion" /> {plant.status} </Text>
              </View>
            </View>
          ))}
        </View>
      </View> */}


{/* 
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Readings</Text>
        <View style={styles.sensorGrid}>
          {sensorDisplayData.map((sensor, index) => (
            <View key={index} style={[styles.sensorCard, { borderColor: sensor.color, backgroundColor: 'white' }]}>
              <Icon name={sensor.iconName} size={28} color={sensor.color} type={sensor.iconType} />
              <Text style={styles.sensorLabel}>{sensor.label}</Text>
              <Text style={styles.sensorValue}>{sensor.value}<Text style={styles.sensorUnit}>{sensor.unit}</Text></Text>
            </View>
          ))}
        </View>
      </View> */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Features</Text>
        <View style={styles.featureGrid}>
          {["bell", "camera", "map-pin", "wifi-off", "search", "filter"].map((icon, index) => (
            <TouchableOpacity key={index} onPress={() => handleFeatureClick(icon)} style={styles.featureButton}>
              <Icon name={icon} size={20} color="#4B5563" type="feather" />
              <Text style={styles.featureButtonText}>{icon}</Text>
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
  sensorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sensorCard: { width: '48%', padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center', marginBottom: 8, elevation: 1 },
  sensorLabel: { fontSize: 13, fontWeight: '500', color: '#4B5563', marginTop: 4 },
  sensorValue: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  sensorUnit: { fontSize: 14, fontWeight: 'normal', marginLeft: 2 },
  plantHealthCard: { backgroundColor: 'white', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 8, elevation: 1 },
  plantHealthImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  plantHealthName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  plantHealthStatus: { fontSize: 13, marginTop: 2 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureButton: { width: '48%', padding: 12, backgroundColor: 'white', borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 8, elevation: 1 },
  featureButtonText: { color: '#374151', fontWeight: '500', marginLeft: 8, fontSize: 13 },
});

export default DashboardScreen;
