import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import GlassCard from './GlassCard';
import StatusBadge from './StatusBadge';
import RouteMapCard from './RouteMapCard';

const STEPS = ['REQUESTED', 'ACCEPTED', 'EN_ROUTE', 'ON_SCENE', 'COMPLETED'];

export default function ActiveJobBanner({
  request,
  isProvider,
  onUpdateStatus,
  onCancelRequest,
  onRateRequest,
}) {
  if (!request) return null;

  const currentStepIdx = STEPS.indexOf(request.status);
  const targetId = request.id || request._id;

  // Auto-expand map if status is EN_ROUTE
  const [showMap, setShowMap] = useState(request.status === 'EN_ROUTE');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCall = (phone) => {
    if (!phone) {
      Alert.alert('No Phone', 'No contact phone number provided for this party.');
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  const handleStartTravel = () => {
    // Transition status to EN_ROUTE and immediately reveal customer route map
    setShowMap(true);
    if (onUpdateStatus) {
      onUpdateStatus(targetId, 'EN_ROUTE', 'Mechanic en route to customer');
    }
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      if (onCancelRequest) {
        await onCancelRequest(targetId);
      }
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <GlassCard highlighted style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.pulsingDot} />
            <Text style={styles.liveTitle}>ACTIVE RESCUE MISSION</Text>
          </View>
          <StatusBadge status={request.status} />
        </View>

        {/* Stepper */}
        <View style={styles.stepperContainer}>
          {STEPS.map((step, idx) => {
            const isDone = currentStepIdx >= idx;
            const isCurrent = currentStepIdx === idx;
            return (
              <React.Fragment key={step}>
                <View style={styles.stepNode}>
                  <View
                    style={[
                      styles.stepCircle,
                      isDone && styles.stepCircleDone,
                      isCurrent && styles.stepCircleCurrent,
                    ]}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    ) : (
                      <View style={styles.stepDot} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepText,
                      isCurrent && styles.stepTextCurrent,
                      isDone && styles.stepTextDone,
                    ]}
                    numberOfLines={1}
                  >
                    {step.replace('_', ' ')}
                  </Text>
                </View>
                {idx < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      currentStepIdx > idx && styles.stepLineDone,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* Mission details */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="car-wrench" size={18} color={colors.primary} />
            <Text style={styles.problemText}>
              {request.breakdownType || request.problemDescription || request.serviceType || 'Roadside Assistance'}
            </Text>
          </View>

          {(request.vehicle || request.vehicleDetails) && (
            <View style={styles.detailRow}>
              <Ionicons name="car-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.vehicleText}>
                {(request.vehicle || request.vehicleDetails).make} {(request.vehicle || request.vehicleDetails).model} ({(request.vehicle || request.vehicleDetails).licensePlate || 'Reg Pending'})
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={colors.secondary} />
            <Text style={styles.locationText} numberOfLines={2}>
              {request.driverLocation?.address || request.location?.address || 'Highway Breakdown Location'}
            </Text>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactRow}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactRole}>
              {isProvider ? 'STRANDED DRIVER' : 'ASSIGNED MECHANIC'}
            </Text>
            <Text style={styles.contactName}>
              {isProvider
                ? request.driverName || 'Verified Driver'
                : request.providerBusinessName || request.providerName || 'Rapid Rescue Unit'}
            </Text>
          </View>

          <View style={styles.contactActions}>
            {/* Toggle Map Button */}
            <TouchableOpacity
              style={[styles.actionIconBtn, showMap && styles.actionIconBtnActive]}
              onPress={() => setShowMap(!showMap)}
              activeOpacity={0.7}
            >
              <Feather name="map" size={18} color={showMap ? '#fff' : colors.secondary} />
            </TouchableOpacity>

            {/* Call Phone Button */}
            <TouchableOpacity
              style={[styles.actionIconBtn, styles.callBtn]}
              onPress={() =>
                handleCall(isProvider ? request.driverPhone : request.providerPhone)
              }
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Route Map Toggle Pill Bar */}
        <TouchableOpacity
          style={[styles.mapToggleBar, showMap && styles.mapToggleBarActive]}
          onPress={() => setShowMap(!showMap)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showMap ? 'map' : 'map-outline'}
            size={16}
            color={showMap ? colors.secondary : colors.textSecondary}
          />
          <Text style={[styles.mapToggleText, showMap && styles.mapToggleTextActive]}>
            {showMap ? 'HIDE ROUTE MAP' : (isProvider ? 'VIEW CUSTOMER ROUTE MAP' : 'VIEW RESCUE MAP')}
          </Text>
          <Ionicons
            name={showMap ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={showMap ? colors.secondary : colors.textMuted}
          />
        </TouchableOpacity>

        {/* Provider Action Controls */}
        {isProvider && request.status !== 'COMPLETED' && (
          <View style={styles.providerControls}>
            {request.status === 'ACCEPTED' && (
              <TouchableOpacity
                style={[styles.btn, styles.btnEnRoute]}
                onPress={handleStartTravel}
                activeOpacity={0.8}
              >
                <Ionicons name="navigate-circle" size={20} color="#fff" />
                <Text style={styles.btnText}>START TRAVEL (EN ROUTE)</Text>
              </TouchableOpacity>
            )}

            {request.status === 'EN_ROUTE' && (
              <TouchableOpacity
                style={[styles.btn, styles.btnOnScene]}
                onPress={() => onUpdateStatus(targetId, 'ON_SCENE', 'Arrived at stranded vehicle')}
                activeOpacity={0.8}
              >
                <Ionicons name="location" size={20} color="#fff" />
                <Text style={styles.btnText}>ARRIVED ON SCENE</Text>
              </TouchableOpacity>
            )}

            {request.status === 'ON_SCENE' && (
              <TouchableOpacity
                style={[styles.btn, styles.btnComplete]}
                onPress={() => onUpdateStatus(targetId, 'COMPLETED', 'Assistance complete')}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-done" size={20} color="#fff" />
                <Text style={styles.btnText}>COMPLETE ASSISTANCE</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Driver Cancel Confirmation Box */}
        {!isProvider && request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
          <View style={styles.driverControls}>
            {showCancelConfirm ? (
              <View style={styles.cancelConfirmBox}>
                <View style={styles.cancelConfirmHeader}>
                  <Ionicons name="warning-outline" size={16} color={colors.rose} />
                  <Text style={styles.cancelConfirmTitle}>Cancel Roadside Assistance?</Text>
                </View>
                <Text style={styles.cancelConfirmText}>
                  Are you sure you want to cancel this emergency request? Dispatched units will be recalled.
                </Text>
                <View style={styles.cancelConfirmButtons}>
                  <TouchableOpacity
                    style={styles.cancelDismissBtn}
                    onPress={() => setShowCancelConfirm(false)}
                    disabled={isCancelling}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelDismissText}>Keep Request</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelExecuteBtn}
                    onPress={handleConfirmCancel}
                    disabled={isCancelling}
                    activeOpacity={0.7}
                  >
                    {isCancelling ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="close-circle" size={15} color="#fff" />
                        <Text style={styles.cancelExecuteText}>Yes, Cancel</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowCancelConfirm(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={15} color={colors.rose} />
                <Text style={styles.cancelBtnText}>Cancel Breakdown Request</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Rate Request if completed and not rated */}
        {!isProvider && request.status === 'COMPLETED' && !request.rating && (
          <TouchableOpacity
            style={[styles.btn, styles.btnRate]}
            onPress={() => onRateRequest(request)}
            activeOpacity={0.8}
          >
            <Ionicons name="star" size={18} color="#fbbf24" />
            <Text style={styles.btnText}>RATE SERVICE EXPERIENCE</Text>
          </TouchableOpacity>
        )}
      </GlassCard>

      {/* Embedded Route Map Card */}
      {showMap && (
        <RouteMapCard
          request={request}
          isProvider={isProvider}
          onClose={() => setShowMap(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.rose,
  },
  liveTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.rose,
    letterSpacing: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
  },
  stepNode: {
    alignItems: 'center',
    zIndex: 2,
    flex: 1,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleDone: {
    backgroundColor: colors.emerald,
  },
  stepCircleCurrent: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#fff',
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  stepText: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },
  stepTextDone: {
    color: colors.emerald,
  },
  stepTextCurrent: {
    color: '#fff',
    fontWeight: '800',
  },
  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: -8,
    marginTop: -14,
    zIndex: 1,
  },
  stepLineDone: {
    backgroundColor: colors.emerald,
  },
  detailsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 10,
    borderRadius: 10,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  problemText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  vehicleText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  locationText: {
    fontSize: 11,
    color: colors.secondary,
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactRole: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBtnActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  callBtn: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
  mapToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  mapToggleBarActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  mapToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  mapToggleTextActive: {
    color: colors.secondary,
  },
  providerControls: {
    marginTop: 4,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  btnEnRoute: {
    backgroundColor: '#7c3aed', // Rich violet
    shadowColor: '#7c3aed',
  },
  btnOnScene: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
  },
  btnComplete: {
    backgroundColor: colors.emerald,
    shadowColor: colors.emerald,
  },
  btnRate: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: '#fbbf24',
    marginTop: 10,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  driverControls: {
    marginTop: 6,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.25)',
  },
  cancelBtnText: {
    fontSize: 12,
    color: colors.rose,
    fontWeight: '700',
  },
  cancelConfirmBox: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    borderRadius: 12,
    padding: 12,
  },
  cancelConfirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cancelConfirmTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.rose,
  },
  cancelConfirmText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 15,
  },
  cancelConfirmButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelDismissBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cancelDismissText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  cancelExecuteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.rose,
  },
  cancelExecuteText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
});
