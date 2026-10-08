import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { providerApi } from '../services/api';
import { 
  Wrench, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight, 
  Phone, 
  DollarSign, 
  Layers,
  Inbox,
  AlertTriangle,
  Clock,
  Navigation,
  Check,
  X,
  RefreshCw,
  Car
} from 'lucide-react';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const profile = user?.profile;
  const [isAvailable, setIsAvailable] = useState(profile?.available ?? true);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProviderData = async () => {
    try {
      const [incoming, active] = await Promise.all([
        providerApi.getIncomingRequests().catch(() => []),
        providerApi.getActiveJob().catch(() => null),
      ]);
      setIncomingRequests(incoming || []);
      setActiveJob(active);
    } catch (err) {
      console.warn('Error fetching provider requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
    const interval = setInterval(fetchProviderData, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      await providerApi.toggleAvailability(nextState);
    } catch (err) {
      console.error('Failed to toggle availability:', err);
      setIsAvailable(!nextState);
    }
  };

  const handleUpdateStatus = async (requestId, status, note = '') => {
    setActionLoading(true);
    try {
      await providerApi.updateStatus(requestId, status, note);
      await fetchProviderData();
    } catch (err) {
      console.error(`Failed to update status to ${status}:`, err);
    } finally {
      setActionLoading(false);
    }
  };

  const services = profile?.servicesOffered || [
    'TOWING', 'BATTERY_JUMPSTART', 'TYRE_ASSISTANCE', 'FUEL_DELIVERY', 'LOCKOUT_ASSISTANCE', 'VEHICLE_DIAGNOSTICS'
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src="/media/technician-arrived.jpg"
            alt="Technician on Duty"
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)'
            }}
          />
          <div>
            <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '0.4rem' }}>
              Pravaha AI • Service Provider Portal
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>
              {profile?.businessName || user?.fullName}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem', marginBottom: 0 }}>
              Contact: {user?.phone} • {profile?.address || 'Registered Location'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duty Status</div>
            <span className={isAvailable ? 'badge badge-online' : 'badge'} style={{
              background: isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(156, 163, 175, 0.15)',
              color: isAvailable ? '#34d399' : '#9ca3af'
            }}>
              {isAvailable ? 'ONLINE & ACCEPTING JOBS' : 'OFFLINE'}
            </span>
          </div>

          <button
            onClick={toggleAvailability}
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
          >
            {isAvailable ? <ToggleRight size={22} color="#34d399" /> : <ToggleLeft size={22} color="#9ca3af" />}
            Toggle {isAvailable ? 'Offline' : 'Online'}
          </button>
        </div>
      </div>

      {/* KPI Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Provider Rating</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#facc15', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Star size={24} fill="#facc15" color="#facc15" />
            {profile?.rating?.toFixed(1) || '4.9'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Based on verified jobs</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed Assistance</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#38bdf8', marginTop: '0.25rem' }}>
            {profile?.totalJobsCompleted || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Lifetime jobs done</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Base Service Fee</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#34d399', marginTop: '0.25rem' }}>
            ₹{profile?.baseFee || 500}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Starting response charge</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Service Radius</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa', marginTop: '0.25rem' }}>
            15 km
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Haversine coverage</div>
        </div>
      </div>

      {/* Active Dispatched Job (If Any) */}
      {activeJob && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--accent-cyan)', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(10, 14, 23, 0.95) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="pulse-dot"></span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>Active Assigned Mission</h2>
              <span className="badge badge-tech">{activeJob.status}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Job ID: <code style={{ color: 'var(--accent-cyan)' }}>{activeJob.id}</code>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Driver & Vehicle</h4>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>{activeJob.driverName}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                <Phone size={14} color="var(--accent-cyan)" /> {activeJob.driverPhone}
              </p>
              {activeJob.vehicle && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: '#0a0e17', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <Car size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  {activeJob.vehicle.make} {activeJob.vehicle.model} ({activeJob.vehicle.licensePlate})
                </div>
              )}
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Breakdown Details</h4>
              <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--accent-amber)' }}>
                {activeJob.breakdownType?.replace('_', ' ')}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {activeJob.problemDescription || 'Immediate on-road breakdown assistance requested.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <MapPin size={14} color="var(--accent-emerald)" />
                {activeJob.location?.address || `${activeJob.location?.latitude?.toFixed(4)}, ${activeJob.location?.longitude?.toFixed(4)}`}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Update Mission Status</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {activeJob.status === 'ACCEPTED' && (
                  <button 
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(activeJob.id, 'EN_ROUTE', 'Provider is en route to breakdown location')}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem' }}
                  >
                    <Navigation size={15} /> Mark En Route
                  </button>
                )}
                {activeJob.status === 'EN_ROUTE' && (
                  <button 
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(activeJob.id, 'ON_SCENE', 'Provider has arrived at breakdown site')}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <MapPin size={15} /> Mark Arrived On Scene
                  </button>
                )}
                {(activeJob.status === 'ON_SCENE' || activeJob.status === 'EN_ROUTE') && (
                  <button 
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(activeJob.id, 'COMPLETED', 'Assistance completed successfully')}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
                  >
                    <CheckCircle2 size={15} /> Complete Assistance
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services and Live Request Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Offered Services */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--accent-amber)" />
            Services Offered
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {services.map((s, idx) => (
              <span key={idx} className="badge badge-tech" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                <CheckCircle2 size={13} /> {s.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Incoming Dispatch Queue */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Inbox size={18} color="var(--accent-cyan)" />
              Incoming Assistance Requests ({incomingRequests.length})
            </h3>
            <button 
              onClick={fetchProviderData} 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {incomingRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.9rem' }}>No incoming requests right now.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                When a stranded motorist in your 15km radius selects your business, live requests will arrive here with navigation coordinates.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {incomingRequests.map((req) => (
                <div 
                  key={req.id} 
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    background: '#0a0e17', 
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span className="badge badge-tech" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                        {req.breakdownType?.replace('_', ' ')}
                      </span>
                      <h4 style={{ fontSize: '1rem', color: 'white', marginTop: '0.25rem' }}>{req.driverName}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={13} /> {req.driverPhone}
                      </p>
                    </div>
                    <span className="badge badge-online" style={{ fontSize: '0.7rem' }}>
                      NEW REQUEST
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '0.75rem' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {req.location?.address || 'Highway location shared via GPS'}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(req.id, 'ACCEPTED', 'Provider accepted job and is preparing to dispatch')}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '0.55rem', fontSize: '0.85rem' }}
                    >
                      <Check size={14} /> Accept & Dispatch
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(req.id, 'REJECTED', 'Provider currently at capacity')}
                      className="btn btn-secondary"
                      style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', color: '#f87171' }}
                    >
                      <X size={14} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
