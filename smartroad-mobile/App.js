import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { colors } from './src/theme/colors';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import DriverHomeScreen from './src/screens/DriverHomeScreen';
import ProviderHomeScreen from './src/screens/ProviderHomeScreen';
import GarageScreen from './src/screens/GarageScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Components
import AppHeader from './src/components/AppHeader';
import ServerConfigModal from './src/components/ServerConfigModal';
import MobileEmulatorWrapper from './src/components/MobileEmulatorWrapper';

function MainApp() {
  const { isAuthenticated, role, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('MAIN');
  const [showServerModal, setShowServerModal] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingLogo}>
          <MaterialCommunityIcons name="shield-car" size={42} color={colors.primary} />
        </View>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Initializing Pravaha AI Mobile...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <AuthScreen onOpenServerConfig={() => setShowServerModal(true)} />
        <ServerConfigModal
          visible={showServerModal}
          onClose={() => setShowServerModal(false)}
        />
      </SafeAreaView>
    );
  }

  const isProvider = role === 'SERVICE_PROVIDER';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Top Mobile Bar */}
      <AppHeader onOpenServerConfig={() => setShowServerModal(true)} />

      {/* Screen Body */}
      <View style={styles.screenContainer}>
        {isProvider ? (
          <>
            {activeTab === 'MAIN' && <ProviderHomeScreen />}
            {activeTab === 'SETTINGS' && (
              <SettingsScreen onOpenServerConfig={() => setShowServerModal(true)} />
            )}
          </>
        ) : (
          <>
            {activeTab === 'MAIN' && <DriverHomeScreen />}
            {activeTab === 'GARAGE' && <GarageScreen />}
            {activeTab === 'SETTINGS' && (
              <SettingsScreen onOpenServerConfig={() => setShowServerModal(true)} />
            )}
          </>
        )}
      </View>

      {/* Bottom Navigation Tab Bar */}
      <View style={styles.bottomNav}>
        {isProvider ? (
          <>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'MAIN' && styles.tabItemActive]}
              onPress={() => setActiveTab('MAIN')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="radar"
                size={22}
                color={activeTab === 'MAIN' ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'MAIN' && styles.tabLabelActive,
                ]}
              >
                Dispatch Hub
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'SETTINGS' && styles.tabItemActive]}
              onPress={() => setActiveTab('SETTINGS')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={activeTab === 'SETTINGS' ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'SETTINGS' && styles.tabLabelActive,
                ]}
              >
                Settings
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'MAIN' && styles.tabItemActive]}
              onPress={() => setActiveTab('MAIN')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="car-emergency"
                size={22}
                color={activeTab === 'MAIN' ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'MAIN' && styles.tabLabelActive,
                ]}
              >
                SOS Dispatch
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'GARAGE' && styles.tabItemActive]}
              onPress={() => setActiveTab('GARAGE')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="car-multiple"
                size={22}
                color={activeTab === 'GARAGE' ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'GARAGE' && styles.tabLabelActive,
                ]}
              >
                Garage
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'SETTINGS' && styles.tabItemActive]}
              onPress={() => setActiveTab('SETTINGS')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={activeTab === 'SETTINGS' ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'SETTINGS' && styles.tabLabelActive,
                ]}
              >
                Settings
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Global Server Config Modal */}
      <ServerConfigModal
        visible={showServerModal}
        onClose={() => setShowServerModal(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MobileEmulatorWrapper>
          <MainApp />
        </MobileEmulatorWrapper>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1.5,
    borderColor: colors.borderGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 12,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  tabItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.primary,
  },
});
