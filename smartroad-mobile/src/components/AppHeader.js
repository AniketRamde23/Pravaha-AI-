import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function AppHeader({ onOpenServerConfig }) {
  const { user, role, logout } = useAuth();

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="shield-car" size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.brandTitle}>PRAVAHA AI</Text>
          <Text style={styles.brandSubtitle}>Emergency Dispatch</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {/* Server IP quick config */}
        <TouchableOpacity
          style={styles.serverBtn}
          onPress={onOpenServerConfig}
          activeOpacity={0.7}
        >
          <Ionicons name="wifi" size={14} color={colors.emerald} />
          <Text style={styles.serverText}>API</Text>
        </TouchableOpacity>

        {/* Role Pill */}
        <View
          style={[
            styles.rolePill,
            role === 'SERVICE_PROVIDER' ? styles.roleProvider : styles.roleDriver,
          ]}
        >
          <Text style={styles.roleText}>
            {role === 'SERVICE_PROVIDER' ? 'PROVIDER' : 'DRIVER'}
          </Text>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: colors.borderGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  serverText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.emerald,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
    fontSize: 10,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  logoutBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
