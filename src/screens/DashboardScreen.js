// aquaponic-assistant/src/screens/DashboardScreen.js
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native'; // Added RefreshControl, ActivityIndicator
import { globalStyles } from '../styles/appStyles';
import Icon from '../components/Icon'; // Custom Icon component
import DataTable from '../components/DataTable'; // Reusable DataTable component
import { fetchDataFromApi } from '../api'; // API service

// Mock data for display sections that are not directly from new tables
const sensorDisplayData = [
  { label: 'Water Temp', value: '28.5', unit: '°C', iconName: 'Thermometer', color: '#3B82F6' }, // Blue-500
  { label: 'pH Level', value: '6.3', unit: '', iconName: 'Droplet', color: '#10B981' }, // Green-600
  { label: 'EC (Nutrient)', value: '720', unit: 'PPM', iconName: 'Droplet', color: '#8B5CF6' }, // Purple-500
  { label: 'Humidity', value: '70', unit: '%', iconName: 'CloudRain', color: '#0EA5E9' }, // Sky-500
  { label: 'Light', value: '1200', unit: 'Lux', iconName: 'Sun', color: '#F59E0B' }, // Yellow-500
];

const plantHealthData = [
  { name: 'Tomato Plant 1', status: 'Healthy', imageUrl: 'https://placehold.co/60x60/4ADE80/FFFFFF?text=P1' },
  { name: 'Lettuce Bed 2', status: 'Healthy', imageUrl: 'https://placehold.co/60x60/4ADE80/FFFFFF?text=P2' },
  { name: 'Basil Pot 3', status: 'Mild Stress', imageUrl: 'https://placehold.co/60x60/FCD34D/FFFFFF?text=P3' },
  { name: 'Cucumber Vine 4', status: 'Healthy', imageUrl: 'https://placehold.co/60x60/4ADE80/FFFFFF?text=P4' },
];

/**
 * DashboardScreen component: Displays current sensor readings, plant health, and various data tables from API.
 * Uses React Native components and styling.
 */
