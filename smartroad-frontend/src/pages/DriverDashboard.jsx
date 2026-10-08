import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { driverApi } from '../services/api';
import AssistanceMap from '../components/AssistanceMap';
import { 
  Car, 
  MapPin, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  Phone,
  ArrowRight,
  Star,
  X,
  Navigation,
  ShieldCheck,
  Zap,
  Radio
} from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const profile = user?.profile;
  const [vehicles, setVehicles] = useState(profile?.vehicles || []);

  // Location State (defaults to live coordinates seen in screenshot)
  const [location, setLocation] = useState({
    latitude: 17.5472,
    longitude: 78.2173,
    address: 'Near ORR Exit, Dundigal - Gandimaisamma, Hyderabad'
  });
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Active Request & History State
  const [activeRequest, setActiveRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingActive, setLoadingActive] = useState(true);

  // Request Assistance Wizard State
  const [isRequesting, setIsRequesting] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState('Flat Tire');
  const [symptoms, setSymptoms] = useState('');
  const [aiDiagnosis, setAiDiagnosis] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);

  // Providers Discovery State
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Add Vehicle Modal
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    licensePlate: '',
    vehicleType: '4-Wheeler Sedan',
    year: 2024,
    color: ''
  });

  // Rating Modal
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Fetch active request and history on load
  const loadRequests = async () => {
    try {
      const active = await driverApi.getActiveRequest();
      setActiveRequest(active);
      const hist = await driverApi.getHistory();
      setHistory(hist);
    } catch (err) {
      console.warn('Error loading requests:', err);
    } finally {
      setLoadingActive(false);
    }
  };

  const mapServiceToCategoryAndType = (serviceName) => {
    if (!serviceName) return { problem: 'Flat Tire', serviceType: 'TYRE_ASSISTANCE' };
    const s = serviceName.toLowerCase();
    if (s.includes('tow')) return { problem: 'Towing Assistance', serviceType: 'TOWING' };
    if (s.includes('fuel')) return { problem: 'Empty Fuel', serviceType: 'FUEL_DELIVERY' };
    if (s.includes('tire') || s.includes('puncture') || s.includes('wheel')) return { problem: 'Flat Tire', serviceType: 'TYRE_ASSISTANCE' };
    if (s.includes('battery') || s.includes('jump')) return { problem: 'Battery Jump-Start', serviceType: 'BATTERY_JUMPSTART' };
    if (s.includes('lock')) return { problem: 'Lockout', serviceType: 'LOCKOUT_ASSISTANCE' };
    if (s.includes('diag') || s.includes('engine')) return { problem: 'Vehicle Diagnostics', serviceType: 'VEHICLE_DIAGNOSTICS' };
    return { problem: 'Vehicle Diagnostics', serviceType: 'VEHICLE_DIAGNOSTICS' };
  };

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    if (serviceParam) {
      const match = mapServiceToCategoryAndType(serviceParam);
      setSelectedProblem(match.problem);
      setIsRequesting(true);
      handleFindNearbyProviders(match.serviceType);

      setTimeout(() => {
        const wizard = document.getElementById('assistance-wizard');
        if (wizard) {
          wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [serviceParam]);

  const detectGps = () => {
    setDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lng = parseFloat(pos.coords.longitude.toFixed(4));
          setLocation({
            latitude: lat,
            longitude: lng,
            address: `GPS: ${lat}, ${lng}`
          });
          setDetectingLocation(false);
        },
        () => setDetectingLocation(false)
      );
    } else {
      setDetectingLocation(false);
    }
  };

  // Run AI Diagnosis using Python FastAPI microservice
  const handleRunAiDiagnosis = async () => {
    setDiagnosing(true);
    try {
      const res = await driverApi.diagnoseBreakdown({
        selectedProblem,
        symptoms: symptoms || `${selectedProblem} roadside breakdown`,
        hasImage: false
      });
      setAiDiagnosis(res);
      // Auto search nearby providers after diagnosis
      handleFindNearbyProviders(res.recommendedService);
    } catch (err) {
      console.warn('AI Diagnosis failed, using rule fallback:', err);
    } finally {
      setDiagnosing(false);
    }
  };

  // Search Nearby Providers using Haversine calculation in Spring Boot
  const handleFindNearbyProviders = async (serviceType) => {
    setLoadingProviders(true);
    try {
      const providers = await driverApi.findNearbyProviders({
        latitude: location.latitude,
        longitude: location.longitude,
        serviceType: serviceType || 'TYRE_ASSISTANCE',
        radiusKm: 35.0
      });
      setNearbyProviders(providers);
      if (providers.length > 0) {
        setSelectedProvider(providers[0]); // select recommended
      }
    } catch (err) {
      console.error('Failed to load nearby providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  };

  // Start Breakdown Request Wizard
  const handleStartRequest = () => {
    setIsRequesting(true);
    const { serviceType } = mapServiceToCategoryAndType(selectedProblem);
    handleFindNearbyProviders(serviceType);
  };

  const handleCategorySelect = (label) => {
    setSelectedProblem(label);
    const { serviceType } = mapServiceToCategoryAndType(label);
    handleFindNearbyProviders(serviceType);
  };

  // Submit Assistance Dispatch Request to MongoDB
  const handleSubmitDispatch = async () => {
    if (!selectedProvider) return;
    setSubmittingRequest(true);

    try {
      const payload = {
        vehicleIndex: 0,
        breakdownType: selectedProblem.toUpperCase().replace(/ /g, '_'),
        symptoms: symptoms || `${selectedProblem} roadside emergency`,
        aiPrediction: aiDiagnosis?.prediction || selectedProblem,
        aiConfidence: aiDiagnosis?.confidence || 0.9,
        recommendedService: aiDiagnosis?.recommendedService || 'TYRE_ASSISTANCE',
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        selectedProviderId: selectedProvider.providerId
      };

      const created = await driverApi.createRequest(payload);
      setActiveRequest(created);
      setIsRequesting(false);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to dispatch request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Cancel Request
  const handleCancelRequest = async () => {
    if (!activeRequest) return;
    if (window.confirm('Are you sure you want to cancel this assistance request?')) {
      await driverApi.cancelRequest(activeRequest.id, 'Cancelled by driver');
      setActiveRequest(null);
      loadRequests();
    }
  };

  // Rate completed request
  const handleRate = async () => {
    if (!activeRequest) return;
    await driverApi.rateRequest(activeRequest.id, ratingVal, reviewText);
    alert('Thank you for your rating!');
    setActiveRequest(null);
    loadRequests();
  };

  // Add Vehicle
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await driverApi.addVehicle(newVehicle);
      setVehicles(updatedProfile.vehicles);
      setShowAddVehicle(false);
      setNewVehicle({ make: '', model: '', licensePlate: '', vehicleType: '4-Wheeler Sedan', year: 2024, color: '' });
    } catch (err) {
      alert('Failed to add vehicle: ' + err.message);
    }
  };

  const breakdownTypes = [
    { label: 'Flat Tire', icon: '🛞' },
    { label: 'Battery Jump-Start', icon: '🔋' },
    { label: 'Empty Fuel', icon: '⛽' },
    { label: 'Engine Problem', icon: '🔧' },
    { label: 'Lockout', icon: '🔐' },
    { label: 'Towing Assistance', icon: '🚚' },
    { label: 'Vehicle Diagnostics', icon: '💻' }
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-tech" style={{ marginBottom: '0.5rem' }}>Driver Portal</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Welcome, <span className="gradient-text">{user?.fullName}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Emergency roadside assistance and real-time provider dispatch
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location Status</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent-cyan)' }}>
              {location.latitude}, {location.longitude}
            </div>
          </div>
          <button 
            onClick={detectGps} 
            disabled={detectingLocation}
            className="btn btn-secondary" 
            style={{ padding: '0.6rem 1rem' }}
          >
            <MapPin size={16} />
            {detectingLocation ? 'Detecting...' : 'Update GPS'}
          </button>
        </div>
      </div>

      {/* ACTIVE DISPATCH TRACKING BANNER (If request is in progress) */}
      {activeRequest && (
        <section className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(17, 24, 39, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          marginBottom: '2.5rem',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-online">
                  <Radio size={12} className="spin" /> LIVE DISPATCH ACTIVE
                </span>
                <span className="badge badge-tech">{activeRequest.breakdownType}</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
                Provider: {activeRequest.providerBusinessName}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Estimated Arrival: <strong style={{ color: '#38bdf8' }}>{activeRequest.etaRange || `${activeRequest.estimatedEtaMinutes} mins`}</strong> • Distance: <strong>{activeRequest.distanceKm} km</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href={`tel:${activeRequest.providerPhone}`} style={{ textDecoration: 'none' }}>
                <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                  <Phone size={15} /> Call Provider ({activeRequest.providerPhone})
                </button>
              </a>
              <button onClick={handleCancelRequest} className="btn btn-secondary" style={{ padding: '0.6rem 1rem', color: '#fb7185' }}>
                Cancel Request
              </button>
            </div>
          </div>

          {/* Lifecycle State Machine Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', padding: '1rem', background: '#0a0e17', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            {['REQUESTED', 'ACCEPTED', 'PROVIDER_EN_ROUTE', 'ARRIVED', 'SERVICE_COMPLETED'].map((step, idx) => {
              const currentIdx = ['REQUESTED', 'ACCEPTED', 'PROVIDER_EN_ROUTE', 'ARRIVED', 'SERVICE_COMPLETED'].indexOf(activeRequest.status);
              const isPast = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: isPast ? 1 : 0.4 }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isCurrent ? 'var(--accent-blue)' : (isPast ? '#10b981' : '#374151'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'white'
                  }}>
                    {isPast && !isCurrent ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: isCurrent ? '700' : '500', color: isCurrent ? 'white' : 'var(--text-muted)' }}>
                    {step.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Leaflet Tracking Map */}
          <AssistanceMap
            driverLocation={activeRequest.driverLocation}
            selectedProvider={activeRequest.providerLocation}
            height="300px"
          />

          {/* Complete and Rate trigger if completed */}
          {(activeRequest.status === 'SERVICE_COMPLETED' || activeRequest.status === 'ARRIVED') && (
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#34d399', marginBottom: '0.5rem' }}>Service Completed! Please Rate Your Provider</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    fill={star <= ratingVal ? '#facc15' : 'none'}
                    color="#facc15"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setRatingVal(star)}
                  />
                ))}
              </div>
              <input
                type="text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Optional feedback: Quick service, highly recommended..."
                style={{ width: '100%', padding: '0.65rem 0.9rem', background: '#111827', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', marginBottom: '0.75rem' }}
              />
              <button onClick={handleRate} className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
                Submit Rating & Complete
              </button>
            </div>
          )}
        </section>
      )}

      {/* REQUEST ASSISTANCE INTERACTIVE WIZARD (When user clicks Request button) */}
      {isRequesting ? (
        <section id="assistance-wizard" className="glass-card" style={{ marginBottom: '2.5rem', border: '1px solid var(--accent-blue)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span className="badge badge-tech" style={{ marginBottom: '0.3rem' }}>Step-by-Step Assistance Dispatch</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Report Vehicle Breakdown</h2>
            </div>
            <button onClick={() => setIsRequesting(false)} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
              <X size={16} /> Close
            </button>
          </div>

          {/* Breakdown Category Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              1. What happened to your vehicle?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {breakdownTypes.map((bt) => {
                const isSelected = selectedProblem === bt.label;
                return (
                  <div
                    key={bt.label}
                    onClick={() => handleCategorySelect(bt.label)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{bt.icon}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: isSelected ? '700' : '500', color: isSelected ? 'white' : 'var(--text-muted)' }}>
                      {bt.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Symptoms & AI Diagnostic Inference */}
          <div style={{ marginBottom: '1.5rem', background: '#0a0e17', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.75rem',
              background: 'rgba(56, 189, 248, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.15)'
            }}>
              <img
                src="/media/ai-diagnostics.jpg"
                alt="AI Diagnostics Engine"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#38bdf8' }}>
                  FastAPI Heuristic AI Diagnostic Engine
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Our neural classifier analyzes symptoms to auto-select required technician equipment and estimate severity.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                2. Describe Observed Symptoms / Warning Signs
              </label>
              <button
                type="button"
                onClick={handleRunAiDiagnosis}
                disabled={diagnosing}
                className="btn btn-primary"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
              >
                <Sparkles size={14} />
                {diagnosing ? 'Analyzing...' : 'Diagnose with Python AI'}
              </button>
            </div>

            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Rear tire completely flat after highway pothole, or engine clicking noise"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#111827',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white',
                fontFamily: 'inherit'
              }}
            />

            {aiDiagnosis && (
              <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#c084fc', fontWeight: '600' }}>
                  <Zap size={15} /> AI PREDICTION: {aiDiagnosis.prediction} ({Math.round(aiDiagnosis.confidence * 100)}% Confidence)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Recommended Service: <strong style={{ color: 'white' }}>{aiDiagnosis.recommendedService}</strong> — {aiDiagnosis.explanation}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Map & Nearby Providers */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              3. Nearby Verified Providers (Haversine Proximity & AI Suitability)
            </label>

            <AssistanceMap
              driverLocation={location}
              providers={nearbyProviders}
              selectedProvider={selectedProvider}
              height="260px"
            />

            {loadingProviders ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>Calculating nearby providers...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {nearbyProviders.map((p) => {
                  const isChosen = selectedProvider?.providerId === p.providerId;
                  return (
                    <div
                      key={p.providerId}
                      onClick={() => setSelectedProvider(p)}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: isChosen ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isChosen ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                    >
                      {p.isRecommended && (
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#facc15',
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(245, 158, 11, 0.4)'
                        }}>
                          ⭐ AI RECOMMENDED
                        </span>
                      )}

                      <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'white', marginBottom: '0.2rem' }}>
                        {p.businessName}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {p.address}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                        {p.open24x7 && (
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#34d399',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(16, 185, 129, 0.4)'
                          }}>
                            🟢 OPEN 24x7
                          </span>
                        )}
                        {p.distanceFromMRUKm != null && (
                          <span style={{
                            background: 'rgba(147, 51, 234, 0.15)',
                            color: '#c084fc',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(147, 51, 234, 0.3)'
                          }}>
                            MRU: {p.distanceFromMRUKm} km
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>📍 {p.distanceKm} km away</span>
                        <span style={{ color: '#facc15' }}>⭐ {p.rating?.toFixed(1)} ({p.totalRatings || 0})</span>
                        <span style={{ color: '#34d399' }}>⏱ {p.etaRange || `${p.etaMinutes} mins`}</span>
                        <span style={{ color: 'white', fontWeight: '600' }}>₹{p.baseFee}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dispatch CTA */}
          <button
            onClick={handleSubmitDispatch}
            disabled={submittingRequest || !selectedProvider}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
          >
            <Navigation size={18} />
            {submittingRequest ? 'Dispatching...' : `Dispatch ${selectedProvider ? selectedProvider.businessName : 'Provider'} to My Location`}
          </button>
        </section>
      ) : (
        /* STANDARD DRIVER DASHBOARD VIEW (When not in wizard) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Quick Breakdown Emergency Action Card */}
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(17, 24, 39, 0.9) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
                <AlertTriangle size={24} color="#f87171" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Vehicle Stranded?</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Request Instant Roadside Help</p>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Report your vehicle breakdown, use AI diagnostics with photo upload, and match with the closest towing or mechanic service.
            </p>

            <button
              onClick={handleStartRequest}
              className="btn btn-primary"
              style={{ width: '100%', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
            >
              <Sparkles size={16} /> Request Breakdown Assistance
            </button>
          </div>

          {/* Vehicle Information Card */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.6rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px' }}>
                  <Car size={24} color="var(--accent-blue)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Registered Vehicles</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Connected to your account</p>
                </div>
              </div>

              <button
                onClick={() => setShowAddVehicle(true)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {vehicles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {vehicles.map((v, idx) => (
                  <div key={idx} style={{
                    padding: '0.85rem 1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'white' }}>{v.make} {v.model}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.vehicleType} • {v.year}</div>
                    </div>
                    <span className="badge badge-tech" style={{ fontFamily: 'var(--font-mono)' }}>
                      {v.licensePlate || 'NO PLATE'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No vehicles registered yet. Click Add to save your vehicle details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Driver Assistance History */}
      <section className="glass-card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--accent-cyan)" />
          Recent Assistance Requests
        </h3>

        {history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {history.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {req.breakdownType} 
                    <span className="badge badge-tech" style={{ fontSize: '0.7rem' }}>{req.status}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Provider: {req.providerBusinessName} • {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#34d399' }}>₹{req.serviceFee}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.distanceKm} km</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.9rem' }}>No past requests recorded yet.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Whenever you request breakdown assistance, your logs will be archived here.
            </p>
          </div>
        )}
      </section>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', background: '#111827' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Register New Vehicle</h3>
              <button onClick={() => setShowAddVehicle(false)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Make (Brand)</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    placeholder="e.g. Honda"
                    style={{ width: '100%', padding: '0.65rem', background: '#0a0e17', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Model</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    placeholder="e.g. City ZX"
                    style={{ width: '100%', padding: '0.65rem', background: '#0a0e17', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>License Plate</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.licensePlate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                    placeholder="TS 07 HK 2024"
                    style={{ width: '100%', padding: '0.65rem', background: '#0a0e17', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) || 2024 })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0a0e17', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehicle Body Type</label>
                <select
                  value={newVehicle.vehicleType}
                  onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: '#0a0e17', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                >
                  <option value="2-Wheeler">2-Wheeler (Motorcycle/Scooter)</option>
                  <option value="4-Wheeler Sedan">4-Wheeler Sedan</option>
                  <option value="4-Wheeler SUV">4-Wheeler SUV</option>
                  <option value="Commercial / Heavy">Commercial / Heavy Vehicle</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
                Save Vehicle Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
