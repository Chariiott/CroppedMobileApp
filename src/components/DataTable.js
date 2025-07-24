// aquaponic-assistant/src/components/DataTable.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * Reusable DataTable component for displaying API data in a consistent format.
 * Adapted for React Native components and styling.
 * @param {object} props - Component props.
 * @param {string} props.title - The title of the table section.
 * @param {Array<object>} props.data - The array of data objects to display.
 * @param {boolean} props.loading - Loading state.
 * @param {string|null} props.error - Error message if fetching failed.
 */
const DataTable = ({ title, data, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading {title.toLowerCase()}...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={[styles.card, styles.errorCard]}>
          <Text style={styles.errorTitle}>Error fetching {title.toLowerCase()}:</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          {(error.includes("CORS") || error.includes("SSL")) && (
             <Text style={styles.errorHint}>
               Please ensure your .NET API has correct <Text style={styles.errorHintBold}>CORS settings</Text>
               and a valid <Text style={styles.errorHintBold}>SSL certificate</Text>.
             </Text>
          )}
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>
          <Text style={styles.noDataText}>No {title.toLowerCase()} found.</Text>
        </View>
      </View>
    );
  }

  // Get headers from the keys of the first object in the data array
  // Filter out 'PasswordHash' from Users table for security/display purposes
  const headers = Object.keys(data[0]).filter(key => key.toLowerCase() !== 'passwordhash');

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              {headers.map((header) => (
                <Text key={header} style={styles.tableHeaderText}>
                  {header.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              ))}
            </View>
            {/* Table Body */}
            <ScrollView style={styles.tableBody} nestedScrollEnabled={true}>
              {data.map((row, rowIndex) => (
                <View key={row.id || rowIndex} style={styles.tableRow}>
                  {headers.map((header, colIndex) => (
                    <Text key={colIndex} style={styles.tableCell}>
                      {String(row[header] === null || row[header] === undefined ? '' : row[header])}
                    </Text>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
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
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center', // For loading/no data text
    justifyContent: 'center',
    minHeight: 100, // Ensure card has some height even if empty
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorCard: {
    backgroundColor: '#FEE2E2', // Red-100
    borderColor: '#EF4444', // Red-500
    borderWidth: 1,
    alignItems: 'flex-start',
    padding: 15,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626', // Red-700
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 14,
    color: '#DC2626',
  },
  errorHint: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 10,
  },
  errorHintBold: {
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', // Gray-100
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    textAlign: 'center',
    minWidth: 80, // Ensure header cells have a minimum width
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    minWidth: 80, // Ensure data cells have a minimum width
    paddingHorizontal: 6,
  },
  tableBody: {
    maxHeight: 320, // ≈ fits 10 rows depending on device
  },

});

export default DataTable;