const DashboardScreen = () => {
  // State for various API data tables
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

  // State for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false); // Added refreshing state

  /**
   * Generic fetch function for API endpoints.
   * This is a helper to update multiple loading/error states for different data tables.
   * @param {string} endpoint - The API endpoint to fetch from (e.g., 'Farms/GetAllFarms').
   * @param {function} setData - State setter for the data.
   * @param {function} setLoading - State setter for loading.
   * @param {function} setError - State setter for error.
   */
  const fetchData = async (endpoint, setData, setLoading, setError) => {
    try {
      setLoading(true); // Set loading for this specific data table
      setError(null); // Clear error for this specific data table
      const data = await fetchDataFromApi(endpoint); // Use the centralized API call
      if (Array.isArray(data)) {
        setData(data);
      } else {
        setData([]); // Ensure data is an array
        setError("API returned data in an unexpected format. Expected an array.");
        console.error(`API data format error for ${endpoint}:`, data);
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Always stop loading for this specific data table
    }
  };

  /**
   * Fetches all dashboard data from various API endpoints.
   * Wrapped in useCallback to prevent unnecessary re-renders and stabilize function identity.
   */
  const fetchAllDashboardData = useCallback(async () => {
    setRefreshing(true); // Start refreshing spinner
    console.log('Initiating dashboard data refresh...'); // Debugging log

    // Execute all fetch operations concurrently
    await Promise.all([
      fetchData('Farms/GetAllFarms', setFarmData, setLoadingFarms, setFarmError),
      fetchData('Plants/GetAllPlants', setPlantData, setLoadingPlants, setPlantError),
      fetchData('PlantSpecies/GetAllPlantSpecies', setPlantSpeciesData, setLoadingPlantSpecies, setPlantSpeciesError),
      fetchData('SensorReadings/GetAllSensorReadings', setSensorReadingsData, setLoadingSensorReadings, setSensorReadingsError),
      fetchData('Sensors/GetAllSensors', setSensorsData, setLoadingSensors, setSensorsError),
      fetchData('Users/GetAllUsers', setUsersData, setLoadingUsers, setUsersError),
    ]);

    setRefreshing(false); // Stop refreshing spinner
    console.log('Dashboard data refresh complete.'); // Debugging log
  }, []); // Empty dependency array as fetchAllDashboardData doesn't depend on outside props/state

  // Initial data fetch on component mount
  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]); // Run once on mount and whenever fetchAllDashboardData changes (which it won't due to useCallback)

  // Handler for pull-to-refresh
  const onRefresh = useCallback(() => {
    fetchAllDashboardData(); // Trigger the data fetching function
  }, [fetchAllDashboardData]); // Memoize the onRefresh callback

  const handleFeatureClick = (feature) => {
    alert(`${feature} feature under development. Will integrate with your .NET API / native APIs.`);
  };

  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={globalStyles.screenContentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing} // Controls the visibility of the refresh indicator
          onRefresh={onRefresh}    // Function to call when a refresh is requested
          colors={['#10B981']}     // Android: Color of the refresh indicator
          tintColor="#10B981"      // iOS: Color of the refresh indicator
          progressBackgroundColor="#ffffff" // Android: Background color of the refresh indicator
        />
      }
    >
      {/* Dynamic Data Tables from API */}
      <DataTable title="Your Farms" data={farmData} loading={loadingFarms} error={farmError} />
      <DataTable title="All Plants" data={plantData} loading={loadingPlants} error={plantError} />
      <DataTable title="Plant Species" data={plantSpeciesData} loading={loadingPlantSpecies} error={plantSpeciesError} />
      <DataTable title="Sensor Readings" data={sensorReadingsData} loading={loadingSensorReadings} error={sensorReadingsError} />
      <DataTable title="All Sensors" data={sensorsData} loading={loadingSensors} error={sensorsError} />
      <DataTable title="All Users" data={usersData} loading={loadingUsers} error={usersError} />


      {/* Static Mock Data Sections (these currently use local mock data) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Readings</Text>
        <View style={styles.sensorGrid}>
          {sensorDisplayData.map((sensor, index) => (
            <View key={index} style={[styles.sensorCard, { borderColor: sensor.color, backgroundColor: 'white' }]}>
              <Icon name={sensor.iconName} size={28} color={sensor.color} />
              <Text style={styles.sensorLabel}>{sensor.label}</Text>
              <Text style={styles.sensorValue}>{sensor.value}<Text style={styles.sensorUnit}>{sensor.unit}</Text></Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historical Data (Last 24h)</Text>
        <View style={styles.graphPlaceholder}>
          <Text style={styles.graphPlaceholderText}>
            Graph Placeholder (e.g., Water Temp over time)
            {'\n'}(Integrate charting library like `react-native-chart-kit`)
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plant Health Overview</Text>
        <View style={styles.plantHealthList}>
          {plantHealthData.map((plant, index) => (
            <View key={index} style={styles.plantHealthCard}>
              <Image source={{ uri: plant.imageUrl }} style={styles.plantHealthImage} />
              <View>
                <Text style={styles.plantHealthName}>{plant.name}</Text>
                <Text style={[
                  styles.plantHealthStatus,
                  { color: plant.status === 'Healthy' ? '#059669' : '#D97706' }
                ]}>
                  <Icon name="Leaf" size={16} /> {plant.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Access Features / Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Features</Text>
        <View style={styles.featureGrid}>
          <TouchableOpacity
            onPress={() => handleFeatureClick('Notifications')}
            style={styles.featureButton}
          >
            <Icon name="Bell" size={20} color="#4B5563" />
            <Text style={styles.featureButtonText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFeatureClick('Camera Access')}
            style={styles.featureButton}
          >
            <Icon name="Camera" size={20} color="#4B5563" />
            <Text style={styles.featureButtonText}>Camera Access</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFeatureClick('GPS Location')}
            style={styles.featureButton}
          >
            <Icon name="MapPin" size={20} color="#4B5563" />
            <Text style={styles.featureButtonText}>GPS Location</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFeatureClick('Offline Mode')}
            style={styles.featureButton}
          >
            <Icon name="WifiOff" size={20} color="#4B5563" />
            <Text style={styles.featureButtonText}>Offline Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFeatureClick('Search')}
            style={styles.featureButton}
          >
            <Icon name="Search" size={20} color="#4B5563" />
            <Text style={styles.featureButtonText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFeatureClick('Filtering')}
            style={styles.featureButton}
          >
            <Icon name="Filter" size={20} color="#4B5563" />
            <Text style={styles.featureButtonText}>Filtering</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sensorCard: {
    width: '48%', // Approx half width for 2 columns
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sensorLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginTop: 4,
  },
  sensorValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sensorUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    marginLeft: 2,
  },
  graphPlaceholder: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    height: 180, // Fixed height for graph area
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  graphPlaceholderText: {
    color: '#9CA3AF', // Gray-400
    fontSize: 14,
    textAlign: 'center',
  },
  plantHealthList: {
    // Default for vertical list
  },
  plantHealthCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  plantHealthImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  plantHealthName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  plantHealthStatus: {
    fontSize: 13,
    marginTop: 2,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
