import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { apiClient, PRESET_URLS, setCustomBaseUrl, checkBackendHealth } from '../config/api';

export default function ServerConfigModal({ visible, onClose }) {
  const [currentUrl, setCurrentUrl] = useState(apiClient.defaults.baseURL);
  const [inputUrl, setInputUrl] = useState(apiClient.defaults.baseURL);
  const [testing, setTesting] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    if (visible) {
      setCurrentUrl(apiClient.defaults.baseURL);
      setInputUrl(apiClient.defaults.baseURL);
      runHealthCheck();
    }
  }, [visible]);

  const runHealthCheck = async () => {
    setTesting(true);
    const res = await checkBackendHealth();
    setHealthStatus(res);
    setTesting(false);
  };

  const handleSelectPreset = async (url) => {
    setInputUrl(url);
    await setCustomBaseUrl(url);
    setCurrentUrl(url);
    runHealthCheck();
  };

  const handleSaveCustom = async () => {
    if (!inputUrl.trim()) return;
    await setCustomBaseUrl(inputUrl);
    setCurrentUrl(inputUrl);
    await runHealthCheck();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Ionicons name="server-outline" size={20} color={colors.primary} />
              <Text style={styles.title}>Backend API Host</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select or enter your Spring Boot server endpoint (port 8080).
          </Text>

          {/* Health indicator */}
          <View style={[styles.healthBox, healthStatus?.ok ? styles.healthOnline : styles.healthOffline]}>
            <View style={[styles.statusDot, { backgroundColor: healthStatus?.ok ? colors.emerald : colors.rose }]} />
            <View style={styles.healthInfo}>
              <Text style={styles.healthTitle}>
                {testing ? 'Pinging server...' : healthStatus?.ok ? 'SERVER ONLINE' : 'SERVER UNREACHABLE'}
              </Text>
              {healthStatus?.latency && (
                <Text style={styles.healthSub}>Latency: {healthStatus.latency}ms</Text>
              )}
              {healthStatus?.error && (
                <Text style={styles.healthSub} numberOfLines={1}>{healthStatus.error}</Text>
              )}
            </View>
            <TouchableOpacity onPress={runHealthCheck} disabled={testing} style={styles.refreshBtn}>
              {testing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="refresh" size={16} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Presets */}
          <Text style={styles.sectionLabel}>QUICK PRESETS</Text>
          <View style={styles.presetsList}>
            {PRESET_URLS.map((preset) => (
              <TouchableOpacity
                key={preset.url}
                style={[
                  styles.presetBtn,
                  currentUrl === preset.url && styles.presetBtnActive,
                ]}
                onPress={() => handleSelectPreset(preset.url)}
              >
                <View>
                  <Text style={styles.presetLabel}>{preset.label}</Text>
                  <Text style={styles.presetUrl}>{preset.url}</Text>
                </View>
                {currentUrl === preset.url && (
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom URL Input */}
          <Text style={styles.sectionLabel}>CUSTOM URL</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="http://192.168.1.50:8080/api"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.applyBtn} onPress={handleSaveCustom}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 8,
  },
  healthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 10,
  },
  healthOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  healthOffline: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  healthInfo: {
    flex: 1,
  },
  healthTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  healthSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshBtn: {
    padding: 6,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 6,
  },
  presetsList: {
    gap: 6,
  },
  presetBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  presetUrl: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 12,
  },
  applyBtn: {
    backgroundColor: colors.cardHover,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 10,
  },
  applyBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  doneBtn: {
    marginTop: 18,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
