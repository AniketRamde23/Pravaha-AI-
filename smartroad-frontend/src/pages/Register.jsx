import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Car, Wrench, AlertCircle, Check } from 'lucide-react';
import pravahaLogo from '../assets/logo.png';

export default function Register() {
  const [roleType, setRoleType] = useState('DRIVER'); // 'DRIVER' or 'PROVIDER'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Driver Fields
  const [driverData, setDriverData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    licensePlate: '',
    vehicleType: '4-Wheeler Sedan',
    vehicleYear: 2023,
    vehicleColor: '',
  });

  // Provider Fields
  const [providerData, setProviderData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    latitude: 17.4486,
    longitude: 78.3908,
    baseFee: 500,
    servicesOffered: ['TOWING', 'BATTERY_JUMPSTART', 'TYRE_ASSISTANCE', 'FUEL_DELIVERY', 'LOCKOUT_ASSISTANCE', 'VEHICLE_DIAGNOSTICS'],
  });

  const { registerDriver, registerProvider } = useAuth();
  const navigate = useNavigate();

  const handleServiceToggle = (serviceCode) => {
    setProviderData(prev => {
      const exists = prev.servicesOffered.includes(serviceCode);
      return {
        ...prev,
        servicesOffered: exists 
          ? prev.servicesOffered.filter(s => s !== serviceCode)
          : [...prev.servicesOffered, serviceCode]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (roleType === 'DRIVER') {
        await registerDriver(driverData);
        navigate('/driver');
      } else {
        await registerProvider(providerData);
        navigate('/provider');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions = [
    { code: 'TOWING', label: 'Towing Assistance' },
    { code: 'TYRE_ASSISTANCE', label: 'Flat Tire Service' },
    { code: 'BATTERY_JUMPSTART', label: 'Battery Jump-Start' },
    { code: 'FUEL_DELIVERY', label: 'Emergency Fuel Delivery' },
    { code: 'LOCKOUT_ASSISTANCE', label: 'Lockout Assistance' },
    { code: 'VEHICLE_DIAGNOSTICS', label: 'Vehicle Diagnostics' },
  ];

  return (
    <div className="container" style={{ maxWidth: '640px', paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img 
            src={pravahaLogo} 
            alt="Pravaha AI Logo" 
            style={{ 
              height: '68px', 
              width: '68px', 
              objectFit: 'cover', 
              borderRadius: '16px', 
              marginBottom: '0.85rem',
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.3)',
              border: '2px solid rgba(56, 189, 248, 0.4)' 
            }} 
          />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Create an Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Choose your account role and get started with Pravaha AI
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: '#0a0e17',
          padding: '0.35rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => setRoleType('DRIVER')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: roleType === 'DRIVER' ? 'var(--accent-blue)' : 'transparent',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
          >
            <Car size={16} /> Driver / Owner
          </button>

          <button
            type="button"
            onClick={() => setRoleType('PROVIDER')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: roleType === 'PROVIDER' ? 'var(--accent-amber)' : 'transparent',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
          >
            <Wrench size={16} /> Service Provider
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          {/* Common Account Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={roleType === 'DRIVER' ? driverData.fullName : providerData.fullName}
                onChange={(e) => roleType === 'DRIVER' 
                  ? setDriverData({ ...driverData, fullName: e.target.value })
                  : setProviderData({ ...providerData, fullName: e.target.value })}
                placeholder="e.g. John Doe"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  background: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'white',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={roleType === 'DRIVER' ? driverData.phone : providerData.phone}
                onChange={(e) => roleType === 'DRIVER'
                  ? setDriverData({ ...driverData, phone: e.target.value })
                  : setProviderData({ ...providerData, phone: e.target.value })}
                placeholder="+91 9876543210"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  background: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'white',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={roleType === 'DRIVER' ? driverData.email : providerData.email}
                onChange={(e) => roleType === 'DRIVER'
                  ? setDriverData({ ...driverData, email: e.target.value })
                  : setProviderData({ ...providerData, email: e.target.value })}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  background: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'white',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Password (min 6 chars) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={roleType === 'DRIVER' ? driverData.password : providerData.password}
                onChange={(e) => roleType === 'DRIVER'
                  ? setDriverData({ ...driverData, password: e.target.value })
                  : setProviderData({ ...providerData, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  background: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'white',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* DRIVER SPECIFIC FIELDS */}
          {roleType === 'DRIVER' && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
                Vehicle Profile (Optional)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Make (Brand)
                  </label>
                  <input
                    type="text"
                    value={driverData.vehicleMake}
                    onChange={(e) => setDriverData({ ...driverData, vehicleMake: e.target.value })}
                    placeholder="e.g. Hyundai / Toyota"
                    style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Model
                  </label>
                  <input
                    type="text"
                    value={driverData.vehicleModel}
                    onChange={(e) => setDriverData({ ...driverData, vehicleModel: e.target.value })}
                    placeholder="e.g. i20 Asta / Fortuner"
                    style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    License Plate No.
                  </label>
                  <input
                    type="text"
                    value={driverData.licensePlate}
                    onChange={(e) => setDriverData({ ...driverData, licensePlate: e.target.value })}
                    placeholder="e.g. TS 09 EA 4589"
                    style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Vehicle Type
                  </label>
                  <select
                    value={driverData.vehicleType}
                    onChange={(e) => setDriverData({ ...driverData, vehicleType: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  >
                    <option value="2-Wheeler">2-Wheeler (Motorcycle/Scooter)</option>
                    <option value="4-Wheeler Sedan">4-Wheeler Sedan</option>
                    <option value="4-Wheeler SUV">4-Wheeler SUV</option>
                    <option value="Commercial / Truck">Commercial / Heavy Vehicle</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PROVIDER SPECIFIC FIELDS */}
          {roleType === 'PROVIDER' && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-amber)', marginBottom: '0.75rem' }}>
                Business Profile & Services
              </h4>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Business / Workshop Name *
                </label>
                <input
                  type="text"
                  required
                  value={providerData.businessName}
                  onChange={(e) => setProviderData({ ...providerData, businessName: e.target.value })}
                  placeholder="e.g. QuickFix Highway Auto Rescue"
                  style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Workshop Address / Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={providerData.address}
                  onChange={(e) => setProviderData({ ...providerData, address: e.target.value })}
                  placeholder="e.g. NH-44 Toll Plaza Exit 2, Hyderabad"
                  style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Starting Base Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={providerData.baseFee}
                    onChange={(e) => setProviderData({ ...providerData, baseFee: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    GPS Coordinates (Lat, Lng)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${providerData.latitude}, ${providerData.longitude}`}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', background: '#0a0e17', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#9ca3af' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Select Services Offered
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {serviceOptions.map(opt => {
                    const checked = providerData.servicesOffered.includes(opt.code);
                    return (
                      <div
                        key={opt.code}
                        onClick={() => handleServiceToggle(opt.code)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.55rem 0.75rem',
                          background: checked ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${checked ? 'var(--accent-amber)' : 'var(--border-color)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          color: checked ? '#fef3c7' : 'var(--text-muted)',
                        }}
                      >
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: `1px solid ${checked ? 'var(--accent-amber)' : '#4b5563'}`,
                          background: checked ? 'var(--accent-amber)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {checked && <Check size={12} color="black" />}
                        </div>
                        {opt.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.75rem' }}
          >
            {loading ? 'Creating Account...' : `Register as ${roleType === 'DRIVER' ? 'Driver' : 'Service Provider'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
