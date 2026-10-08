import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { driverApi } from '../config/api';
import { getCurrentDeviceLocation } from '../services/locationService';
import GlassCard from '../components/GlassCard';
import DiagnosisCard from '../components/DiagnosisCard';
import ProviderCard from '../components/ProviderCard';
import ActiveJobBanner from '../components/ActiveJobBanner';
import RatingModal from '../components/RatingModal';
import AddVehicleModal from '../components/AddVehicleModal';

const PROBLEMS = [
  { id: 'Flat Tire', label: 'Flat Tire', serviceType: 'TYRE_ASSISTANCE', icon: 'car-tire-alert' },
  { id: 'Towing Assistance', label: 'Need Towing', serviceType: 'TOWING', icon: 'tow-truck' },
  { id: 'Battery Jump-Start', label: 'Dead Battery', serviceType: 'BATTERY_JUMPSTART', icon: 'car-battery' },
  { id: 'Empty Fuel', label: 'Out of Fuel', serviceType: 'FUEL_DELIVERY', icon: 'gas-station' },
  { id: 'Lockout', label: 'Car Lockout', serviceType: 'LOCKOUT_ASSISTANCE', icon: 'car-key' },
  { id: 'Vehicle Diagnostics', label: 'Engine Check', serviceType: 'VEHICLE_DIAGNOSTICS', icon: 'engine-outline' },
];

const SYMPTOM_PRESETS = {
  'Flat Tire': [
    'Punctured by nail or road debris',
    'Steering pulling hard to side',
    'Loud thumping sound from wheel',
    'Tire completely flat on rim',
  ],
  'Need Towing': [
    'Engine won\'t crank or start',
    'Heavy smoke billowing from bonnet',
    'Transmission locked up in drive',
    'Coolant boiling over / steam',
  ],
  'Dead Battery': [
    'Rapid clicking noise on turn key',
    'Dashboard flickering & lights dim',
    'Completely dead starter motor',
    'Left cabin lights on overnight',
  ],
  'Out of Fuel': [
    'Engine sputtered and died on highway',
    'Fuel gauge at 0 km range',
    'Ran dry before exit ramp',
    'Engine misfiring due to low fuel',
  ],
  'Car Lockout': [
    'Keys locked inside vehicle cabin',
    'Key fob sensor battery exhausted',
    'Central locking jammed shut',
    'Trunk latch sealed with keys inside',
  ],
  'Engine Check': [
    'Check Engine warning light illuminated',
    'Severe engine knocking / shaking',
    'Unusual burning oil smell',
    'Car losing acceleration power',
  ],
};

