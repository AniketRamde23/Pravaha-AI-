import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function GlassCard({ children, style, highlighted }) {
  return (
    <View
      style={[
        styles.card,
        highlighted && styles.cardHighlighted,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHighlighted: {
    borderColor: colors.borderGlow,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
});
