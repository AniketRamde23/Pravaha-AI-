export const colors = {
  // Backgrounds
  background: '#0a0e17',
  card: '#111827',
  cardHover: '#1f2937',
  surface: '#161f30',
  modalBg: 'rgba(10, 14, 23, 0.95)',

  // Borders & Glows
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.15)',
  borderGlow: 'rgba(59, 130, 246, 0.4)',
  glowEmerald: 'rgba(16, 185, 129, 0.35)',
  glowRose: 'rgba(244, 63, 94, 0.35)',

  // Brand Accents
  primary: '#3b82f6', // Electric Blue
  primaryGradient: ['#3b82f6', '#1d4ed8'],
  secondary: '#06b6d4', // Cyan
  accent: '#8b5cf6', // Violet
  emerald: '#10b981', // Success / Online
  amber: '#f59e0b', // Warning / En Route
  rose: '#f43f5e', // Danger / SOS Urgent

  // Text
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  textWhite: '#ffffff',

  // Status mapping
  status: {
    REQUESTED: { label: 'Dispatched', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    ACCEPTED: { label: 'Assigned', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    EN_ROUTE: { label: 'En Route', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
    ON_SCENE: { label: 'On Scene', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
    COMPLETED: { label: 'Resolved', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    CANCELLED: { label: 'Cancelled', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  }
};
