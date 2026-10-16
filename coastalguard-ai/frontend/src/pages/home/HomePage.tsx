import React from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  AlertTriangle,
  BotMessageSquare,
  Anchor,
  ShieldCheck,
  Radio,
  ArrowRight,
  Waves,
  Phone,
  Compass,
  CheckCircle2,
  Users,
  LifeBuoy
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const features = [
    {
      id: 'marine-weather',
      title: 'Marine Weather & Conditions',
      description:
        'Understand marine conditions, weather trends, wind, waves, and forecasts with sector-wise telemetry.',
      image: '/images/feature-marine-weather.jpg',
      icon: <CloudSun size={24} />,
      badge: 'Wave & Swell Intel',
    },
    {
      id: 'boat-coastal',
      title: 'Boat & Coastal Monitoring',
      description:
        'View available boat location reports, regional information, and nearby ports and harbours with emergency radio channels.',
      image: '/images/feature-harbour-monitoring.jpg',
      icon: <Radio size={24} />,
      badge: 'Harbour Navigation',
    },
    {
      id: 'risk-alerts',
      title: 'Risk Awareness & Safety Alerts',
      description:
        'Review marine risk levels, important warnings, and safety announcements categorized from Low to Extreme.',
      image: '/images/feature-storm-risk.jpg',
      icon: <AlertTriangle size={24} />,
      badge: 'Danger Categorization',
    },
    {
      id: 'ai-assistant',
      title: 'AI-Powered Safety Assistance',
      description:
        'Understand safety information through a conversational assistant designed to explain warnings clearly in English and Tamil.',
      image: '/images/feature-fisherman-safety.jpg',
      icon: <BotMessageSquare size={24} />,
      badge: 'Bilingual AI Support',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* 1. Hero Section with Real Photograph Background */}
      <section className={styles.heroSection} id="hero">
        <div className={styles.heroOverlayGlow} />

        <div className={styles.heroContent}>
          {/* Badge */}
          <div className={styles.heroBadge}>
            <Waves size={16} />
            <span>Next-Generation Marine Safety Intelligence</span>
          </div>

          {/* Heading */}
          <h1 className={styles.heroHeadline}>
            Safer Seas. <span className={styles.heroHighlight}>Smarter Decisions.</span>
          </h1>

          {/* Supporting Text */}
          <p className={styles.heroSupportingText}>
            CoastalGuard AI empowers fishermen and marine administrators with marine condition monitoring, regional risk awareness, safety alerts, and intelligent assistance for safer coastal operations.
          </p>

          {/* Dual Action Buttons */}
          <div className={styles.heroButtonGroup}>
            <Link
              to="/fisherman/login"
              className={styles.heroBtnFisherman}
            >
              <Anchor size={20} />
              <span>Fisherman Login</span>
            </Link>

            <Link
              to="/admin/login"
              className={styles.heroBtnAdmin}
            >
              <ShieldCheck size={20} />
              <span>Admin Login</span>
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className={styles.metricsStrip}>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>5 Sectors</div>
              <div className={styles.metricLabel}>Coastal Regions Monitored</div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>24 / 7</div>
              <div className={styles.metricLabel}>Marine Telemetry Updates</div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>EN • TA</div>
              <div className={styles.metricLabel}>Bilingual Advisory Support</div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>VHF 16</div>
              <div className={styles.metricLabel}>Distress Channel Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className={styles.featureSection} id="features">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionCategory}>Comprehensive Capabilities</span>
          <h2 className={styles.sectionTitle}>
            Everything You Need for Safer Coastal Operations
          </h2>
          <p className={styles.sectionSubtitle}>
            Engineered to bridge meteorological telemetry, coastal authority oversight, and artisanal fishing community safety into an accessible, real-time command structure.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <div key={feature.id} className={styles.featureCard}>
              <div className={styles.cardImageWrapper}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className={styles.cardImage}
                  onError={(e) => {
                    // Graceful fallback to dark ocean gradient if local asset path is interrupted
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className={styles.cardImageOverlay} />
                <span className={styles.cardBadge}>{feature.badge}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardIconHeader}>
                  {feature.icon}
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className={styles.howSection} id="how-it-works">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionCategory}>Operational Workflow</span>
          <h2 className={styles.sectionTitle}>How CoastalGuard AI Works</h2>
          <p className={styles.sectionSubtitle}>
            A streamlined three-step process connecting coastal communities with timely maritime intelligence.
          </p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>01</div>
            <div style={{ color: 'var(--color-ocean-blue)', marginBottom: '0.5rem' }}>
              <Compass size={28} />
            </div>
            <h3 className={styles.stepTitle}>Choose Your Portal</h3>
            <p className={styles.stepText}>
              Select either the <strong>Fisherman Login</strong> for day-to-day sea voyage assistance or the <strong>Admin Login</strong> for maritime command and sector-wide coordination.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>02</div>
            <div style={{ color: 'var(--color-teal)', marginBottom: '0.5rem' }}>
              <Radio size={28} />
            </div>
            <h3 className={styles.stepTitle}>Explore Marine Information</h3>
            <p className={styles.stepText}>
              Access real-time sector telemetry, inspect wave height and swell trends, check emergency harbour shelter capacities, and view coastal navigational maps.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>03</div>
            <div style={{ color: 'var(--color-ocean-blue)', marginBottom: '0.5rem' }}>
              <LifeBuoy size={28} />
            </div>
            <h3 className={styles.stepTitle}>Stay Informed</h3>
            <p className={styles.stepText}>
              Review officially broadcasted risk levels (Low to Extreme), get immediate returning-to-harbour advisories, and use the bilingual AI assistant to understand complex forecasts.
            </p>
          </div>
        </div>
      </section>

      {/* 4. About Section ("Technology with a Purpose") */}
      <section className={styles.aboutSection} id="about">
        <div className={styles.aboutContainer}>
          <div>
            <span className={styles.sectionCategory}>Our Mission</span>
            <h2 className={styles.aboutContentHeading}>
              Technology with a Purpose
            </h2>
            <p className={styles.aboutBodyText}>
              CoastalGuard AI is a marine safety assistance platform designed to bring coastal information, risk awareness, and safety communication together in one place. By making marine information easier to understand and access, the platform aims to support informed decisions for fishermen and marine administrators.
            </p>

            <div className={styles.aboutPillars}>
              <div className={styles.pillarItem}>
                <div className={styles.pillarIcon}>
                  <Users size={20} />
                </div>
                <div>
                  <h4 className={styles.pillarTitle}>Fishing Community Focused</h4>
                  <p className={styles.pillarDesc}>
                    Designed with high-contrast, accessible layouts for fishermen operating small motorized and non-motorized crafts under bright sea glare.
                  </p>
                </div>
              </div>

              <div className={styles.pillarItem}>
                <div className={styles.pillarIcon}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className={styles.pillarTitle}>Language Inclusive AI Assistance</h4>
                  <p className={styles.pillarDesc}>
                    Translates technical barometric pressure, knot velocities, and wave period meters into plain Tamil and English actionable guidance.
                  </p>
                </div>
              </div>

              <div className={styles.pillarItem}>
                <div className={styles.pillarIcon}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className={styles.pillarTitle}>Preventive Risk Management</h4>
                  <p className={styles.pillarDesc}>
                    Enables maritime authorities to issue immediate localized advisories and monitor fleet dispersal before cyclonic surges make sea conditions perilous.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.aboutImageContainer}>
            <img
              src="/images/about-coastal-purpose.jpg"
              alt="Coastal patrol vessel near lighthouse"
              className={styles.aboutImage}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className={styles.aboutBadgeOverlay}>
              <ShieldCheck size={28} color="#38bdf8" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Coastal Guard Maritime Support</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Protecting coastal lives along the Coromandel coastline</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact & Assistance Section */}
      <section className={styles.contactSection} id="contact">
        <div className={styles.sectionHeader} style={{ marginBottom: 'var(--space-8)' }}>
          <span className={styles.sectionCategory}>Emergency Help & Channels</span>
          <h2 className={styles.sectionTitle}>Coastal Assistance & Contact</h2>
          <p className={styles.sectionSubtitle}>
            Official emergency monitoring frequencies and maritime authority helplines.
          </p>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <div className={styles.contactIconCircle}>
              <Radio size={24} />
            </div>
            <h4 className={styles.contactCardTitle}>VHF Marine Distress</h4>
            <div className={styles.contactCardValue}>Channel 16</div>
            <div className={styles.contactCardSub}>156.800 MHz International Calling</div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIconCircle} style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--color-teal)' }}>
              <Phone size={24} />
            </div>
            <h4 className={styles.contactCardTitle}>Coast Guard Toll-Free</h4>
            <div className={styles.contactCardValue} style={{ color: 'var(--color-teal)' }}>1554</div>
            <div className={styles.contactCardSub}>24x7 Search & Rescue Coordination</div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIconCircle}>
              <ShieldCheck size={24} />
            </div>
            <h4 className={styles.contactCardTitle}>Disaster Management</h4>
            <div className={styles.contactCardValue}>1077</div>
            <div className={styles.contactCardSub}>District Coastal Emergency Operations</div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIconCircle} style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--color-teal)' }}>
              <LifeBuoy size={24} />
            </div>
            <h4 className={styles.contactCardTitle}>INCOIS Ocean Forecast</h4>
            <div className={styles.contactCardValue} style={{ color: 'var(--color-teal)' }}>040-23895000</div>
            <div className={styles.contactCardSub}>Marine Meteorological Telemetry Center</div>
          </div>
        </div>
      </section>

      {/* 6. Final Call-to-Action Section */}
      <section className={styles.finalCtaSection} id="choose-portal">
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            Your Next Step Toward Safer Seas
          </h2>
          <p className={styles.ctaSupporting}>
            Access the information and tools designed for your role in coastal safety.
          </p>

          <div className={styles.ctaButtons}>
            <Link
              to="/fisherman/login"
              className={styles.heroBtnFisherman}
            >
              <Anchor size={20} />
              <span>Fisherman Login</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/admin/login"
              className={styles.heroBtnAdmin}
            >
              <ShieldCheck size={20} />
              <span>Admin Login</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
