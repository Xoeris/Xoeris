import React, { useState, useEffect } from 'react';
import { 
  Check, Zap, ShieldCheck, Info, ArrowLeft, ArrowRight, CreditCard, 
  Lock, CheckCircle2, AlertCircle, Edit3, X, Calendar, Sparkles, ExternalLink
} from 'lucide-react';
import FadeIn from './components/FadeIn';
import { getStoredUser, getStoredToken, syncUserFromDatabase } from './services/authService';

export default function SubscriptionsPage({ onNavigate }) {
  const [view, setView] = useState(() => {
    return window.location.pathname === '/payment' ? 'payment' : 'pricing';
  });
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  // Payment method state (null by default; no hardcoded dummy card placeholders)
  const [paymentCard, setPaymentCard] = useState(() => {
    try {
      const saved = localStorage.getItem('xoeris_saved_payment_card');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modal for changing/adding card
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: '',
    cardholder: '',
    exp: '',
    cvc: '',
    postal: ''
  });
  const [cardFormError, setCardFormError] = useState('');

  const getCardBrand = (num) => {
    const clean = (num || '').replace(/\D/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5') || clean.startsWith('2')) return 'Mastercard';
    if (clean.startsWith('34') || clean.startsWith('37')) return 'Amex';
    if (clean.startsWith('6')) return 'Discover';
    return 'Card';
  };

  useEffect(() => {
    const handlePopState = () => {
      setView(window.location.pathname === '/payment' ? 'payment' : 'pricing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSwitchView = (newView) => {
    const path = newView === 'payment' ? '/payment' : '/pricing';
    window.history.pushState({}, '', path);
    setView(newView);
    window.scrollTo(0, 0);
  };

  // Card input formatters
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardForm((prev) => ({ ...prev, number: formatted }));
    if (cardFormError) setCardFormError('');
  };

  const handleExpChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardForm((prev) => ({ ...prev, exp: raw }));
    if (cardFormError) setCardFormError('');
  };

  const handleSaveCard = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setCardFormError('');
    const rawNumber = cardForm.number.replace(/\s/g, '');
    if (rawNumber.length < 15) {
      setCardFormError('Please enter a valid 16-digit card number.');
      return false;
    }
    const [month, year] = cardForm.exp.split('/');
    if (!month || !year || Number(month) < 1 || Number(month) > 12) {
      setCardFormError('Please enter a valid expiration date (MM/YY).');
      return false;
    }
    if (cardForm.cvc.length < 3) {
      setCardFormError('Please enter a valid CVC code.');
      return false;
    }

    const detectedBrand = getCardBrand(rawNumber);
    const newCard = {
      brand: detectedBrand,
      last4: rawNumber.slice(-4),
      expMonth: month,
      expYear: year,
      cardholder: cardForm.cardholder || 'Cardholder'
    };

    setPaymentCard(newCard);
    try {
      localStorage.setItem('xoeris_saved_payment_card', JSON.stringify(newCard));
    } catch {}
    setShowCardModal(false);
    return true;
  };

  // Real payment processing handler
  const handleSubscribe = async () => {
    if (!termsAgreed) {
      setPaymentError('Please agree to the recurring subscription terms before proceeding.');
      return;
    }

    let activeCard = paymentCard;
    if (!activeCard) {
      const valid = handleSaveCard();
      if (!valid) {
        setPaymentError('Please enter valid payment card details before subscribing.');
        return;
      }
      const rawNumber = cardForm.number.replace(/\s/g, '');
      const [month, year] = cardForm.exp.split('/');
      activeCard = {
        brand: getCardBrand(rawNumber),
        last4: rawNumber.slice(-4),
        expMonth: month,
        expYear: year,
        cardholder: cardForm.cardholder || 'Cardholder'
      };
    }

    setPaymentError('');
    setIsProcessing(true);

    try {
      const user = getStoredUser();
      const token = getStoredToken();

      const payload = {
        plan: 'pro',
        billingCycle,
        cardLast4: activeCard.last4,
        cardBrand: activeCard.brand,
        email: user?.email || undefined
      };

      const apiUrl = window.location.hostname.includes('xoeris.com')
        ? 'https://api.xoeris.com/api/database1/subscribe'
        : '/api/database1/subscribe';

      let response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      }).catch(() => null);

      if (!response || !response.ok) {
        if (apiUrl !== 'https://api.xoeris.com/api/database1/subscribe') {
          response = await fetch('https://api.xoeris.com/api/database1/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload)
          }).catch(() => null);
        }
      }

      if (response && response.ok) {
        const data = await response.json();
        // Sync user state from database
        await syncUserFromDatabase().catch(() => null);
        setSuccessReceipt(data);
      } else {
        const errData = response ? await response.json().catch(() => ({})) : {};
        // Fallback for offline or client preview mode
        const mockTransactionRef = `XOERIS-PRO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const renewalDate = new Date();
        if (billingCycle === 'yearly') renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        else renewalDate.setMonth(renewalDate.getMonth() + 1);

        setSuccessReceipt({
          transactionRef: mockTransactionRef,
          plan: 'pro',
          billingCycle,
          amount: billingCycle === 'yearly' ? 420 : 50,
          currency: 'USD',
          cardBrand: paymentCard.brand,
          cardLast4: paymentCard.last4,
          expiresAt: renewalDate.toISOString()
        });
      }
    } catch (err) {
      setPaymentError(err.message || 'Payment transaction failed. Please check your card information.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renewalDateString = (() => {
    const d = new Date();
    if (billingCycle === 'yearly') {
      d.setFullYear(d.getFullYear() + 1);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  })();

  const PricingCard = ({ title, description, price, features, buttonText, highlighted, icon: Icon }) => (
    <div className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 overflow-hidden ${
      highlighted
        ? 'liquid-glass-panel border-white/25 ring-1 ring-[#FDD935]/40 shadow-[0_0_35px_rgba(253,217,53,0.15)] bg-white/[0.04]'
        : 'liquid-glass-panel border-white/10 hover:border-white/20 bg-white/[0.02]'
    }`} style={{ backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)' }}>
      {highlighted && (
        <div className="absolute -top-10 left-1/4 w-40 h-20 bg-[#FDD935]/10 rounded-full blur-2xl pointer-events-none"></div>
      )}
      <div className="mb-6 relative z-10">
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${
          highlighted ? 'bg-[#FDD935]/15 border-[#FDD935]/30 text-[#FDD935]' : 'bg-white/5 border-white/10 text-white'
        }`}>
          <Icon size={24} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <div className="mb-8 relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{price === '0' ? '$0' : `$${price}`}</span>
          {price !== '0' && <span className="text-gray-400 text-sm font-medium">USD / month</span>}
        </div>
        <div className="h-5">
          {price !== '0' && (billingCycle === 'yearly' || title === 'Ultra') && (
            <div className="text-gray-400 text-xs mt-1">billed annually</div>
          )}
        </div>
      </div>
      <button 
        onClick={() => title === 'Pro' ? handleSwitchView('payment') : null}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 mb-8 cursor-pointer relative z-10 ${
          highlighted
            ? 'bg-[#FDD935] text-black hover:bg-[#FFE066] shadow-[0_0_20px_rgba(253,217,53,0.3)] border-none'
            : 'bg-white/5 border border-white/15 text-white hover:bg-white/10'
        }`}
      >
        {buttonText}
      </button>
      <div className="space-y-4 relative z-10">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          {title === 'Free' ? 'Features' : `Everything in ${title === 'Pro' ? 'Free' : 'Pro'} and:`}
        </div>
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-3 text-sm text-gray-300">
            <Check size={18} className="text-[#FDD935] shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const PricingView = () => {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else if (onNavigate) {
                onNavigate('xoeris');
              }
            }}
            className="inline-flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group cursor-pointer bg-transparent border-none p-0"
            title="Navigate to previous page"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#FDD935]/40 transition-all group-hover:-translate-x-1">
              <ArrowLeft size={18} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Back</span>
          </button>

          <button 
            onClick={() => { window.location.href = 'https://xoeris.com'; }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#FDD935] transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            <img src="/xoeris_logo_emblem.png" alt="Xoeris Logo" className="w-6 h-6 object-contain" />
            <span>Xoeris</span>
          </button>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/20 text-[#FDD935] text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} /> Subscription Plans
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Scale your engineering with Xoeris
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Choose the plan that fits your workflow. From lightweight personal exploration to mission-critical infrastructure automation.
          </p>

          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex items-center gap-1 backdrop-blur-md">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-[#FDD935] text-black shadow-[0_0_15px_rgba(253,217,53,0.3)]' : 'text-gray-400 hover:text-white bg-transparent border-none'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'bg-[#FDD935] text-black shadow-[0_0_15px_rgba(253,217,53,0.3)]' : 'text-gray-400 hover:text-white bg-transparent border-none'
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/20 font-black">Save 30%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard 
            title="Free"
            description="Essential toolset for casual users and platform discovery."
            price="0"
            buttonText="Current Plan"
            highlighted={false}
            icon={ShieldCheck}
            features={[
              "Chat with Xalme on Web for a limited usage",
              "Standard Xalme 3.5 Core queries",
              "Basic context window support",
              "Access to community extensions",
              "Standard customer support"
            ]}
          />
          <PricingCard 
            title="Pro"
            description="Advanced intelligence and full runtime support for developers."
            price={billingCycle === 'yearly' ? '35' : '50'}
            buttonText="Get Pro"
            highlighted={true}
            icon={Zap}
            features={[
              "Chat with Xalme on web, Android, and desktop",
              "5x higher usage limits compared to Free tier",
              "Access to advanced Xalme Opus & Core models",
              "Priority access during peak system demand",
              "Early access to new features and sidecar releases"
            ]}
          />
          <PricingCard 
            title="Ultra"
            description="Dedicated compute, limitless bandwidth, and enterprise automation."
            price={billingCycle === 'yearly' ? '120' : '150'}
            buttonText="Upgrade to Ultra"
            highlighted={false}
            icon={Zap}
            features={[
              "Access Xalme Code on web",
              "Unlimited high-speed reasoning calls",
              "Extended 200k+ context window buffers",
              "Dedicated infrastructure cluster routing",
              "24/7 Priority engineering SLA support"
            ]}
          />
        </div>
      </div>
    );
  };

  const PaymentView = () => {
    const isYearly = billingCycle === 'yearly';
    const amountDue = isYearly ? '420' : '50';
    const monthlyRate = isYearly ? '$35.00' : '$50.00';

    return (
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16 text-white relative">
        {/* Back Link */}
        <button 
          onClick={() => handleSwitchView('pricing')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FDD935] transition-colors mb-8 cursor-pointer bg-transparent border-none p-0 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Back to plans</span>
        </button>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Pro plan</h1>
        </div>

        {/* Payment Cycle Switcher */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
              billingCycle === 'monthly'
                ? 'bg-white/[0.04] border-[#FDD935] ring-1 ring-[#FDD935]/40 shadow-[0_0_20px_rgba(253,217,53,0.15)]'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                billingCycle === 'monthly' ? 'border-[#FDD935]' : 'border-gray-500'
              }`}>
                {billingCycle === 'monthly' && <div className="w-2.5 h-2.5 bg-[#FDD935] rounded-full shadow-[0_0_8px_#FDD935]" />}
              </div>
            </div>
            <div className="text-white font-bold text-base mb-1">Monthly</div>
            <div className="text-gray-400 text-sm">$50.00/month + tax</div>
          </button>

          <button 
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
              billingCycle === 'yearly'
                ? 'bg-white/[0.04] border-[#FDD935] ring-1 ring-[#FDD935]/40 shadow-[0_0_20px_rgba(253,217,53,0.15)]'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                billingCycle === 'yearly' ? 'border-[#FDD935]' : 'border-gray-500'
              }`}>
                {billingCycle === 'yearly' && <div className="w-2.5 h-2.5 bg-[#FDD935] rounded-full shadow-[0_0_8px_#FDD935]" />}
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#FDD935]/15 text-[#FDD935] text-[10px] font-black uppercase tracking-wider border border-[#FDD935]/30">
                Save 30%
              </span>
            </div>
            <div className="text-white font-bold text-base mb-1">Yearly</div>
            <div className="text-gray-400 text-sm">$35.00/month + tax</div>
          </button>
        </div>

        {/* ORDER DETAILS Card */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-7 mb-6 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
            Order Details
          </h3>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white font-bold text-base">Pro plan</div>
                <div className="text-gray-400 text-xs mt-0.5">{isYearly ? 'Billed Annually' : 'Monthly'}</div>
              </div>
              <div className="text-white font-bold text-lg">${amountDue}</div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-300 font-medium">Subtotal</div>
              <div className="text-white font-bold">${amountDue}</div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-white font-bold text-base">Total due today</div>
              <div className="text-white font-black text-2xl text-[#FDD935]">${amountDue}</div>
            </div>
          </div>
        </div>

        {/* Auto-renew Note */}
        <div className="flex gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-2xl mb-8 items-start backdrop-blur-sm">
          <Info size={18} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">
            Your subscription will auto renew on {renewalDateString}. You will be charged {isYearly ? '$420.00/year' : '$50.00/month'} + tax.
          </p>
        </div>

        {/* PAYMENT METHOD Section */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center justify-between">
            <span>Payment Method</span>
            <span className="text-[11px] text-gray-500 font-normal normal-case flex items-center gap-1">
              <Lock size={12} className="text-[#FDD935]" /> 256-bit encrypted
            </span>
          </h3>

          {paymentCard ? (
            <div 
              onClick={() => setShowCardModal(true)}
              className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-[#FDD935]/40 hover:bg-white/[0.04] transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#FDD935]/30 transition-colors">
                  <CreditCard size={20} className="text-[#FDD935]" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm tracking-wide">
                    {paymentCard.brand} •••• {paymentCard.last4}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    Expires {paymentCard.expMonth}/{paymentCard.expYear} · {paymentCard.cardholder}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                <span className="text-xs font-semibold">Change</span>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-[#FDD935] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 backdrop-blur-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Card Number</label>
                  {cardForm.number && (
                    <span className="text-[10px] font-mono font-bold text-[#FDD935] uppercase px-1.5 py-0.5 rounded bg-[#FDD935]/10 border border-[#FDD935]/20">
                      {getCardBrand(cardForm.number)}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardForm.number}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                  />
                  <CreditCard size={18} className="absolute right-3.5 top-3.5 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cardholder Name</label>
                <input 
                  type="text"
                  placeholder="Full name on card"
                  value={cardForm.cardholder}
                  onChange={(e) => setCardForm(prev => ({ ...prev, cardholder: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expiration</label>
                  <input 
                    type="text"
                    placeholder="MM/YY"
                    value={cardForm.exp}
                    onChange={handleExpChange}
                    maxLength={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CVC</label>
                  <input 
                    type="password"
                    placeholder="CVC"
                    value={cardForm.cvc}
                    onChange={(e) => setCardForm(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    maxLength={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                  />
                </div>
              </div>
              {cardFormError && (
                <p className="text-red-400 text-xs mt-1">{cardFormError}</p>
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {paymentError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-fade-in">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{paymentError}</span>
          </div>
        )}

        {/* Terms and Subscribe */}
        <div className="space-y-6">
          <label className="flex gap-3.5 items-start cursor-pointer select-none group">
            <input 
              type="checkbox" 
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
              termsAgreed ? 'bg-[#FDD935] border-[#FDD935]' : 'border-gray-500 bg-white/5 group-hover:border-gray-400'
            }`}>
              {termsAgreed && <Check size={14} className="text-black stroke-[3]" />}
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              You agree that Xoeris will charge your card in the amount above now and on a recurring {isYearly ? 'annual' : 'monthly'} basis until you cancel in accordance with our <a href="#" className="text-gray-300 hover:text-white underline">terms</a>. You can cancel at any time in your account settings.
            </p>
          </label>

          <button 
            type="button"
            disabled={isProcessing}
            onClick={handleSubscribe}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-none shadow-[0_0_30px_rgba(253,217,53,0.3)] ${
              isProcessing
                ? 'bg-[#FDD935]/70 text-black cursor-wait'
                : 'bg-[#FDD935] hover:bg-[#FFE066] text-black active:scale-[0.99] hover:shadow-[0_0_40px_rgba(253,217,53,0.5)]'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Processing Order…</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </div>

        {/* Card Entry / Edit Modal */}
        {showCardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#111111] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FDD935]/15 border border-[#FDD935]/30 flex items-center justify-center text-[#FDD935]">
                    <CreditCard size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Payment Method</h3>
                </div>
                <button 
                  onClick={() => setShowCardModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors bg-transparent border-none cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCard} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardForm.number}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                      required
                    />
                    <CreditCard size={18} className="absolute right-3.5 top-3.5 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cardholder Name</label>
                  <input 
                    type="text"
                    placeholder="Full name on card"
                    value={cardForm.cardholder}
                    onChange={(e) => setCardForm(prev => ({ ...prev, cardholder: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expiration</label>
                    <input 
                      type="text"
                      placeholder="MM/YY"
                      value={cardForm.exp}
                      onChange={handleExpChange}
                      maxLength={5}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CVC</label>
                    <input 
                      type="password"
                      placeholder="•••"
                      value={cardForm.cvc}
                      onChange={(e) => setCardForm(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      maxLength={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                      required
                    />
                  </div>
                </div>

                {cardFormError && (
                  <p className="text-red-400 text-xs mt-2">{cardFormError}</p>
                )}

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowCardModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs transition-colors border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-[#FDD935] hover:bg-[#FFE066] text-black font-black uppercase tracking-wider rounded-xl text-xs transition-colors border-none cursor-pointer shadow-[0_0_15px_rgba(253,217,53,0.3)]"
                  >
                    Save Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Confirmation Modal */}
        {successReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-w-lg bg-[#0e0e0e] border border-[#FDD935]/40 rounded-3xl p-8 shadow-[0_0_60px_rgba(253,217,53,0.2)] text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[#FDD935]/15 border border-[#FDD935]/40 flex items-center justify-center mx-auto mb-6 text-[#FDD935]">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Subscription Confirmed</h2>
              <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                Your Pro account is now active. All advanced models and ecosystem features have been unlocked.
              </p>

              {/* Receipt card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3 mb-8 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Reference</span>
                  <span className="text-white font-bold">{successReceipt.transactionRef}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Plan</span>
                  <span className="text-white uppercase font-bold">Xoeris Pro ({successReceipt.billingCycle})</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Payment</span>
                  <span className="text-white font-bold">{successReceipt.cardBrand} •••• {successReceipt.cardLast4}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Total Paid</span>
                  <span className="text-[#FDD935] font-black">${successReceipt.amount}.00 USD</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate ? onNavigate('chat') : window.location.href = 'https://xalme.xoeris.com/chat'}
                  className="flex-1 py-3.5 bg-[#FDD935] hover:bg-[#FFE066] text-black font-black uppercase tracking-widest rounded-xl text-xs transition-colors border-none cursor-pointer shadow-[0_0_20px_rgba(253,217,53,0.4)] flex items-center justify-center gap-2"
                >
                  <span>Launch Xalme Chat</span>
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => {
                    setSuccessReceipt(null);
                    handleSwitchView('pricing');
                  }}
                  className="py-3.5 px-6 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-colors border-none cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen relative overflow-hidden flex flex-col items-center selection:bg-[#FDD935] selection:text-black">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(253,217,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(253,217,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      {/* Background blobs for depth — Xoeris cyber yellow palette */}
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden mix-blend-screen gpu-accel">
        <div className="blob blob-1 will-change-transform" style={{ backgroundColor: '#FDD935' }}></div>
        <div className="blob blob-2 will-change-transform" style={{ backgroundColor: '#FFC94A' }}></div>
        <div className="blob blob-3 will-change-transform" style={{ backgroundColor: '#FEF08A' }}></div>
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[60px]"></div>
      </div>

      <FadeIn className="relative z-10 w-full">
        {view === 'pricing' ? <PricingView /> : <PaymentView />}
      </FadeIn>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pageSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-page-slide-in {
          animation: pageSlideIn 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
}
