// Updated FooterNav.js to respect Android navigation insets dynamically
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './Icon'; // Custom Icon component
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FooterNav = ({ activePage, setActivePage }) => {
  const insets = useSafeAreaInsets();

  const NavItem = ({ iconName, label, pageName }) => (
    <TouchableOpacity
      style={[
        styles.navItem,
        activePage === pageName ? styles.navItemActive : {}
      ]}
      onPress={() => setActivePage(pageName)}
    >
      <Icon name={iconName} size={24} color={activePage === pageName ? '#10B981' : '#6B7280'} />
      <Text style={[styles.navItemLabel, activePage === pageName ? styles.navItemLabelActive : {}]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.footerNav, { paddingBottom: insets.bottom }]}> {/* Respect Android nav bar */}
      <NavItem iconName="Home" label="Home" pageName="home" />
      <NavItem iconName="Dashboard" label="Dashboard" pageName="dashboard" />
      <NavItem iconName="ManualInput" label="Manual Input" pageName="manual-input" />
      <NavItem iconName="Learning" label="Learning" pageName="learning" />
      <NavItem iconName="Settings" label="Settings" pageName="settings" />
    </View>
  );
};

const styles = StyleSheet.create({
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemActive: {},
  navItemLabel: {
    fontSize: 10,
    marginTop: 2,
    color: '#6B7280',
    fontWeight: '500',
  },
  navItemLabelActive: {
    color: '#10B981',
    fontWeight: 'bold',
  },
});

export default FooterNav;