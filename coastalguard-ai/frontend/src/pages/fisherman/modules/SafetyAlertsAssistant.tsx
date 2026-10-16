import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  Info,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { FishermanLayout } from '../../../components/layout/FishermanLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { LanguageSelector } from '../../../components/common/LanguageSelector';
import { mockAlerts } from '../../../data/mockData';
import { useLanguage } from '../../../i18n/LanguageContext';
import { sendChatMessage } from '../../../services/chatService';
import { ApiError } from '../../../services/api';
import type { SafetyAlert, ChatMessage } from '../../../types';

export const SafetyAlertsAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert>(mockAlerts[0]);
  const isTamil = language === 'ta';

  // Initial welcome message
  const initialChat: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'assistant',
      text: isTamil
        ? 'வணக்கம்! நான் உங்கள் CoastalGuard AI பாதுகாப்பு உதவியாளர். தற்போதைய கடல் வானிலை, புயல் எச்சரிக்கைகள் அல்லது அருகிலுள்ள பாதுகாப்பான துறைமுகங்கள் பற்றி என்னிடம் கேளுங்கள்.'
        : 'Hello! I am your CoastalGuard AI Marine Safety Assistant. Ask me about current weather, gale warnings, or nearest safe harbour shelters.',
      timestamp: 'Today, 07:00 AM',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ text: string; action?: string } | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when new messages arrive or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, errorMessage]);

  const quickPrompts = [
    {
      label: isTamil ? 'அலை எச்சரிக்கையை விளக்குக' : 'Explain swell alert simply',
      question: isTamil
        ? 'தற்போதைய கடல் அலை எச்சரிக்கையை எளிய தமிழில் விளக்குக.'
        : 'Please explain the current swell warning in simple words.',
    },
    {
      label: isTamil ? 'அருகிலுள்ள பாதுகாப்பான துறைமுகம் எது?' : 'Nearest safe harbour?',
      question: isTamil
        ? 'அருகிலுள்ள பாதுகாப்பான துறைமுகம் எது? அவசர உதவிக்கு யாரைத் தொடர்பு கொள்ள வேண்டும்?'
        : 'Where is the closest safe harbour to take shelter, and who should I contact for emergency help?',
    },
    {
      label: isTamil ? 'வானிலை எப்போது சீராகும்?' : 'When will weather clear?',
      question: isTamil
        ? 'மீன்பிடிக்க கடலுக்குச் செல்ல வானிலை எப்போது சீராகும்?'
        : 'When is the weather expected to clear for fishing operations?',
    },
  ];

  const executeChatQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);
    setLastQuery(trimmed);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build context from currently selected official bulletin
      const context = selectedAlert
        ? `Official Bulletin ${selectedAlert.bulletinId} for ${selectedAlert.coastalRegion}: ${isTamil && selectedAlert.titleTamil ? selectedAlert.titleTamil : selectedAlert.title}. Severity: ${selectedAlert.severity}. Recommended Action: ${isTamil && selectedAlert.recommendedActionTamil ? selectedAlert.recommendedActionTamil : selectedAlert.recommendedAction}`
        : undefined;

      const response = await sendChatMessage(trimmed, language, context);

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setActiveModel(response.model);
    } catch (err) {
      console.error('Chat error:', err);
      let errText = isTamil
        ? 'AI சேவையுடன் தொடர்பு கொள்ள முடியவில்லை.'
        : 'Unable to connect to the CoastalGuard AI assistant.';
      let actionText: string | undefined = undefined;

      if (err instanceof ApiError) {
        errText = err.message;
        actionText = err.suggestedAction;
      } else if (err instanceof Error) {
        errText = err.message;
      }

      setErrorMessage({ text: errText, action: actionText });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const textToSend = inputText;
    setInputText('');
    executeChatQuery(textToSend);
  };

  const handleQuickPrompt = (question: string) => {
    if (isLoading) return;
    executeChatQuery(question);
  };

  return (
    <FishermanLayout>
      <PageHeader
        title={t('fisherman.assistantTitle')}
        subtitle={t('fisherman.assistantSubtitle')}
        badge={t('common.demoBadge')}
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <LanguageSelector />
          </div>
        }
      />

      {/* Live Gemini AI Integration Notice */}
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
          <strong>{isTamil ? 'நேரடி Google Gemini AI ஒருங்கிணைப்பு:' : 'Live Google Gemini AI Integration:'}</strong>{' '}
          {isTamil
            ? 'இந்த உதவியாளர் FastAPI பின்தளம் வழியாக அதிகாரப்பூர்வ Google Gemini மாடலுடன் இணைக்கப்பட்டுள்ளது. உங்கள் கேள்விகளுக்கு நேரடி AI விளக்கம் அளிக்கப்படுகிறது.'
            : 'This assistant is connected to Google Gemini via the FastAPI backend. User queries receive real-time explanations grounded in official coastal safety guidelines.'}
        </div>
      </div>

      {/* Two Column Grid: Official Bulletins & AI Chat */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Left Column: Official Warnings List & Selected Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="card-base" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: 'var(--space-3)' }}>
              {t('fisherman.officialBulletins')}
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
                    cursor: 'pointer',
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
                  {t('fisherman.chatHeader')}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
                  {activeModel
                    ? `Gemini (${activeModel})`
                    : (isTamil ? 'Gemini AI பாதுகாப்பு வழிகாட்டி' : 'Gemini AI Assistant Ready')}
                </span>
              </div>
            </div>

            <span className="badge-prototype">
              <Sparkles size={11} /> {activeModel || 'Gemini AI'}
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
                      whiteSpace: 'pre-wrap',
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

            {/* Loading Indicator while Gemini is thinking */}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-xs)',
                  backgroundColor: 'var(--color-bg-alt)',
                  border: '1px solid var(--color-border-light)',
                  width: 'fit-content',
                  color: 'var(--color-navy-primary)',
                  fontSize: '0.85rem',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-teal)' }} />
                <span>
                  {isTamil
                    ? 'பாதுகாப்பு உதவியாளர் பதிலளிக்கிறார்...'
                    : 'CoastalGuard AI is generating response...'}
                </span>
              </div>
            )}

            {/* Error Banner with Retry Button */}
            {errorMessage && (
              <div
                style={{
                  margin: 'var(--space-2) 0',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991b1b', fontWeight: 700, fontSize: '0.85rem' }}>
                    <AlertTriangle size={16} />
                    <span>{isTamil ? 'AI சேவை பிழை' : 'AI Assistant Notice'}</span>
                  </div>
                  {lastQuery && (
                    <button
                      type="button"
                      onClick={() => executeChatQuery(lastQuery)}
                      disabled={isLoading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#991b1b',
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fca5a5',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      <RotateCcw size={13} /> {isTamil ? 'மீண்டும் முயற்சி' : 'Retry'}
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#7f1d1d' }}>
                  {errorMessage.text}
                </div>
                {errorMessage.action && (
                  <div style={{ fontSize: '0.75rem', color: '#991b1b', fontStyle: 'italic', backgroundColor: '#ffffff', padding: '0.35rem 0.6rem', borderRadius: '4px', border: '1px solid #fee2e2' }}>
                    💡 {errorMessage.action}
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
              {t('fisherman.quickQuestions')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickPrompt(p.question)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-ocean-soft)',
                    color: 'var(--color-ocean-blue)',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {p.label}
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
              placeholder={isLoading ? (isTamil ? 'பதில் பெறப்படுகிறது...' : 'Generating response...') : t('fisherman.inputPlaceholder')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border-subtle)',
                fontSize: '0.9rem',
                backgroundColor: isLoading ? 'var(--color-bg-alt)' : '#ffffff',
                cursor: isLoading ? 'not-allowed' : 'text',
              }}
            />
            <button
              type="submit"
              className="btn btn-accent"
              disabled={isLoading || !inputText.trim()}
              style={{
                padding: '0.7rem 1.25rem',
                opacity: isLoading || !inputText.trim() ? 0.6 : 1,
                cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              <span>{t('fisherman.send')}</span>
            </button>
          </form>
        </div>
      </div>
    </FishermanLayout>
  );
};
export default SafetyAlertsAssistant;
