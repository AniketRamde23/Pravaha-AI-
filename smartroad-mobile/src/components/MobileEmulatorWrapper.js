import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const DEVICES = [
  { name: 'iPhone 15 Pro', width: 393, height: 852, radius: 48 },
  { name: 'Pixel 8 Pro', width: 412, height: 892, radius: 40 },
  { name: 'Compact Phone', width: 360, height: 760, radius: 36 },
];

export default function MobileEmulatorWrapper({ children }) {
  // If native mobile, render child directly edge-to-edge
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const [deviceIndex, setDeviceIndex] = useState(0);
  const [time, setTime] = useState('');
  const [key, setKey] = useState(0);

  const currentDevice = DEVICES[deviceIndex];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCycleDevice = () => {
    setDeviceIndex((prev) => (prev + 1) % DEVICES.length);
  };

  const handleReload = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <View style={styles.outerContainer}>
      {/* Top Floating Simulator Controls Bar */}
      <View style={styles.floatingControls}>
        <View style={styles.controlsLeft}>
          <View style={styles.simBadge}>
            <MaterialCommunityIcons name="cellphone-sound" size={16} color={colors.primary} />
            <Text style={styles.simBadgeText}>PRAVAHA AI MOBILE EMULATOR</Text>
          </View>
          <Text style={styles.simDeviceName}>Skin: {currentDevice.name}</Text>
        </View>

        <View style={styles.controlsRight}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={handleCycleDevice}
            activeOpacity={0.7}
          >
            <Ionicons name="resize-outline" size={16} color={colors.text} />
            <Text style={styles.controlBtnText}>Change Device Size</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, styles.controlBtnReload]}
            onPress={handleReload}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={16} color={colors.primary} />
            <Text style={[styles.controlBtnText, { color: colors.primary }]}>Restart App</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Realistic Smartphone Chassis Frame */}
      <View
        style={[
          styles.deviceChassis,
          {
            width: currentDevice.width,
            height: currentDevice.height,
            borderRadius: currentDevice.radius,
          },
        ]}
      >
        {/* Dynamic Island / Speaker Pill */}
        <View style={styles.islandContainer}>
          <View style={styles.dynamicIsland}>
            <View style={styles.cameraLens} />
            <View style={styles.speakerGrill} />
          </View>
        </View>

        {/* Status Bar Indicator */}
        <View style={styles.statusBar}>
          <Text style={styles.statusTime}>{time || '09:41'}</Text>
          <View style={styles.statusIcons}>
            <Ionicons name="cellular" size={12} color="#fff" />
            <Ionicons name="wifi" size={12} color="#fff" />
            <Ionicons name="battery-full" size={14} color="#fff" />
          </View>
        </View>

        {/* Screen Viewport with child app */}
        <View key={key} style={styles.screenViewport}>
          {children}
        </View>

        {/* Home Bar Indicator */}
        <View style={styles.homeIndicatorWrap}>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    minHeight: '100vh',
    backgroundColor: '#05070e',
    backgroundImage: 'radial-gradient(circle at 50% 20%, #111d35 0%, #05070e 75%)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  floatingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 600,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    backdropFilter: 'blur(16px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  controlsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  simBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  simBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  simDeviceName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  controlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardHover,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlBtnReload: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  controlBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  deviceChassis: {
    backgroundColor: '#0a0e17',
    borderWidth: 10,
    borderColor: '#1e293b',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 35px rgba(59, 130, 246, 0.25)',
  },
  islandContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
    pointerEvents: 'none',
  },
  dynamicIsland: {
    width: 105,
    height: 26,
    borderRadius: 14,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cameraLens: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#0c1b33',
    borderWidth: 1.5,
    borderColor: '#1e293b',
  },
  speakerGrill: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1f2937',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: colors.surface,
    zIndex: 998,
  },
  statusTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screenViewport: {
    flex: 1,
    overflow: 'hidden',
  },
  homeIndicatorWrap: {
    height: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});