export default function DriverHomeScreen() {
  const { user, updateUserProfile } = useAuth();
  const profile = user?.profile;
  const vehicles = profile?.vehicles || [];

  // GPS State
  const [location, setLocation] = useState({
    latitude: 17.5472,
    longitude: 78.2173,
    address: 'Near ORR Exit, Dundigal - Gandimaisamma, Hyderabad',
  });
  const [detectingGps, setDetectingGps] = useState(false);

  // Active Mission & Rating
  const [activeRequest, setActiveRequest] = useState(null);
  const [loadingActive, setLoadingActive] = useState(true);
  const [ratingTarget, setRatingTarget] = useState(null);

  // Breakdown Request Wizard State
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [symptoms, setSymptoms] = useState('');
  const [aiDiagnosis, setAiDiagnosis] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);

  // Providers & Vehicle
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0] || null);

  // Modals
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Detect GPS on mount
  useEffect(() => {
    fetchGps();
  }, []);

  const fetchGps = async () => {
    setDetectingGps(true);
    const loc = await getCurrentDeviceLocation();
    setLocation(loc);
    setDetectingGps(false);
  };

  // Poll active request
  const loadActiveRequest = useCallback(async () => {
    try {
      const active = await driverApi.getActiveRequest();
      setActiveRequest(active);
    } catch (e) {
      // ignore
    } finally {
      setLoadingActive(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadActiveRequest();
    const interval = setInterval(loadActiveRequest, 5000);
    return () => clearInterval(interval);
  }, [loadActiveRequest]);

  // AI Diagnostic Run
  const handleRunAiDiagnosis = async (customText) => {
    const textToAnalyze = (typeof customText === 'string' ? customText : symptoms).trim() ||
      `Vehicle stopped on road exhibiting ${selectedProblem.label} symptoms. Need emergency breakdown diagnosis.`;

    if (!symptoms.trim() && !customText) {
      setSymptoms(textToAnalyze);
    }

    setDiagnosing(true);
    try {
      const res = await driverApi.diagnoseBreakdown({
        selectedProblem: selectedProblem.label,
        symptoms: textToAnalyze,
        hasImage: false,
      });

      const confidencePct = Math.round((res.confidence || 0.90) * 100);
      const isCritical = (res.prediction || '').includes('ENGINE') || (res.prediction || '').includes('FIRE');
      const severity = isCritical ? 'CRITICAL' : confidencePct > 80 ? 'HIGH' : 'MEDIUM';

      setAiDiagnosis({
        prediction: res.prediction,
        confidence: res.confidence,
        confidencePct,
        severity,
        probableCause: `${(res.prediction || selectedProblem.label).replace(/_/g, ' ')} (${confidencePct}% AI Match): ${res.explanation || 'Analyzed by FastAPI AI Engine.'}`,
        requiredEquipment: (res.recommendedService || selectedProblem.serviceType || 'TOWING').replace(/_/g, ' '),
        estimatedDurationMinutes: res.recommendedService === 'TOWING' ? 45 : 25,
        safetyAdvice: isCritical
          ? 'Urgent: Turn on hazard flashers, exit vehicle immediately, and stand behind highway barrier.'
          : 'Turn on hazard flashers, pull onto shoulder, and remain inside locked vehicle until unit arrives.',
      });
    } catch (e) {
      console.warn('Diagnosis fallback:', e);
      setAiDiagnosis({
        severity: 'HIGH',
        probableCause: `Mechanical issue detected in ${selectedProblem.label} subsystem.`,
        requiredEquipment: (selectedProblem.serviceType || 'TOWING').replace(/_/g, ' '),
        estimatedDurationMinutes: 30,
        safetyAdvice: 'Turn on hazard flashers and move passengers safely away from traffic.',
      });
    } finally {
      setDiagnosing(false);
    }
  };

  // Find Nearby Providers
  const handleFindProviders = async () => {
    setLoadingProviders(true);
    try {
      const providers = await driverApi.findNearbyProviders({
        latitude: location.latitude,
        longitude: location.longitude,
        serviceType: selectedProblem.serviceType,
        radiusKm: 25.0,
      });
      setNearbyProviders(providers || []);
      if (providers && providers.length > 0) {
        setSelectedProvider(providers[0]);
      } else {
        setSelectedProvider(null);
      }
    } catch (e) {
      console.warn('Providers error:', e);
      Alert.alert('Provider Discovery', 'Could not retrieve nearby providers. Try checking server connection.');
    } finally {
      setLoadingProviders(false);
    }
  };

  // Create Breakdown Dispatch
  const handleDispatchAssistance = async () => {
    if (!selectedProvider) {
      Alert.alert('Select Provider', 'Please select a nearby rescue provider from the list.');
      return;
    }

    setSubmittingRequest(true);
    try {
      const providerId = selectedProvider.providerId || selectedProvider.id;
      const payload = {
        selectedProviderId: providerId,
        breakdownType: selectedProblem.label,
        symptoms: symptoms.trim() || selectedProblem.label,
        recommendedService: selectedProblem.serviceType,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        vehicleIndex: 0,
      };

      const newReq = await driverApi.createRequest(payload);
      setActiveRequest(newReq);
      Alert.alert('Dispatch Successful', `Assistance requested! Assigned unit: ${selectedProvider.businessName || 'Technician'}`);
      setNearbyProviders([]);
      setSelectedProvider(null);
      setSymptoms('');
      setAiDiagnosis(null);
    } catch (e) {
      console.warn('Dispatch failed:', e);
      Alert.alert('Dispatch Failed', e.response?.data?.message || e.message || 'Could not create request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Cancel Request
  const handleCancelRequest = async (id) => {
    const targetId = (typeof id === 'string' && id) || activeRequest?.id || activeRequest?._id;
    if (!targetId) {
      setActiveRequest(null);
      return;
    }

    try {
      await driverApi.cancelRequest(targetId, 'Cancelled by driver via mobile app');
      setActiveRequest(null);
      await loadActiveRequest();
    } catch (e) {
      console.warn('Cancel error:', e);
      // If error or already cancelled, ensure state is cleaned up
      setActiveRequest(null);
      await loadActiveRequest();
    }
  };

  // Rate Request
  const handleSubmitRating = async (requestId, rating, review) => {
    await driverApi.rateRequest(requestId, rating, review);
    await loadActiveRequest();
  };

  // Add Vehicle
  const handleSaveVehicle = async (veh) => {
    const res = await driverApi.addVehicle(veh);
    updateUserProfile({ profile: res });
    setSelectedVehicle(veh);
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
              loadActiveRequest();
              fetchGps();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Active Rescue Banner */}
        {activeRequest && (
          <ActiveJobBanner
            request={activeRequest}
            isProvider={false}
            onCancelRequest={handleCancelRequest}
            onRateRequest={(req) => setRatingTarget(req)}
          />
        )}

        {/* Visual Hero Banner matching web portal */}
        <View style={styles.heroCard}>
          <Image
            source={require('../../assets/media/stranded-driver.jpg')}
            style={styles.heroCardImage}
            resizeMode="cover"
          />
          <View style={styles.heroCardOverlay}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroLiveBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.heroLiveText}>GPS RADAR ACTIVE</Text>
              </View>
              <Text style={styles.heroVersionText}>Atlas Cloud v2.0.0</Text>
            </View>
            <Text style={styles.heroHeading}>Highway Assistance Network</Text>
            <Text style={styles.heroSub}>
              FastAPI AI diagnostics & verified mechanics within 15km
            </Text>
          </View>
        </View>

        {/* GPS Location Bar */}
        <GlassCard style={styles.gpsCard}>
          <View style={styles.gpsRow}>
            <View style={styles.gpsIconBox}>
              <Ionicons name="navigate" size={18} color={colors.secondary} />
            </View>
            <View style={styles.gpsTextBox}>
              <Text style={styles.gpsLabel}>CURRENT TELEMETRY LOCATION</Text>
              <Text style={styles.gpsAddress} numberOfLines={2}>
                {location.address}
              </Text>
              <Text style={styles.gpsCoords}>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                {location.isSimulated ? ' (GPS Fallback Corridor)' : ' (Live Satellite Fix)'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.gpsRefreshBtn}
              onPress={fetchGps}
              disabled={detectingGps}
            >
              {detectingGps ? (
                <ActivityIndicator size="small" color={colors.secondary} />
              ) : (
                <Ionicons name="locate" size={20} color={colors.secondary} />
              )}
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Emergency SOS Banner */}
        <TouchableOpacity
          style={styles.sosBanner}
          activeOpacity={0.85}
          onPress={() => {
            handleFindProviders();
          }}
        >
          <View style={styles.sosPulseRing} />
          <View style={styles.sosInner}>
            <MaterialCommunityIcons name="car-emergency" size={28} color="#fff" />
            <View style={styles.sosTextWrap}>
              <Text style={styles.sosTitle}>ONE-TOUCH EMERGENCY DISPATCH</Text>
              <Text style={styles.sosSubtitle}>Scan 25km radius for verified roadside mechanics</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={28} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Breakdown Category Picker */}
        <Text style={styles.sectionTitle}>SELECT BREAKDOWN PROBLEM</Text>
        <View style={styles.problemsGrid}>
          {PROBLEMS.map((prob) => {
            const isSelected = selectedProblem.id === prob.id;
            return (
              <TouchableOpacity
                key={prob.id}
                style={[styles.problemCard, isSelected && styles.problemCardSelected]}
                onPress={() => setSelectedProblem(prob)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={prob.icon}
                  size={24}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[styles.problemText, isSelected && styles.problemTextSelected]}
                  numberOfLines={1}
                >
                  {prob.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* AI Symptom Diagnostics Box */}
        <GlassCard style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons name="robot" size={20} color={colors.secondary} />
            <Text style={styles.aiHeaderTitle}>AI SYMPTOM DIAGNOSTICS</Text>
          </View>
          <Text style={styles.aiHint}>
            Tap a common symptom below or describe abnormal sounds/behavior:
          </Text>

          {/* Quick 1-Tap Symptom Chips */}
          <View style={styles.chipsScroll}>
            {(SYMPTOM_PRESETS[selectedProblem.label] || [
              'Sudden mechanical breakdown',
              'Engine vibrating / stalling',
              'Unusual warning light on dash',
              'Strange noise from wheels',
            ]).map((chip, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.symptomChip}
                onPress={() => {
                  setSymptoms(chip);
                  handleRunAiDiagnosis(chip);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.symptomChipText}>+ {chip}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.aiInput}
            placeholder="Type observed symptoms (or click a suggestion above)..."
            placeholderTextColor={colors.textMuted}
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={2}
          />

          <TouchableOpacity
            style={styles.aiBtn}
            onPress={() => handleRunAiDiagnosis()}
            disabled={diagnosing}
            activeOpacity={0.7}
          >
            {diagnosing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Feather name="zap" size={14} color="#fff" />
                <Text style={styles.aiBtnText}>RUN AI DIAGNOSIS</Text>
              </>
            )}
          </TouchableOpacity>

          {aiDiagnosis && <DiagnosisCard diagnosis={aiDiagnosis} />}
        </GlassCard>

        {/* Active Vehicle Picker */}
        <View style={styles.vehicleRowHeader}>
          <Text style={styles.sectionTitle}>ASSIGNED VEHICLE</Text>
          <TouchableOpacity onPress={() => setShowAddVehicleModal(true)}>
            <Text style={styles.addVehicleLink}>+ Add Vehicle</Text>
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.vehicleCard}>
          <View style={styles.vehicleContent}>
            <MaterialCommunityIcons name="car" size={24} color={colors.primary} />
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleMakeModel}>
                {selectedVehicle
                  ? `${selectedVehicle.make} ${selectedVehicle.model}`
                  : vehicles.length > 0
                  ? `${vehicles[0].make} ${vehicles[0].model}`
                  : 'Default Registered Sedan'}
              </Text>
              <Text style={styles.vehiclePlate}>
                PLATE: {selectedVehicle?.licensePlate || vehicles[0]?.licensePlate || 'TS 09 EA 4521'}
              </Text>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>READY</Text>
            </View>
          </View>
        </GlassCard>

        {/* Search Providers Trigger */}
        <TouchableOpacity
          style={styles.searchProvidersBtn}
          onPress={handleFindProviders}
          disabled={loadingProviders}
          activeOpacity={0.8}
        >
          {loadingProviders ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="radar" size={20} color="#fff" />
              <Text style={styles.searchProvidersText}>
                SCAN NEARBY MECHANICS ({selectedProblem.label})
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Nearby Providers List */}
        {nearbyProviders.length > 0 && (
          <View style={styles.providersSection}>
            <Text style={styles.sectionTitle}>
              FOUND {nearbyProviders.length} NEARBY RESCUE UNITS (WITHIN 25KM)
            </Text>
            {nearbyProviders.map((prov) => (
              <ProviderCard
                key={prov.providerId || prov.id}
                provider={prov}
                isSelected={selectedProvider?.providerId === prov.providerId}
                onSelect={(p) => setSelectedProvider(p)}
              />
            ))}

            {/* Final Dispatch CTA */}
            <TouchableOpacity
              style={styles.dispatchBtn}
              onPress={handleDispatchAssistance}
              disabled={submittingRequest}
              activeOpacity={0.85}
            >
              {submittingRequest ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="flash" size={18} color="#fff" />
                  <Text style={styles.dispatchBtnText}>
                    DISPATCH TO {selectedProvider?.businessName || 'SELECTED MECHANIC'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <RatingModal
        visible={!!ratingTarget}
        request={ratingTarget}
        onClose={() => setRatingTarget(null)}
        onSubmit={handleSubmitRating}
      />

      <AddVehicleModal
        visible={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onSubmit={handleSaveVehicle}
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
  heroCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#0a0e17',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    position: 'relative',
    height: 120,
  },
  heroCardImage: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  heroCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    justifyContent: 'center',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  heroLiveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 0.5,
  },
  heroVersionText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
  },
  heroHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  gpsCard: {
    padding: 12,
    marginBottom: 12,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gpsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTextBox: {
    flex: 1,
  },
  gpsLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  gpsAddress: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  gpsCoords: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gpsRefreshBtn: {
    padding: 8,
  },
  sosBanner: {
    backgroundColor: colors.rose,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.rose,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  sosInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sosTextWrap: {
    flex: 1,
  },
  sosTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  sosSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
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
  problemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  problemCard: {
    width: '31%',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  problemCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  problemText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  problemTextSelected: {
    color: colors.text,
  },
  aiBox: {
    marginTop: 14,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  aiHint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  chipsScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
    marginTop: 4,
  },
  symptomChip: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  symptomChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
  },
  aiInput: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 12,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 10,
  },
  aiBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  vehicleRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  addVehicleLink: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  vehicleCard: {
    padding: 12,
  },
  vehicleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleMakeModel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  vehiclePlate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.emerald,
  },
  searchProvidersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchProvidersText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  providersSection: {
    marginTop: 14,
  },
  dispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.emerald,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dispatchBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
