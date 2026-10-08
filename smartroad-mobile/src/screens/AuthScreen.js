import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

export default function AuthScreen({ onOpenServerConfig }) {
  const { login, registerDriver, registerProvider } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('DRIVER'); // 'DRIVER' or 'SERVICE_PROVIDER'
  const [loading, setLoading] = useState(false);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Driver fields
  const [vehicleMake, setVehicleMake] = useState('Hyundai');
  const [vehicleModel, setVehicleModel] = useState('Creta SX');
  const [licensePlate, setLicensePlate] = useState('TS 09 EA 4521');

  // Provider fields
  const [businessName, setBusinessName] = useState('Metro Highway Rescue');
  const [address, setAddress] = useState('ORR Junction, Hyderabad');
  const [baseFee, setBaseFee] = useState('500');

  const [errorMessage, setErrorMessage] = useState(null);

  // Fast demo autofill matching web portal & MongoDB Atlas
  const autofillDemoDriver = () => {
    setIsLogin(true);
    setErrorMessage(null);
    setEmail('driver@smartroad.ai');
    setPassword('Driver@123');
  };

  const autofillDemoProvider = () => {
    setIsLogin(true);
    setErrorMessage(null);
    setEmail('provider@smartroad.ai');
    setPassword('Provider@123');
  };

  const autofillDemoLegacy = () => {
    setIsLogin(true);
    setErrorMessage(null);
    setEmail('driver@smartroad.com');
    setPassword('password123');
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        if (!fullName.trim() || !phone.trim()) {
          setErrorMessage('Please enter your full name and phone number.');
          setLoading(false);
          return;
        }

        if (role === 'DRIVER') {
          await registerDriver({
            email: email.trim(),
            password,
            fullName: fullName.trim(),
            phone: phone.trim(),
            vehicleMake: vehicleMake.trim(),
            vehicleModel: vehicleModel.trim(),
            licensePlate: licensePlate.trim().toUpperCase(),
            vehicleType: '4-Wheeler Sedan',
            vehicleYear: 2024,
            vehicleColor: 'Phantom Black',
          });
        } else {
          if (!businessName.trim()) {
            setErrorMessage('Please enter your business or workshop name.');
            setLoading(false);
            return;
          }
          await registerProvider({
            email: email.trim(),
            password,
            fullName: fullName.trim(),
            phone: phone.trim(),
            businessName: businessName.trim(),
            address: address.trim(),
            latitude: 17.5472,
            longitude: 78.2173,
            servicesOffered: [
              'TOWING',
              'BATTERY_JUMPSTART',
              'TYRE_ASSISTANCE',
              'FUEL_DELIVERY',
              'LOCKOUT_ASSISTANCE',
              'VEHICLE_DIAGNOSTICS',
            ],
            baseFee: parseFloat(baseFee) || 500,
          });
        }
      }
    } catch (err) {
      console.warn('Auth error:', err);
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please verify server connection.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Branding with Visual Banner */}
        <View style={styles.brandContainer}>
          <Image
            source={require('../../assets/media/futuristic-road.jpg')}
            style={styles.heroBannerImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="shield-car" size={30} color={colors.primary} />
            </View>
            <Text style={styles.brandTitle}>PRAVAHA AI</Text>
            <Text style={styles.brandSubtitle}>Intelligent Breakdown & Dispatch Ecosystem</Text>
            <View style={styles.versionBadgeRow}>
              <View style={styles.atlasBadge}>
                <Ionicons name="cloud-done" size={12} color="#34d399" />
                <Text style={styles.atlasBadgeText}>MongoDB Atlas Active</Text>
              </View>
              <View style={styles.versionBadge}>
                <Text style={styles.versionBadgeText}>v2.0.0</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Auth Card */}
        <GlassCard style={styles.authCard}>
          {/* Tab Switcher */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, isLogin && styles.tabBtnActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, !isLogin && styles.tabBtnActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Role selector if registering */}
          {!isLogin && (
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleOption, role === 'DRIVER' && styles.roleOptionActive]}
                onPress={() => setRole('DRIVER')}
              >
                <Ionicons
                  name="car-sport"
                  size={16}
                  color={role === 'DRIVER' ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.roleOptionText, role === 'DRIVER' && styles.roleOptionTextActive]}>
                  Stranded Driver
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleOption, role === 'SERVICE_PROVIDER' && styles.roleOptionActive]}
                onPress={() => setRole('SERVICE_PROVIDER')}
              >
                <MaterialCommunityIcons
                  name="wrench"
                  size={16}
                  color={role === 'SERVICE_PROVIDER' ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.roleOptionText, role === 'SERVICE_PROVIDER' && styles.roleOptionTextActive]}>
                  Service Provider
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={colors.rose} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Form Fields */}
          {!isLogin && (
            <>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. John Doe"
                placeholderTextColor={colors.textMuted}
                value={fullName}
                onChangeText={setFullName}
              />

              <Text style={styles.label}>PHONE NUMBER</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 9876543210"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </>
          )}

          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            placeholder="driver@example.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Extra driver fields if registering */}
          {!isLogin && role === 'DRIVER' && (
            <View style={styles.extraBox}>
              <Text style={styles.extraTitle}>INITIAL VEHICLE (OPTIONAL)</Text>
              <TextInput
                style={styles.input}
                placeholder="Make (e.g. Hyundai)"
                placeholderTextColor={colors.textMuted}
                value={vehicleMake}
                onChangeText={setVehicleMake}
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="Model (e.g. Creta SX)"
                placeholderTextColor={colors.textMuted}
                value={vehicleModel}
                onChangeText={setVehicleModel}
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="Registration Plate (e.g. TS 09 EA 4521)"
                placeholderTextColor={colors.textMuted}
                value={licensePlate}
                onChangeText={setLicensePlate}
                autoCapitalize="characters"
              />
            </View>
          )}

          {/* Extra provider fields if registering */}
          {!isLogin && role === 'SERVICE_PROVIDER' && (
            <View style={styles.extraBox}>
              <Text style={styles.extraTitle}>WORKSHOP / AGENCY DETAILS</Text>
              <TextInput
                style={styles.input}
                placeholder="Business Name (e.g. Express Towing)"
                placeholderTextColor={colors.textMuted}
                value={businessName}
                onChangeText={setBusinessName}
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="Base Location Address"
                placeholderTextColor={colors.textMuted}
                value={address}
                onChangeText={setAddress}
              />
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="Base Service Fee (₹)"
                placeholderTextColor={colors.textMuted}
                value={baseFee}
                onChangeText={setBaseFee}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isLogin ? 'AUTHENTICATE & ENTER' : 'CREATE ACCOUNT'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Quick Demo Credentials Autofill */}
          {isLogin && (
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>QUICK DEMO LOGINS</Text>
              <View style={styles.demoRow}>
                <TouchableOpacity style={styles.demoBtn} onPress={autofillDemoDriver}>
                  <Ionicons name="car" size={14} color={colors.primary} />
                  <Text style={styles.demoBtnText}>Driver Demo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.demoBtn} onPress={autofillDemoProvider}>
                  <MaterialCommunityIcons name="wrench" size={14} color={colors.accent} />
                  <Text style={styles.demoBtnText}>Provider Demo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </GlassCard>

        {/* Server Config Footer */}
        <TouchableOpacity style={styles.serverFooter} onPress={onOpenServerConfig}>
          <Ionicons name="settings-outline" size={14} color={colors.textMuted} />
          <Text style={styles.serverFooterText}>Configure Backend Server IP / Test Ping</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    position: 'relative',
  },
  heroBannerImage: {
    width: '100%',
    height: 140,
    opacity: 0.35,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  versionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  atlasBadge: {
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
  atlasBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34d399',
  },
  versionBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  versionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38bdf8',
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1.5,
    borderColor: colors.borderGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  authCard: {
    width: '100%',
    maxWidth: 420,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  roleOptionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  roleOptionTextActive: {
    color: colors.text,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  errorBannerText: {
    fontSize: 12,
    color: colors.rose,
    fontWeight: '600',
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 10,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 13,
  },
  extraBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  extraTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  serverFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    padding: 8,
  },
  serverFooterText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
