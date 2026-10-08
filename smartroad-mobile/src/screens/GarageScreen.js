import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { driverApi } from '../config/api';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import AddVehicleModal from '../components/AddVehicleModal';

export default function GarageScreen() {
  const { user, updateUserProfile } = useAuth();
  const profile = user?.profile;
  const vehicles = profile?.vehicles || [];

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  const loadHistory = async () => {
    try {
      const hist = await driverApi.getHistory();
      setHistory(hist || []);
    } catch (e) {
      console.warn('Error loading history:', e);
    } finally {
      setLoadingHistory(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAddVehicle = async (veh) => {
    const res = await driverApi.addVehicle(veh);
    updateUserProfile({ profile: res });
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
              loadHistory();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Vehicles Header */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>MY REGISTERED VEHICLES ({vehicles.length})</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddVehicleModal(true)}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {vehicles.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <MaterialCommunityIcons name="car-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Vehicles Registered</Text>
            <Text style={styles.emptySub}>
              Add your car or motorcycle to speed up roadside breakdown dispatch.
            </Text>
          </GlassCard>
        ) : (
          vehicles.map((v, idx) => (
            <GlassCard key={idx} style={styles.vehicleCard}>
              <View style={styles.vehicleRow}>
                <View style={styles.carIconBox}>
                  <MaterialCommunityIcons name="car-side" size={24} color={colors.primary} />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleTitle}>{v.make} {v.model}</Text>
                  <Text style={styles.vehiclePlate}>{v.licensePlate} • {v.vehicleType || 'Sedan'}</Text>
                  <Text style={styles.vehicleMeta}>{v.year} • {v.color || 'Standard'}</Text>
                </View>
              </View>
            </GlassCard>
          ))
        )}

        {/* Breakdown Assistance History */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          DISPATCH AUDIT TRAIL ({history.length})
        </Text>

        {loadingHistory ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
        ) : history.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <MaterialCommunityIcons name="clipboard-text-clock-outline" size={36} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Past Breakdowns</Text>
            <Text style={styles.emptySub}>
              When you dispatch roadside assistance, completed mission records appear here.
            </Text>
          </GlassCard>
        ) : (
          history.map((item) => (
            <GlassCard key={item.id} style={styles.historyCard}>
              <View style={styles.historyTop}>
                <View>
                  <Text style={styles.historyProblem}>
                    {item.problemDescription || item.serviceType}
                  </Text>
                  <Text style={styles.historyDate}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}
                  </Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              {item.providerName && (
                <Text style={styles.historyProvider}>
                  Mechanic: {item.providerName} {item.providerBusinessName ? `(${item.providerBusinessName})` : ''}
                </Text>
              )}

              {item.location?.address && (
                <Text style={styles.historyAddress} numberOfLines={1}>
                  Location: {item.location.address}
                </Text>
              )}

              {item.rating && (
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.ratingText}>{item.rating} / 5</Text>
                  {item.review ? <Text style={styles.reviewText}>"{item.review}"</Text> : null}
                </View>
              )}
            </GlassCard>
          ))
        )}
      </ScrollView>

      <AddVehicleModal
        visible={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onSubmit={handleAddVehicle}
      />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  emptySub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  vehicleCard: {
    marginVertical: 6,
    padding: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  carIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGlow,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  vehiclePlate: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  vehicleMeta: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  historyCard: {
    marginVertical: 6,
    padding: 12,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyProblem: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  historyDate: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  historyProvider: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
  },
  historyAddress: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fbbf24',
  },
  reviewText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginLeft: 4,
  },
});
