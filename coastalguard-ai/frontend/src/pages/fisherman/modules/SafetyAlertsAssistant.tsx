import React, { useState } from 'react';
import {
  BotMessageSquare,
  Send,
  Languages,
  Sparkles,
  Info
} from 'lucide-react';
import { FishermanLayout } from '../../../components/layout/FishermanLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { mockAlerts } from '../../../data/mockData';
import type { SafetyAlert, Language, ChatMessage } from '../../../types';

export const SafetyAlertsAssistant: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ta');
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert>(mockAlerts[0]);

  // Demo AI Chat Conversation
  const initialChat: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'வணக்கம்! நான் உங்கள் CoastalGuard AI பாதுகாப்பு உதவியாளர். தற்போதைய கடல் வானிலை, புயல் எச்சரிக்கைகள் அல்லது அருகிலுள்ள பாதுகாப்பான துறைமுகங்கள் பற்றி என்னிடம் கேளுங்கள்.',
      textTamil: 'Hello! I am your CoastalGuard AI Marine Safety Assistant. Ask me about current weather, gale warnings, or nearest safe harbour shelters.',
      timestamp: 'Today, 07:00 AM',
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: 'இன்று இரவு மன்னார் வளைகுடாவில் நாட்டுப்படகில் மீன்பிடிக்க செல்லலாமா?',
      timestamp: 'Today, 07:02 AM',
    },
    {
      id: 'msg-3',
      sender: 'assistant',
      text: '🚨 வேண்டாம்! மன்னார் வளைகுடாவில் மணிக்கு 35 முதல் 40 கி.மீ வேகத்தில் பலத்த காற்று வீசக்கூடும் மற்றும் அலைகள் 3.5 மீட்டர் வரை உயரும் என எச்சரிக்கப்பட்டுள்ளது. நாட்டுப்படகுகள் கடலுக்குள் செல்லக் கூடாது என அறிவுறுத்தப்படுகிறது. படகுகளை இராமேஸ்வரம் அல்லது மண்டபம் துறைமுகத்தில் பாதுகாப்பாக நங்கூரமிடவும்.',
      textTamil: '🚨 Advising AGAINST departure! South-westerly winds gusting to 35-40 knots with wave heights exceeding 3.5 meters expected in Gulf of Mannar. Small craft operations must cease immediately. Anchor your craft inside Rameswaram or Mandapam harbour shelters.',
      timestamp: 'Today, 07:02 AM',
      suggestedAction: 'Rameswaram Harbour (VHF Channel 16 & 68)',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    {
      labelEn: 'Explain swell alert simply',
      labelTa: 'அலை எச்சரிக்கையை விளக்குக',
      question: selectedLanguage === 'ta' ? 'அலை எச்சரிக்கையை எளிய தமிழில் விளக்குக' : 'Please explain the current swell warning in simple words',
      reply: selectedLanguage === 'ta'
        ? 'தற்போதைய எச்சரிக்கை: கடலில் அலைகள் 3.5 மீட்டர் (சுமார் 11 அடி) வரை எழும். இந்த அலைகள் படகுகளை கவிழ்க்கும் வாய்ப்பு அதிகம். எனவே கரைக்குத் திரும்பி விழிப்புடன் இருங்கள்.'
        : 'Explanation: Ocean swells are running at 3.5 meters (nearly 11 feet high) with strong squall winds. These conditions can overturn wooden catamarans and small trawlers. Please remain in protected waters.',
    },
    {
      labelEn: 'Nearest safe harbour?',
      labelTa: 'அருகிலுள்ள பாதுகாப்பான துறைமுகம் எது?',
      question: selectedLanguage === 'ta' ? 'அருகிலுள்ள பாதுகாப்பான துறைமுகம் எது?' : 'Where is the closest safe harbour to take shelter?',
      reply: selectedLanguage === 'ta'
        ? 'மன்னார் வளைகுடா பகுதியில் இராமேஸ்வரம் மீன்பிடித் துறைமுகம் மற்றும் மண்டபம் முகத்துவாரம் பாதுகாப்பான தங்குமிடங்கள் ஆகும். VHF அலைவரிசை 16 அல்லது 68-ஐத் தொடர்பு கொள்ளவும்.'
        : 'Rameswaram Fishing Harbour and Mandapam Jetty offer immediate sheltered deep-water anchorages. Contact port authorities via VHF Radio Channel 16 / 68.',
    },
    {
      labelEn: 'When will weather clear?',
      labelTa: 'வானிலை எப்போது சீராகும்?',
      question: selectedLanguage === 'ta' ? 'வானிலை எப்போது சீராகும்?' : 'When is the weather expected to clear for fishing?',
      reply: selectedLanguage === 'ta'
        ? 'வானிலை மாதிரியின்படி, நாளை மாலை 6 மணி வரை பலத்த காற்று நீடிக்கும். அதற்குப் பிறகு காற்றின் வேகம் 15 நாட்ஸ் வரை குறையும் என கணிக்கப்பட்டுள்ளது.'
        : 'According to current wave models, squally conditions will persist until tomorrow evening (18:00 IST), after which winds are projected to moderate under 15 knots.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulated prototype AI response
    setTimeout(() => {
      const isTamilLang = selectedLanguage === 'ta';
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: isTamilLang
          ? `[மாதிரி பதில்]: உங்கள் கேள்விக்கு நன்றி ("${userMsg.text}"). தற்போதைய வானிலை எச்சரிக்கைகளின்படி, கடலோரப் பாதுகாப்பு வழிமுறைகளை பின்பற்றி பாதுகாப்பான துறைமுகங்களில் நங்கூரமிடுவது நல்லது. (முழு Gemini AI இணைப்பு விரைவில்).`
          : `[Demo AI Response]: Thank you for your inquiry regarding "${userMsg.text}". Current weather bulletins advise maintaining strict harbour watch and lifejacket compliance. (Live Gemini API integration pending).`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  const handleQuickPrompt = (prompt: { question: string; reply: string }) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: prompt.question,
      timestamp: 'Just now',
    };

    const aiMsg: ChatMessage = {
      id: `msg-ai-${Date.now() + 1}`,
      sender: 'assistant',
      text: prompt.reply,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const isTamil = selectedLanguage === 'ta';

  return (
    <FishermanLayout>
      <PageHeader
        title="Safety Alerts & AI Assistant"
        subtitle="Official meteorological danger warnings, plain-language explanations, and bilingual AI safety guidance."
        badge="Demonstration Assistant"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Languages size={18} color="var(--color-teal)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)' }}>
              Language:
            </span>
            <div style={{ display: 'inline-flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1.5px solid var(--color-teal)' }}>
              <button
                onClick={() => setSelectedLanguage('ta')}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: isTamil ? 'var(--color-teal)' : '#ffffff',
                  color: isTamil ? '#ffffff' : 'var(--color-navy-primary)',
                }}
              >
                தமிழ் (Tamil)
              </button>
              <button
                onClick={() => setSelectedLanguage('en')}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: !isTamil ? 'var(--color-teal)' : '#ffffff',
                  color: !isTamil ? '#ffffff' : 'var(--color-navy-primary)',
                }}
              >
                English
              </button>
            </div>
          </div>
        }
      />

      {/* Prototype Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: 'var(--space-6)',
          fontSize: '0.85rem',
          color: '#1e40af',
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>Static Simulation Notice:</strong> The conversational assistant responses below are predefined demonstration exchanges. Gemini API and live LLM inference will be integrated in future development.
        </div>
      </div>

      {/* Two Column Grid: Official Bulletins & AI Chat */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Left Column: Official Warnings List & Selected Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="card-base" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: 'var(--space-3)' }}>
              {isTamil ? 'அதிகாரப்பூர்வ கடல் எச்சரிக்கைகள்' : 'Official Marine Bulletins'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {mockAlerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: selectedAlert.id === alert.id ? 'var(--color-teal)' : 'var(--color-border-light)',
                    backgroundColor: selectedAlert.id === alert.id ? 'var(--color-teal-soft)' : 'var(--color-surface-white)',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <StatusBadge status={alert.severity} size="sm" />
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {alert.issuedAt}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                    {isTamil && alert.titleTamil ? alert.titleTamil : alert.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {alert.coastalRegion} • {alert.bulletinId}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Warning Breakdown Panel */}
          <div className="card-base" style={{ padding: 'var(--space-5)', borderTop: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                {isTamil ? 'தேர்ந்தெடுக்கப்பட்ட அறிவிப்பு' : 'Selected Bulletin Directive'}
              </span>
              <StatusBadge status={selectedAlert.severity} size="sm" />
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy-primary)', marginBottom: '0.4rem' }}>
              {isTamil && selectedAlert.titleTamil ? selectedAlert.titleTamil : selectedAlert.title}
            </h4>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
              {isTamil && selectedAlert.messageTamil ? selectedAlert.messageTamil : selectedAlert.message}
            </p>

            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c2410c', marginBottom: '2px' }}>
                {isTamil ? 'பரிந்துரைக்கப்பட்ட நடவடிக்கை:' : 'Recommended Action:'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9a3412', fontWeight: 600 }}>
                {isTamil && selectedAlert.recommendedActionTamil ? selectedAlert.recommendedActionTamil : selectedAlert.recommendedAction}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Chat Interface */}
        <div
          className="card-base"
          style={{
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '680px',
          }}
        >
          {/* Chat Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-teal)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BotMessageSquare size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                  {isTamil ? 'பாதுகாப்பு AI உதவியாளர்' : 'Safety AI Assistant'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
                  {isTamil ? 'ஆலோசனைக்கு தயார் (Prototype)' : 'Ready for Guidance (Prototype)'}
                </span>
              </div>
            </div>

            <span className="badge-prototype">
              <Sparkles size={11} /> Demonstration Mode
            </span>
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 'var(--space-4) 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAssistant ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: isAssistant
                        ? 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-xs)'
                        : 'var(--radius-lg) var(--radius-lg) var(--radius-xs) var(--radius-lg)',
                      backgroundColor: isAssistant ? 'var(--color-bg-alt)' : 'var(--color-teal)',
                      color: isAssistant ? 'var(--color-navy-primary)' : '#ffffff',
                      border: isAssistant ? '1px solid var(--color-border-light)' : 'none',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    {msg.text}
                  </div>

                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px', padding: '0 4px' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Prompts Suggestions */}
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
              {isTamil ? 'விரைவு கேள்விகள் (Quick Prompts):' : 'Suggested Questions:'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPrompt(p)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-ocean-soft)',
                    color: 'var(--color-ocean-blue)',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    cursor: 'pointer',
                  }}
                >
                  {isTamil ? p.labelTa : p.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              borderTop: '1px solid var(--color-border-light)',
              paddingTop: 'var(--space-3)',
            }}
          >
            <input
              type="text"
              placeholder={isTamil ? 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...' : 'Ask about wind, swell, or fishing safety...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border-subtle)',
                fontSize: '0.9rem',
              }}
            />
            <button
              type="submit"
              className="btn btn-accent"
              style={{ padding: '0.7rem 1.25rem' }}
            >
              <Send size={18} />
              <span>{isTamil ? 'அனுப்புக' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>
    </FishermanLayout>
  );
};
