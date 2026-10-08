import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';
import GlassCard from '../components/GlassCard';

export default function SettingsScreen({ onOpenServerConfig }) {
  const { user, role, logout } = useAuth();
  const profile = user?.profile;

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to end this mobile session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons
                name={role === 'SERVICE_PROVIDER' ? 'account-wrench' : 'account-circle'}
                size={36}
                color={colors.primary}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.fullName || 'Active User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.roleBadge,
                    role === 'SERVICE_PROVIDER' ? styles.roleProvider : styles.roleDriver,
                  ]}
                >
                  <Text style={styles.roleText}>{role || 'USER'}</Text>
                </View>
                {user?.phone ? <Text style={styles.userPhone}>{user.phone}</Text> : null}
              </View>
            </View>
          </View>

          {role === 'SERVICE_PROVIDER' && profile?.businessName && (
            <View style={styles.providerDetails}>
              <Text style={styles.providerBusiness}>{profile.businessName}</Text>
              <Text style={styles.providerAddress}>{profile.address || 'Central Highway Sector'}</Text>
            </View>
          )}
        </GlassCard>

        {/* Network & Infrastructure */}
        <Text style={styles.sectionTitle}>NETWORK & BACKEND SERVICES</Text>
        <GlassCard style={styles.settingCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={onOpenServerConfig}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <Ionicons name="server" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Spring Boot Core Backend</Text>
                <Text style={styles.settingSub} numberOfLines={1}>
                  {apiClient.defaults.baseURL}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                <MaterialCommunityIcons name="brain" size={18} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>FastAPI AI Microservice</Text>
                <Text style={styles.settingSub}>Port 8000 • Heuristics & Dispatch ETA</Text>
              </View>
            </View>
            <View style={styles.onlineDot} />
          </View>
        </GlassCard>

        {/* App Info */}
        <Text style={styles.sectionTitle}>SYSTEM TELEMETRY</Text>
        <GlassCard style={styles.settingCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>Pravaha AI Mobile 2.0.0 (Expo 57)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Database Cloud</Text>
            <Text style={styles.infoValue}>MongoDB Atlas (Cluster0 GCP Mumbai)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GPS Provider</Text>
            <Text style={styles.infoValue}>Expo Location + Haversine 15km</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Security Layer</Text>
            <Text style={styles.infoValue}>JJWT Stateless Bearer Auth</Text>
          </View>
        </GlassCard>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={colors.rose} />
          <Text style={styles.logoutText}>SIGN OUT OF MOBILE CLIENT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    padding: 16,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGlow,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleDriver: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  roleProvider: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  roleText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  userPhone: {
    fontSize: 11,
    color: colors.textMuted,
  },
  providerDetails: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  providerBusiness: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
  },
  providerAddress: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 8,
  },
  settingCard: {
    padding: 4,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  settingSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    maxWidth: 220,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.emerald,
    marginRight: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.rose,
    letterSpacing: 0.5,
  },
});
