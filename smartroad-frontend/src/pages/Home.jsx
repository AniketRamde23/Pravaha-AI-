import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Car, 
  Wrench, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Clock, 
  Phone, 
  Mail,
  Sparkles
} from 'lucide-react';

// Premium 3D Isometric Service Illustrations
import towing3D from '../assets/images/towing_3d.jpg';
import fuel3D from '../assets/images/fuel_3d.jpg';
import tire3D from '../assets/images/tire_3d.jpg';
import battery3D from '../assets/images/battery_3d.jpg';
import lockout3D from '../assets/images/lockout_3d.jpg';
import diagnostics3D from '../assets/images/diagnostics_3d.jpg';
import homeImg from '../assets/images/Home.jpg';

export default function Home() {
  const { isAuthenticated, role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'DRIVER') return '/driver';
    if (role === 'SERVICE_PROVIDER') return '/provider';
    if (role === 'ADMIN') return '/admin';
    return '/login';
  };

  const getRequestServicePath = (serviceTitle) => {
    if (isAuthenticated) {
      if (role === 'DRIVER') {
        return `/driver?service=${encodeURIComponent(serviceTitle)}`;
      }
      if (role === 'SERVICE_PROVIDER') {
        return '/provider';
      }
      if (role === 'ADMIN') {
        return '/admin';
      }
    }
    return `/login?redirect=${encodeURIComponent(`/driver?service=${encodeURIComponent(serviceTitle)}`)}`;
  };

  const services = [
    {
      title: 'Towing Services',
      desc: 'We offer towing services to bring your vehicle to the nearest service station safely.',
      image: towing3D,
      badge: 'Rapid Flatbed & Wheel-lift',
      accent: '#38bdf8'
    },
    {
      title: 'Fuel Delivery',
      desc: 'If you run out of fuel, we provide fast fuel delivery to get you back on the road in minutes.',
      image: fuel3D,
      badge: 'Petrol & Diesel On-Demand',
      accent: '#facc15'
    },
    {
      title: 'Flat Tire Assistance',
      desc: 'Our experts will help you replace or repair your flat tire quickly and efficiently on-spot.',
      image: tire3D,
      badge: 'Puncture & Stepney Swap',
      accent: '#f87171'
    },
    {
      title: 'Battery Jump-Start',
      desc: 'If your car battery dies, we provide jump-start services to get your vehicle running again.',
      image: battery3D,
      badge: '12V Booster & Alternator Check',
      accent: '#fb923c'
    },
    {
      title: 'Lockout Assistance',
      desc: 'Locked out of your vehicle? We provide lockout assistance to help you get back in quickly.',
      image: lockout3D,
      badge: 'Non-Destructive Key Recovery',
      accent: '#a78bfa'
    },
    {
      title: 'Vehicle Diagnostics',
      desc: 'We offer on-the-spot vehicle diagnostics to identify and fix any underlying engine issues.',
      image: diagnostics3D,
      badge: 'OBD-II Computer Telemetry',
      accent: '#4ade80'
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="badge badge-tech" style={{ padding: '0.4rem 0.85rem' }}>
                  <Sparkles size={14} /> Pravaha AI • Movement • Support • Safety
                </span>
                <span className="badge badge-online">
                  <MapPin size={14} /> GPS Location Aware
                </span>
              </div>

              <h1 style={{ fontSize: '2.9rem', lineHeight: '1.2', fontWeight: '800', marginBottom: '1.25rem' }}>
                Pravaha AI: Real-Time <span className="gradient-text">Vehicle Breakdown Assistance</span>
              </h1>

              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
                Pravaha AI delivers instant on-road rescue when your vehicle faces unexpected troubles. With intelligent diagnostics, nearest verified providers, and rapid dispatch directly to your live highway coordinates.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {isAuthenticated ? (
                  <Link to={getDashboardPath()} style={{ textDecoration: 'none' }}>
                    <button className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                      Go to Your Dashboard <ArrowRight size={18} />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <button className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                        Need Assistance? Sign Up <ArrowRight size={18} />
                      </button>
                    </Link>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}>
                        Sign In
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img
                src={homeImg}
                alt="On-Road Vehicle Breakdown Assistance"
                style={{
                  width: '100%',
                  maxHeight: '380px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Services Grid with Premium 3D Isometric Artwork */}
      <section id="services" style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-tech" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={13} /> Specialized Breakdown Support
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Comprehensive On-Road Services</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Immediate assistance dispatched to your exact GPS coordinates
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {services.map((s, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '0',
                borderRadius: '18px',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Image Container with Hover Zoom */}
              <Link to={getRequestServicePath(s.title)} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{
                  position: 'relative',
                  height: '220px',
                  overflow: 'hidden',
                  background: '#0a0e17',
                  cursor: 'pointer'
                }}>
                  <img
                    src={s.image}
                    alt={s.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(10, 14, 23, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: s.accent,
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '20px',
                    border: `1px solid ${s.accent}40`
                  }}>
                    {s.badge}
                  </span>
                </div>
              </Link>

              {/* Text Body */}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '0.6rem'
                  }}>
                    {s.title}
                  </h3>

                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    marginBottom: '1.25rem'
                  }}>
                    {s.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Available 24/7</span>
                  <Link to={getRequestServicePath(s.title)} style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Request Service <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Highlights */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(17, 24, 39, 0.8) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          padding: '2.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <span className="badge badge-tech" style={{ marginBottom: '0.75rem' }}>Intelligent Architecture</span>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Next-Generation AI Assistance</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                Combines high-performance Spring Boot business logic, Python Machine Learning diagnostics, and a modern React interface with MongoDB persistent dispatch states.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <ShieldCheck size={18} color="#34d399" /> <span>BCrypt & JWT Role-Based Security</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <MapPin size={18} color="#38bdf8" /> <span>Haversine Precise Geo-Proximity Matching</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Clock size={18} color="#facc15" /> <span>Dynamic AI-Predicted Arrival Times</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#0a0e17', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                Intelligent Dispatch Flow
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div>1. 📍 <strong>Location</strong>: Driver GPS automatically detected</div>
                <div>2. 🧠 <strong>AI Diagnostic</strong>: Photo/symptoms classified by FastAPI ML</div>
                <div>3. 🔍 <strong>Haversine Proximity</strong>: Spring Boot identifies closest providers</div>
                <div>4. ⭐ <strong>Suitability Ranking</strong>: Best matched technician recommended</div>
                <div>5. 🗺️ <strong>Live Map</strong>: Interactive Leaflet route & real-time ETA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Quick Strip */}
      <section>
        <div className="glass-card" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>Need Direct Assistance or Support?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Our 24/7 highway dispatch team is ready to assist stranded vehicles across Telangana and nationwide.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                <Mail size={16} /> Contact Support
              </button>
            </Link>
            <a href="tel:6304886341" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                <Phone size={16} /> Call +91 6304886341
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
