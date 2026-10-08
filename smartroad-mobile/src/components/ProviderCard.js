import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import GlassCard from './GlassCard';

export default function ProviderCard({ provider, isSelected, onSelect }) {
  const rating = provider.rating || 4.8;
  const distance = provider.distanceKm !== undefined ? Number(provider.distanceKm).toFixed(1) : '2.4';
  const baseFee = provider.baseFee || 500;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onSelect(provider)}>
      <GlassCard highlighted={isSelected} style={[styles.card, isSelected && styles.selectedCard]}>
        <View style={styles.topRow}>
          <View style={styles.infoCol}>
            <View style={styles.businessRow}>
              <Text style={styles.businessName} numberOfLines={1}>
                {provider.businessName || provider.providerName || 'Express Rescue Patrol'}
              </Text>
              {provider.verified && (
                <MaterialCommunityIcons name="check-decagram" size={16} color={colors.primary} />
              )}
            </View>
            <View style={styles.statsRow}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#fbbf24" />
                <Text style={styles.ratingText}>{rating}</Text>
              </View>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.distanceText}>{distance} km away</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.feeText}>₹{baseFee}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              {provider.open24x7 && (
                <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#34d399' }}>24x7 OPEN</Text>
                </View>
              )}
              {provider.distanceFromMRUKm != null && (
                <View style={{ backgroundColor: 'rgba(147, 51, 234, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(147, 51, 234, 0.3)' }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: '#c084fc' }}>MRU: {provider.distanceFromMRUKm} km</Text>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.radioCircle, isSelected && styles.radioActive]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>

        {provider.address && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.addressText} numberOfLines={1}>
              {provider.address}
            </Text>
          </View>
        )}

        {provider.servicesOffered && provider.servicesOffered.length > 0 && (
          <View style={styles.servicesRow}>
            {provider.servicesOffered.slice(0, 3).map((svc, idx) => (
              <View key={idx} style={styles.servicePill}>
                <Text style={styles.servicePillText}>{svc.replace('_', ' ')}</Text>
              </View>
            ))}
          </View>
        )}
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
    marginRight: 10,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  businessName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fbbf24',
  },
  dot: {
    color: colors.textMuted,
  },
  distanceText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },
  feeText: {
    fontSize: 12,
    color: colors.emerald,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  addressText: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  servicePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  servicePillText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
});
