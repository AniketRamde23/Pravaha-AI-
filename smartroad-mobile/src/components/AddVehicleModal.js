import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

export default function AddVehicleModal({ visible, onClose, onSubmit }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('4-Wheeler Sedan');
  const [year, setYear] = useState('2024');
  const [color, setColor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!make.trim() || !model.trim() || !licensePlate.trim()) {
      Alert.alert('Required Fields', 'Please enter make, model, and registration plate.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        make: make.trim(),
        model: model.trim(),
        licensePlate: licensePlate.trim().toUpperCase(),
        vehicleType,
        year: parseInt(year, 10) || 2024,
        color: color.trim() || 'Black',
      });
      // reset
      setMake('');
      setModel('');
      setLicensePlate('');
      setColor('');
      onClose();
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to add vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Add Vehicle to Garage</Text>
          <Text style={styles.subtitle}>Register your car or bike for instant dispatch</Text>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>MAKE (BRAND)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Hyundai, Toyota, Tata"
              placeholderTextColor={colors.textMuted}
              value={make}
              onChangeText={setMake}
            />

            <Text style={styles.label}>MODEL</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Creta, Fortuner, Nexon"
              placeholderTextColor={colors.textMuted}
              value={model}
              onChangeText={setModel}
            />

            <Text style={styles.label}>LICENSE NUMBER PLATE</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. TS 09 EA 4521"
              placeholderTextColor={colors.textMuted}
              value={licensePlate}
              onChangeText={setLicensePlate}
              autoCapitalize="characters"
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>YEAR</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2024"
                  placeholderTextColor={colors.textMuted}
                  value={year}
                  onChangeText={setYear}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.label}>COLOR</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. White"
                  placeholderTextColor={colors.textMuted}
                  value={color}
                  onChangeText={setColor}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={submitting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>Save Vehicle</Text>
              )}
            </TouchableOpacity>
          </View>
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
    maxWidth: 420,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  formScroll: {
    maxHeight: 320,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
  },
});
