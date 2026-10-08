import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import GlassCard from './GlassCard';

export default function DiagnosisCard({ diagnosis }) {
  if (!diagnosis) return null;

  const severityColor =
    diagnosis.severity === 'CRITICAL'
      ? colors.rose
      : diagnosis.severity === 'HIGH'
      ? colors.amber
      : diagnosis.severity === 'MEDIUM'
      ? colors.secondary
      : colors.emerald;

  return (
    <GlassCard highlighted style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Image
            source={require('../../assets/media/ai-diagnostics.jpg')}
            style={styles.diagThumb}
            resizeMode="cover"
          />
          <View>
            <Text style={styles.title}>AI Microservice Diagnosis</Text>
            <Text style={styles.subtitle}>FastAPI Neural Classifier</Text>
          </View>
        </View>
        <View style={[styles.severityBadge, { borderColor: severityColor }]}>
          <Text style={[styles.severityText, { color: severityColor }]}>
            {diagnosis.severity || 'HIGH'} SEVERITY
          </Text>
        </View>
      </View>

      <Text style={styles.probableCause}>
        {diagnosis.probableCause || diagnosis.issueDescription || 'Component mechanical failure'}
      </Text>

      {diagnosis.safetyAdvice && (
        <View style={styles.alertBox}>
          <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.amber} />
          <Text style={styles.alertText}>{diagnosis.safetyAdvice}</Text>
        </View>
      )}

      <View style={styles.metaRow}>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>EST. RESOLUTION</Text>
          <Text style={styles.metaValue}>{diagnosis.estimatedDurationMinutes || '30-45'} mins</Text>
        </View>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>RECOMMENDED RIG</Text>
          <Text style={styles.metaValue}>{diagnosis.requiredEquipment || 'Tow / Mobile Unit'}</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diagThumb: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  probableCause: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 8,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginVertical: 6,
  },
  alertText: {
    fontSize: 12,
    color: colors.amber,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '700',
  },
  metaValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
});
