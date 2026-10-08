import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import GlassCard from './GlassCard';

export default function RouteMapCard({
  request,
  isProvider = true,
  onClose,
}) {
  const [copied, setCopied] = useState(false);
  const [mapType, setMapType] = useState('osm'); // 'osm' or 'satellite'

  if (!request) return null;

  const destLat = request.driverLocation?.latitude || request.location?.latitude || 17.5612;
  const destLng = request.driverLocation?.longitude || request.location?.longitude || 78.4465;
  const destAddress = request.driverLocation?.address || request.location?.address || 'Stranded Vehicle Location';

  const customerName = isProvider ? (request.driverName || 'Stranded Driver') : (request.providerBusinessName || 'Assistance Unit');
  const customerPhone = isProvider ? request.driverPhone : request.providerPhone;
  const vehicle = request.vehicle || request.vehicleDetails;

  const distanceKm = request.distanceKm != null ? `${request.distanceKm} km` : 'Calculating...';
  const etaMinutes = request.estimatedEtaMinutes != null ? `${request.estimatedEtaMinutes} mins` : (request.etaRange || '15-25 mins');

  // Google Maps Turn-by-Turn Navigation URL
  const googleMapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;

  const handleOpenGoogleMaps = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(googleMapsNavUrl, '_blank');
    } else {
      Linking.openURL(googleMapsNavUrl);
    }
  };

  const handleCall = () => {
    if (customerPhone) {
      Linking.openURL(`tel:${customerPhone}`);
    }
  };

  const handleCopyCoords = () => {
    const coordStr = `${destLat.toFixed(5)}, ${destLng.toFixed(5)}`;
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(coordStr);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // OpenStreetMap embed URL with marker
  const delta = 0.015;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${destLng - delta}%2C${destLat - delta}%2C${destLng + delta}%2C${destLat + delta}&layer=mapnik&marker=${destLat}%2C${destLng}`;

  return (
    <GlassCard highlighted style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.livePulse} />
          <Text style={styles.title}>
            {isProvider ? 'CUSTOMER ROUTE MAP' : 'SERVICE UNIT RADAR'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.gpsBadge}>
            <Ionicons name="radio" size={12} color={colors.emerald} />
            <Text style={styles.gpsBadgeText}>GPS LOCKED</Text>
          </View>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Target Info Bar */}
      <View style={styles.targetBar}>
        <View style={styles.targetIcon}>
          <MaterialCommunityIcons name="map-marker-radius" size={20} color={colors.rose} />
        </View>
        <View style={styles.targetDetails}>
          <Text style={styles.targetName}>{customerName}</Text>
          {vehicle && (
            <Text style={styles.targetSub}>
              {vehicle.make} {vehicle.model} • {vehicle.licensePlate || 'Vehicle'}
            </Text>
          )}
          <Text style={styles.targetAddress} numberOfLines={2}>
            {destAddress}
          </Text>
        </View>
      </View>

      {/* Distance & ETA Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="speedometer-outline" size={14} color={colors.primary} />
          <Text style={styles.statLabel}>DISTANCE</Text>
          <Text style={styles.statValue}>{distanceKm}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="time-outline" size={14} color={colors.amber} />
          <Text style={styles.statLabel}>EST. ARRIVAL</Text>
          <Text style={styles.statValue}>{etaMinutes}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="navigate-outline" size={14} color={colors.secondary} />
          <Text style={styles.statLabel}>COORDINATES</Text>
          <Text style={styles.statValueSmall}>{destLat.toFixed(4)}, {destLng.toFixed(4)}</Text>
        </View>
      </View>

      {/* Live Map Display */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            title="Customer Breakdown Location Map"
            src={osmEmbedUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 10,
              filter: 'contrast(1.05) brightness(0.95)',
            }}
          />
        ) : (
          <View style={styles.nativeMapPlaceholder}>
            <MaterialCommunityIcons name="radar" size={36} color={colors.secondary} />
            <Text style={styles.nativeMapText}>
              Destination Pin: {destLat.toFixed(5)}, {destLng.toFixed(5)}
            </Text>
          </View>
        )}

        {/* Overlay Navigation Badge */}
        <View style={styles.mapPinOverlay}>
          <View style={styles.pinCircle}>
            <Ionicons name="location" size={16} color="#fff" />
          </View>
          <Text style={styles.pinText}>Customer Breakdown Pin</Text>
        </View>
      </View>

      {/* Primary Action: Open Google Maps Live Navigation */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={handleOpenGoogleMaps}
        activeOpacity={0.8}
      >
        <View style={styles.navButtonIconBox}>
          <MaterialCommunityIcons name="google-maps" size={20} color="#fff" />
        </View>
        <View style={styles.navButtonTextBox}>
          <Text style={styles.navButtonTitle}>OPEN IN GOOGLE MAPS</Text>
          <Text style={styles.navButtonSubtitle}>Launch live GPS turn-by-turn navigation</Text>
        </View>
        <Feather name="arrow-up-right" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Secondary Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleCopyCoords}
          activeOpacity={0.7}
        >
          <Ionicons
            name={copied ? 'checkmark-circle' : 'copy-outline'}
            size={15}
            color={copied ? colors.emerald : colors.secondary}
          />
          <Text style={[styles.actionBtnText, copied && { color: colors.emerald }]}>
            {copied ? 'Coords Copied!' : 'Copy GPS Coords'}
          </Text>
        </TouchableOpacity>

        {customerPhone && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.callActionBtn]}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <Ionicons name="call-outline" size={15} color={colors.emerald} />
            <Text style={[styles.actionBtnText, { color: colors.emerald }]}>
              Call Customer
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  gpsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.emerald,
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  targetBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  targetIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  targetDetails: {
    flex: 1,
  },
  targetName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  targetSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  targetAddress: {
    fontSize: 11,
    color: colors.secondary,
    marginTop: 3,
    lineHeight: 15,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.15)',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginTop: 1,
  },
  statValueSmall: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 1,
  },
  mapContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#0a0e17',
  },
  nativeMapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nativeMapText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mapPinOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10, 14, 23, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  pinCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669', // Emerald Green Navigation
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: '#059669',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  navButtonIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  navButtonTextBox: {
    flex: 1,
  },
  navButtonTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  navButtonSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  callActionBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
});
