import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wind,
  Waves,
  Eye,
  Clock,
  AlertTriangle,
  MapPin,
  BotMessageSquare,
  Anchor,
  ArrowRight
} from 'lucide-react';
import { FishermanLayout } from '../../components/layout/FishermanLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockMarineConditions, mockHarbours } from '../../data/mockData';
import styles from './FishermanDashboard.module.css';

export const FishermanDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSectorKey, setSelectedSectorKey] = useState('gulf-of-mannar');

  const condition =
    mockMarineConditions[selectedSectorKey] || mockMarineConditions['gulf-of-mannar'];

  return (
    <FishermanLayout>
      <PageHeader
        title="Welcome, Fisherman (வணக்கம் மீனவரே)"
        subtitle="Live safety cockpit, immediate wave conditions, emergency harbour waypoints, and bilingual advisories."
        badge="Demonstration Mode"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)' }}>
              Coastal Sector:
            </span>
            <select
              value={selectedSectorKey}
              onChange={(e) => setSelectedSectorKey(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-teal)',
                backgroundColor: 'var(--color-surface-white)',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'var(--color-navy-primary)',
              }}
            >
              <option value="gulf-of-mannar">Gulf of Mannar (Rameswaram)</option>
              <option value="palk-strait">Palk Strait / Mandapam</option>
              <option value="chennai-coromandel">Kasimedu (Chennai Coast)</option>
              <option value="kanyakumari-cape">Kanyakumari & Cape Sea</option>
              <option value="nagapattinam-delta">Nagapattinam Delta</option>
            </select>
          </div>
        }
      />

      {/* Prominent Safety Status Panel */}
      <div className={styles.safetyAlertBanner}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e' }}>
                Safety Status: Caution in {condition.regionName}
              </span>
              <StatusBadge status={condition.riskLevel} size="sm" />
            </div>
            <p style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: 1.5, maxWidth: '800px' }}>
              <strong>Advisory:</strong> {condition.forecastSummary}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '0.25rem', fontStyle: 'italic' }}>
              தமிழ் வழிகாட்டுதல்: பலத்த காற்று மற்றும் அலை வீசுவதால் ஆழ்கடலுக்கு செல்வதை தவிர்க்கவும்.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Link to="/fisherman/safety-assistant" className="btn btn-accent btn-sm">
            <BotMessageSquare size={16} />
            <span>Ask AI Assistant</span>
          </Link>
          <Link to="/fisherman/marine-map" className="btn btn-outline btn-sm">
            <MapPin size={16} />
            <span>Open Coastal Map</span>
          </Link>
        </div>
      </div>

      {/* 4 Marine Conditions Summary Cards */}
      <div className={styles.dashboardGrid}>
        <StatCard
          title="Surface Wind Speed"
          value={condition.windSpeedKnots}
          unit="knots"
          subtitle={`Direction: ${condition.windDirection}`}
          icon={<Wind size={22} />}
          accentColor="var(--color-ocean-blue)"
          trend={{ value: 'Sample sync', isPositive: true }}
          onClick={() => navigate('/fisherman/marine-map')}
        />

        <StatCard
          title="Significant Wave Height"
          value={condition.waveHeightMeters}
          unit="meters"
          subtitle={condition.waveHeightMeters > 3 ? 'Rough seas (கொந்தளிப்பு)' : 'Moderate swell (மிதமான அலை)'}
          icon={<Waves size={22} />}
          accentColor={condition.waveHeightMeters > 3 ? 'var(--color-danger)' : 'var(--color-teal)'}
          onClick={() => navigate('/fisherman/marine-map')}
        />

        <StatCard
          title="Swell Period & Tide"
          value={condition.swellPeriodSeconds}
          unit="seconds"
          subtitle="Tide: Flood Tide (+0.8m)"
          icon={<Clock size={22} />}
          accentColor="var(--color-navy-primary)"
        />

        <StatCard
          title="Atmospheric Visibility"
          value={condition.visibilityKm}
          unit="km"
          subtitle="Daylight clear navigation"
          icon={<Eye size={22} />}
          accentColor="#0284c7"
        />
      </div>

      {/* Two Column Layout */}
      <div className={styles.twoColumnGrid}>
        {/* Nearby Harbours & Safe Haven Shelters */}
        <div className="card-base" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                Nearby Harbours & Emergency Shelters
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Emergency berthing, radio call signs, and entry clearances
              </p>
            </div>
            <Link to="/fisherman/marine-map" className="btn btn-outline btn-sm">
              <span>View On Map</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.portsList}>
            {mockHarbours.slice(0, 3).map((port) => (
              <div key={port.id} className={styles.portCardItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-ocean-soft)',
                      color: 'var(--color-ocean-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Anchor size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                      {port.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                      {port.tamilName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Radio: {port.vhfEmergencyChannel} • Depth: {port.depthMeters}m
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={port.status} size="sm" />
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Cap: {port.shelterCapacityBoats} craft
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Navigation & AI Teaser */}
        <div className="card-base" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2)' }}>
              <BotMessageSquare size={22} color="var(--color-teal)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                AI Safety Assistant Demo
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              Have questions about weather conditions or fishing bans? Ask in plain English or Tamil.
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-teal)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Sample Question (கேள்வி):
              </div>
              <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--color-navy-primary)', marginBottom: '8px' }}>
                "Can I venture out for tuna fishing from Rameswaram tonight?"
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', borderTop: '1px dashed var(--color-border-subtle)', paddingTop: '6px' }}>
                <strong>AI Answer:</strong> Strong 28kt winds in Gulf of Mannar with 3.2m swells. Small craft operations advised to stay moored.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Link to="/fisherman/safety-assistant" className="btn btn-accent" style={{ justifyContent: 'center' }}>
              <BotMessageSquare size={16} />
              <span>Launch AI Safety Assistant</span>
            </Link>
            <Link to="/fisherman/marine-map" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <MapPin size={16} />
              <span>Full Marine & Harbour Map</span>
            </Link>
          </div>
        </div>
      </div>
    </FishermanLayout>
  );
};
