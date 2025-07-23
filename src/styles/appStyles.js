// aquaponic-assistant/src/styles/appStyles.js
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background
  },
  container: {
    flex: 1, // Takes up entire screen height
    backgroundColor: '#F9FAFB', // Light gray background
  },
  mainContent: {
    flex: 1, // Takes up remaining space
    backgroundColor: '#F9FAFB',
    // Padding will be set dynamically in App.js to account for header/footer heights
  },
  screenContainer: {
    flex: 1,
  },
  screenContentContainer: {
    padding: 16,
    paddingBottom: 50, // Extra padding for scrollable content
  },
  // Add any other global styles you might need here
  // For example, a base text style, or common card styles.
});
