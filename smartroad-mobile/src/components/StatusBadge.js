import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function StatusBadge({ status }) {
  const conf = colors.status[status] || {
    label: status || 'UNKNOWN',
    color: colors.primary,
    bg: 'rgba(59, 130, 246, 0.15)',
  };

  return (
    <View style={[styles.badge, { backgroundColor: conf.bg, borderColor: conf.color }]}>
      <View style={[styles.dot, { backgroundColor: conf.color }]} />
      <Text style={[styles.label, { color: conf.color }]}>{conf.label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
