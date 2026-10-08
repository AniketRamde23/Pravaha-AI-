import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { providerApi } from '../config/api';
import GlassCard from '../components/GlassCard';
import ActiveJobBanner from '../components/ActiveJobBanner';

export default function ProviderHomeScreen() {
  const { user } = useAuth();
  const profile = user?.profile;

  const [isAvailable, setIsAvailable] = useState(profile?.available ?? true);
  const [togglingDuty, setTogglingDuty] = useState(false);

  const [activeJob, setActiveJob] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchProviderData = useCallback(async () => {
    try {
      const [incoming, active] = await Promise.all([
        providerApi.getIncomingRequests().catch(() => []),
        providerApi.getActiveJob().catch(() => null),
      ]);
      setIncomingRequests(incoming || []);
      setActiveJob(active);
    } catch (e) {
      console.warn('Error fetching provider hub data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProviderData();
    const interval = setInterval(fetchProviderData, 5000);
    return () => clearInterval(interval);
  }, [fetchProviderData]);

  // Toggle on-duty status
  const handleToggleDuty = async (val) => {
    setIsAvailable(val);
    setTogglingDuty(true);
    try {
      await providerApi.toggleAvailability(val);
    } catch (e) {
      console.warn('Failed to toggle duty:', e);
      setIsAvailable(!val);
      Alert.alert('Status Error', 'Could not update duty state on server.');
    } finally {
      setTogglingDuty(false);
    }
  };

  // Update Status of active job
  const handleUpdateStatus = async (requestId, status, note = '') => {
    const targetId = requestId || activeJob?.id || activeJob?._id;
    if (!targetId) return;
    setActionLoadingId(targetId);
    try {
      await providerApi.updateStatus(targetId, status, note);
      await fetchProviderData();
    } catch (e) {
      console.warn('Status update error:', e);
      const msg = e.response?.data?.message || e.message || 'Could not transition status.';
      Alert.alert('Status Update', msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Accept incoming request
  const handleAcceptRequest = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      await providerApi.updateStatus(requestId, 'ACCEPTED', 'Mechanic accepted assignment');
      Alert.alert('Mission Accepted', 'You have been assigned to this rescue mission!');
      await fetchProviderData();
    } catch (e) {
      Alert.alert('Accept Error', e.message || 'Could not accept request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Decline incoming request
  const handleDeclineRequest = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      await providerApi.updateStatus(requestId, 'CANCELLED', 'Declined by provider');
      await fetchProviderData();
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not decline request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCallDriver = (phone) => {
    if (!phone) {
      Alert.alert('No Phone', 'Driver phone number unavailable.');
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  const handleOpenMaps = (lat, lng) => {
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchProviderData();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Verified Technician Profile Banner matching Web Hub */}
        <GlassCard style={styles.providerProfileCard}>
          <View style={styles.providerProfileRow}>
            <Image
              source={require('../../assets/media/technician-arrived.jpg')}
              style={styles.providerAvatar}
              resizeMode="cover"
            />
            <View style={styles.providerProfileText}>
              <View style={styles.providerBadgeRow}>
                <Text style={styles.providerBadge}>VERIFIED TECHNICIAN</Text>
                <Text style={styles.versionTag}>v2.0.0</Text>
              </View>
              <Text style={styles.businessName} numberOfLines={1}>
                {profile?.businessName || user?.fullName || 'Verified Emergency Workshop'}
              </Text>
              <Text style={styles.businessAddress} numberOfLines={1}>
                {profile?.address || 'Hitec City Road, Hyderabad'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* On Duty Switch Card */}
        <GlassCard style={styles.dutyCard}>
          <View style={styles.dutyRow}>
            <View style={styles.dutyInfo}>
              <View style={styles.dutyBadgeRow}>
                <View
                  style={[
                    styles.dutyDot,
                    { backgroundColor: isAvailable ? colors.emerald : colors.textMuted },
                  ]}
                />
                <Text
                  style={[
                    styles.dutyTitle,
                    { color: isAvailable ? colors.emerald : colors.textMuted },
                  ]}
                >
                  {isAvailable ? 'ON-DUTY • ACCEPTING RESCUE JOBS' : 'OFF-DUTY • PAUSED'}
                </Text>
              </View>
              <Text style={styles.dutySub}>
                {isAvailable
                  ? 'Your mobile patrol is active on the 25km dispatch radar.'
                  : 'Toggle ON to receive real-time driver breakdown dispatches.'}
              </Text>
            </View>

            <Switch
              value={isAvailable}
              onValueChange={handleToggleDuty}
              trackColor={{ false: '#374151', true: colors.emerald }}
              thumbColor={isAvailable ? '#ffffff' : '#9ca3af'}
              disabled={togglingDuty}
            />
          </View>
        </GlassCard>

        {/* KPI Metrics */}
        <View style={styles.kpiRow}>
          <GlassCard style={styles.kpiCard}>
            <Ionicons name="star" size={18} color="#fbbf24" />
            <Text style={styles.kpiValue}>{profile?.rating || 4.9}</Text>
            <Text style={styles.kpiLabel}>RATING</Text>
          </GlassCard>

          <GlassCard style={styles.kpiCard}>
            <Ionicons name="checkmark-done-circle" size={18} color={colors.emerald} />
            <Text style={styles.kpiValue}>{profile?.completedRequests || 0}</Text>
            <Text style={styles.kpiLabel}>RESOLVED</Text>
          </GlassCard>

          <GlassCard style={styles.kpiCard}>
            <MaterialCommunityIcons name="cash-multiple" size={18} color={colors.primary} />
            <Text style={styles.kpiValue}>₹{profile?.baseFee || 500}</Text>
            <Text style={styles.kpiLabel}>BASE FEE</Text>
          </GlassCard>
        </View>

        {/* Active Mission */}
        {activeJob ? (
          <>
            <Text style={styles.sectionTitle}>CURRENT ENGAGEMENT</Text>
            <ActiveJobBanner
              request={activeJob}
              isProvider={true}
              onUpdateStatus={handleUpdateStatus}
            />
          </>
        ) : null}

        {/* Incoming Radar Queue */}
        <View style={styles.queueHeader}>
          <Text style={styles.sectionTitle}>
            INCOMING DISPATCH QUEUE ({incomingRequests.length})
          </Text>
          {loading && <ActivityIndicator size="small" color={colors.primary} />}
        </View>

        {incomingRequests.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <MaterialCommunityIcons name="radar" size={44} color={colors.primary} />
            <Text style={styles.emptyTitle}>Radar Radar Active</Text>
            <Text style={styles.emptySub}>
              {isAvailable
                ? 'Listening for nearby breakdown requests in your zone...'
                : 'Turn ON Duty mode above to receive live incoming jobs.'}
            </Text>
          </GlassCard>
        ) : (
          incomingRequests.map((req) => {
            const isLoadingThis = actionLoadingId === req.id;
            return (
              <GlassCard key={req.id} highlighted style={styles.incomingCard}>
                <View style={styles.incomingHeader}>
                  <View style={styles.problemTag}>
                    <MaterialCommunityIcons name="car-wrench" size={16} color={colors.primary} />
                    <Text style={styles.problemTagText}>
                      {req.breakdownType || req.problemDescription || req.serviceType || 'Roadside Breakdown'}
                    </Text>
                  </View>
                  <View style={styles.incomingPill}>
                    <Text style={styles.incomingPillText}>NEW DISPATCH</Text>
                  </View>
                </View>

                {/* Driver & Vehicle */}
                <View style={styles.driverBox}>
                  <Text style={styles.driverName}>{req.driverName || 'Stranded Motorist'}</Text>
                  {(req.vehicle || req.vehicleDetails) && (
                    <Text style={styles.driverVehicle}>
                      {(req.vehicle || req.vehicleDetails).make} {(req.vehicle || req.vehicleDetails).model} • {(req.vehicle || req.vehicleDetails).licensePlate || 'Reg Pending'}
                    </Text>
                  )}
                  <View style={styles.locationLine}>
                    <Ionicons name="location-outline" size={14} color={colors.secondary} />
                    <Text style={styles.locationLineText} numberOfLines={2}>
                      {req.driverLocation?.address || req.location?.address || 'Hyderabad Highway Corridor'}
                    </Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={styles.actionRow}>
                  {(req.driverLocation?.latitude || req.location?.latitude) && (
                    <TouchableOpacity
                      style={styles.navBtn}
                      onPress={() =>
                        handleOpenMaps(
                          req.driverLocation?.latitude || req.location?.latitude,
                          req.driverLocation?.longitude || req.location?.longitude
                        )
                      }
                    >
                      <Feather name="navigation" size={16} color={colors.secondary} />
                      <Text style={styles.navBtnText}>Map</Text>
                    </TouchableOpacity>
                  )}

                  {req.driverPhone && (
                    <TouchableOpacity
                      style={styles.navBtn}
                      onPress={() => handleCallDriver(req.driverPhone)}
                    >
                      <Ionicons name="call" size={16} color={colors.emerald} />
                      <Text style={styles.navBtnText}>Call</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.btnAction, styles.btnDecline]}
                    onPress={() => handleDeclineRequest(req.id)}
                    disabled={isLoadingThis}
                  >
                    <Text style={styles.declineText}>Pass</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btnAction, styles.btnAccept]}
                    onPress={() => handleAcceptRequest(req.id)}
                    disabled={isLoadingThis}
                  >
                    {isLoadingThis ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.acceptText}>ACCEPT JOB</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </GlassCard>
            );
          })
        )}
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
  providerProfileCard: {
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  providerProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#f59e0b',
  },
  providerProfileText: {
    flex: 1,
  },
  providerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  providerBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#f59e0b',
    letterSpacing: 0.5,
  },
  versionTag: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '700',
  },
  businessName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  businessAddress: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dutyCard: {
    padding: 14,
    marginBottom: 12,
  },
  dutyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dutyInfo: {
    flex: 1,
    marginRight: 10,
  },
  dutyBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dutyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dutyTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dutySub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  incomingCard: {
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.borderGlow,
  },
  incomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  problemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  problemTagText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  incomingPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  incomingPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.amber,
  },
  driverBox: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  driverVehicle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  locationLineText: {
    fontSize: 11,
    color: colors.secondary,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navBtnText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  btnAction: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDecline: {
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  declineText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  btnAccept: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  acceptText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
