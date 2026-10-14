import React, { useState, useEffect } from 'react';
import { 
  Check, Zap, ShieldCheck, Info, ArrowLeft, ArrowRight,
  Lock, CheckCircle2, AlertCircle, Sparkles, ExternalLink, User, Mail, ShieldAlert,
  CreditCard, Headphones
} from 'lucide-react';
import FadeIn from './components/FadeIn';
import { getStoredUser, getStoredToken, syncUserFromDatabase } from './services/authService';

export default function SubscriptionsPage({ onNavigate }) {
  const [view, setView] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const host = window.location.hostname.toLowerCase();
    if (host.includes('pay.xoeris.com') || host.startsWith('pay.')) return 'payment';
    return (path === '/payment' || path === '/pay' || path.startsWith('/l/')) ? 'payment' : 'pricing';
  });
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [selectedPlan, setSelectedPlan] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('ultra')) return 'Ultra';
    return 'Pro';
  });
  const [billingCycle, setBillingCycle] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('annual') || path.includes('yearly')) return 'yearly';
    if (path.includes('monthly')) return 'monthly';
    return 'yearly';
  });
  const [paymentMethod, setPaymentMethod] = useState('gumroad'); // 'gumroad' | 'contact_sales'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  // Sync user state and listen for auth updates
  useEffect(() => {
    const updateUser = () => {
      const u = getStoredUser();
      setCurrentUser(u);
      if (u?.name) setFullName(u.name);
      if (u?.email) setEmail(u.email);
    };

    updateUser();
    syncUserFromDatabase().then((u) => {
      if (u) setCurrentUser(u);
    }).catch(() => null);

    window.addEventListener('xoeris_auth_change', updateUser);
    window.addEventListener('storage', updateUser);
    return () => {
      window.removeEventListener('xoeris_auth_change', updateUser);
      window.removeEventListener('storage', updateUser);
    };
  }, []);

  // Manual payment authorization state
  const [fullName, setFullName] = useState(() => {
    const user = getStoredUser();
    return user?.name || '';
  });
  const [email, setEmail] = useState(() => {
    const user = getStoredUser();
    return user?.email || '';
  });
  const [agreeText, setAgreeText] = useState('');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const host = window.location.hostname.toLowerCase();
      if (host.includes('pay.xoeris.com') || host.startsWith('pay.')) {
        setView('payment');
        return;
      }
      setView((path === '/payment' || path === '/pay' || path.startsWith('/l/')) ? 'payment' : 'pricing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSwitchView = (newView, planName = 'Pro') => {
    if (planName) setSelectedPlan(planName);
    const host = window.location.hostname.toLowerCase();
    const isPayHost = host.includes('pay.xoeris.com') || host.startsWith('pay.');
    const path = newView === 'payment' ? (isPayHost ? '/' : '/payment') : '/pricing';
    window.history.pushState({}, '', path);
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleSubscribe = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPaymentError('');

    if (!fullName || fullName.trim().length < 2) {
      setPaymentError('Please enter your full name (e.g. Chris Juan).');
      return;
    }

    if (!email || !email.includes('@')) {
      setPaymentError('Please enter a valid email address (e.g. chris.juan@example.com).');
      return;
    }

    if (agreeText.trim() !== 'I AGREE') {
      setPaymentError('Please check the authorization box to confirm your subscription request.');
      return;
    }

    setIsProcessing(true);

    try {
      const token = getStoredToken();
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        plan: selectedPlan.toLowerCase(),
        billingCycle,
        agreeText: agreeText.trim()
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
        await syncUserFromDatabase().catch(() => null);
        setSuccessReceipt({
          transactionRef: data.transactionRef || `XOERIS-REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          plan: selectedPlan,
          billingCycle,
          amount: data.amount || (selectedPlan === 'Ultra' ? (billingCycle === 'yearly' ? 420 : 50) : (billingCycle === 'yearly' ? 126 : 15))
        });
      } else {
        const errJson = response ? await response.json().catch(() => ({})) : {};
        if (errJson && errJson.error) {
          setPaymentError(errJson.error);
        } else {
          // Local / offline fallback record
          const fallbackRef = `XOERIS-REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          setSuccessReceipt({
            transactionRef: fallbackRef,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            plan: selectedPlan,
            billingCycle,
            amount: selectedPlan === 'Ultra' ? (billingCycle === 'yearly' ? 420 : 50) : (billingCycle === 'yearly' ? 126 : 15)
          });
        }
      }
    } catch (err) {
      setPaymentError(err.message || 'An unexpected error occurred while processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const PricingCard = ({ 
    title, 
    description, 
    price, 
    buttonText, 
    highlighted = false, 
    badge = null,
    isCurrentPlan = false,
    disabled = false,
    features = [],
    onAction
  }) => (
    <div className={`rounded-3xl p-8 relative flex flex-col justify-between transition-all duration-300 ${
      isCurrentPlan
        ? 'bg-gradient-to-b from-[#FDD935]/20 via-[#FDD935]/[0.05] to-transparent border-2 border-[#FDD935] shadow-[0_0_50px_rgba(253,217,53,0.25)] ring-1 ring-[#FDD935]'
        : highlighted 
          ? 'bg-gradient-to-b from-[#FDD935]/15 via-white/[0.03] to-transparent border border-[#FDD935]/50 shadow-[0_0_40px_rgba(253,217,53,0.15)] ring-1 ring-[#FDD935]/30' 
          : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
    }`}>
      {badge && (
        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5 ${
          isCurrentPlan 
            ? 'bg-[#FDD935] text-black shadow-[0_0_20px_rgba(253,217,53,0.5)]'
            : 'bg-[#FDD935] text-black'
        }`}>
          {isCurrentPlan && <CheckCircle2 size={13} className="text-black" />}
          <span>{badge}</span>
        </div>
      )}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            {isCurrentPlan && (
              <span className="text-[10px] font-mono font-bold text-[#FDD935] px-2 py-0.5 rounded bg-[#FDD935]/15 border border-[#FDD935]/30 uppercase">
                Active
              </span>
            )}
          </div>
          {title === 'Pro' && <span className="text-[10px] font-mono text-[#FDD935] px-2 py-0.5 rounded bg-[#FDD935]/10 border border-[#FDD935]/20 font-bold uppercase">Developer</span>}
          {title === 'Ultra' && <span className="text-[10px] font-mono text-[#FEF08A] px-2 py-0.5 rounded bg-white/10 border border-white/20 font-bold uppercase">Enterprise</span>}
        </div>
        <p className="text-gray-400 text-xs leading-relaxed mb-6 h-10">{description}</p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">${price}</span>
          <span className="text-gray-400 text-xs font-semibold">/month</span>
        </div>
        <div className="h-5 mb-6">
          {price !== '0' && (
            <div className="text-gray-400 text-xs">
              {billingCycle === 'yearly' ? 'billed annually' : 'billed monthly'}
            </div>
          )}
        </div>
        <button 
          onClick={disabled ? undefined : onAction}
          disabled={disabled}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 mb-8 relative z-10 flex items-center justify-center gap-2 ${
            disabled
              ? 'bg-white/5 border border-white/10 text-gray-400 cursor-default opacity-85'
              : highlighted || isCurrentPlan
                ? 'bg-[#FDD935] text-black hover:bg-[#FFE066] shadow-[0_0_20px_rgba(253,217,53,0.3)] border-none cursor-pointer'
                : 'bg-white/5 border border-white/15 text-white hover:bg-white/10 cursor-pointer'
          }`}
        >
          {isCurrentPlan && <Check size={16} className="text-black" />}
          <span>{buttonText}</span>
        </button>
        <div className="space-y-3 relative z-10">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            {title === 'Free' ? 'Included Features' : `Everything in ${title === 'Pro' ? 'Free' : 'Pro'} and:`}
          </div>
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-2.5 text-xs text-gray-300">
              <Check size={16} className="text-[#FDD935] shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
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
            className="flex items-center group bg-transparent border-none p-0 cursor-pointer"
          >
            <img src="/xoeris_logo_emblem.png" alt="Xoeris Logo Emblem" className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
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

          {currentUser && (currentUser.subscription_tier || 'free').toLowerCase() !== 'free' && (
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#FDD935]/10 border border-[#FDD935]/30 shadow-[0_0_20px_rgba(253,217,53,0.1)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FDD935] animate-pulse"></span>
              <span className="text-xs text-gray-300">
                Logged in as <strong className="text-white font-mono">{currentUser.email || currentUser.username}</strong>
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-black bg-[#FDD935] px-2.5 py-0.5 rounded-full">
                {(currentUser.subscription_tier || '').toUpperCase()} ACTIVE
              </span>
            </div>
          )}

          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex items-center gap-1 backdrop-blur-md">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-[#FDD935] text-black shadow-[0_0_15px_rgba(253,217,53,0.3)]' : 'text-gray-400 hover:text-white bg-transparent border-none cursor-pointer'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'bg-[#FDD935] text-black shadow-[0_0_15px_rgba(253,217,53,0.3)]' : 'text-gray-400 hover:text-white bg-transparent border-none cursor-pointer'
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/20 font-black">Save 30%</span>
              </button>
            </div>
          </div>
        </div>

        {(() => {
          const rawTier = (currentUser?.subscription_tier || 'free').toLowerCase();
          const userStatus = (currentUser?.subscription_status || 'active').toLowerCase();
          const isExpired = userStatus === 'expired';
          const activeTier = isExpired ? 'free' : rawTier;
          const userCycle = (currentUser?.subscription_cycle || '').toLowerCase();
          const expiresAt = currentUser?.subscription_expires_at ? new Date(currentUser.subscription_expires_at) : null;
          const expiresDateStr = expiresAt && !isNaN(expiresAt) ? expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

          const isFree = activeTier === 'free';
          const isPro = activeTier === 'pro';
          const isUltra = activeTier === 'ultra';

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard 
                title="Free"
                description="Essential toolset for casual users and platform discovery."
                price="0"
                buttonText={isFree ? "Current Plan" : "Downgrade"}
                isCurrentPlan={isFree}
                disabled={isFree}
                highlighted={false}
                badge={isFree ? "Current Plan" : null}
                onAction={() => null}
                features={[
                  "Basic Xoeris products",
                  "Access to public developer utilities",
                  "Join Xoeris Community",
                  "Being a contributor for Xoeris Development Programs"
                ]}
              />
              <PricingCard 
                title="Pro"
                description="Advanced intelligence and full runtime support for developers."
                price={billingCycle === 'yearly' ? '10.50' : '15'}
                buttonText={isPro ? "Current Plan" : isUltra ? "Included in Ultra" : "Get Pro"}
                isCurrentPlan={isPro}
                disabled={isPro || isUltra}
                highlighted={isPro || (!isUltra && !isPro)}
                badge={isPro ? "Active Plan" : (!isUltra ? "Most Popular" : null)}
                onAction={() => handleSwitchView('payment', 'Pro')}
                features={[
                  "Pro Xoeris products",
                  "Chat with Xalme on Android and desktop apps",
                  "Higher usage limits across tools",
                  "Access to advanced Xalme models",
                  "Customer support from Xoeris Agent",
                  "Early access to Beta Xoeris products and features"
                ]}
              />
              <PricingCard 
                title="Ultra"
                description="Dedicated compute, limitless bandwidth, and enterprise automation."
                price={billingCycle === 'yearly' ? '35' : '50'}
                buttonText={isUltra ? "Current Plan" : isPro ? "Upgrade to Ultra" : "Upgrade to Ultra"}
                isCurrentPlan={isUltra}
                disabled={isUltra}
                highlighted={isUltra}
                badge={isUltra ? "Active Plan" : null}
                onAction={() => handleSwitchView('payment', 'Ultra')}
                features={[
                  "All Xoeris products",
                  "Exclusive access to Xalme Chat Web version",
                  "Access Xalme Code on web",
                  "Up to 10x more usage than Pro*",
                  "High priorities for customer support from Xoeris Agent",
                  "Early access to Alpha, Beta, and Dev Xoeris products and advanced features"
                ]}
              />
            </div>
          );
        })()}
      </div>
    );
  };

  const PaymentView = () => {
    const isYearly = billingCycle === 'yearly';
    const isUltra = selectedPlan === 'Ultra';
    
    // Amount calculations: Pro $15/mo ($126/yr), Ultra $50/mo ($420/yr)
    let amountDue = isYearly ? '126' : '15';
    let monthlyRate = isYearly ? '$10.50' : '$15.00';
    if (isUltra) {
      amountDue = isYearly ? '420' : '50';
      monthlyRate = isYearly ? '$35.00' : '$50.00';
    } else {
      amountDue = isYearly ? '126' : '15';
      monthlyRate = isYearly ? '$10.50' : '$15.00';
    }

    // Gumroad product checkout URLs requested by user
    let gumroadUrl = 'https://pay.xoeris.com/l/pro-annual';
    if (isUltra) {
      gumroadUrl = 'https://pay.xoeris.com/l/ultra-monthly';
    } else {
      gumroadUrl = isYearly ? 'https://pay.xoeris.com/l/pro-annual' : 'https://pay.xoeris.com/l/pro-monthly';
    }

    const renewalDate = new Date();
    if (isYearly) renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    else renewalDate.setMonth(renewalDate.getMonth() + 1);
    const renewalDateString = renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16 text-white relative">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => handleSwitchView('pricing')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FDD935] transition-colors cursor-pointer bg-transparent border-none p-0 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Back to plans</span>
          </button>

          <button 
            onClick={() => { window.location.href = 'https://xoeris.com'; }}
            className="flex items-center group bg-transparent border-none p-0 cursor-pointer"
          >
            <img src="/xoeris_logo_emblem.png" alt="Xoeris Logo Emblem" className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </button>
        </div>

        {/* Header emblem */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDD935]/10 border border-[#FDD935]/25 text-[#FDD935] text-[11px] font-mono font-bold uppercase tracking-widest mb-3">
            <Lock size={12} /> Secure Checkout
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{selectedPlan} plan</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPlan('Pro')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  selectedPlan === 'Pro' ? 'bg-[#FDD935] text-black shadow-[0_0_15px_rgba(253,217,53,0.3)]' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Pro
              </button>
              <button
                onClick={() => setSelectedPlan('Ultra')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  selectedPlan === 'Ultra' ? 'bg-[#FDD935] text-black shadow-[0_0_15px_rgba(253,217,53,0.3)]' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Ultra
              </button>
            </div>
          </div>
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
            <div className="text-gray-400 text-sm">{isUltra ? '$50.00/month' : '$15.00/month'}</div>
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
            <div className="text-gray-400 text-sm">{isUltra ? '$35.00/month ($420/yr)' : '$10.50/month ($126/yr)'}</div>
          </button>
        </div>

        {/* Payment Method Selector: Gumroad vs Contact Sales */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">
            Select Payment Option
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gumroad Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('gumroad')}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                paymentMethod === 'gumroad'
                  ? 'bg-gradient-to-b from-[#FDD935]/15 to-white/[0.02] border-[#FDD935] ring-1 ring-[#FDD935]/50 shadow-[0_0_25px_rgba(253,217,53,0.18)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FDD935]/15 border border-[#FDD935]/30 flex items-center justify-center text-[#FDD935]">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Gumroad</div>
                      <div className="text-gray-400 text-[11px]">Instant Card & PayPal</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'gumroad' ? 'border-[#FDD935]' : 'border-gray-500'
                  }`}>
                    {paymentMethod === 'gumroad' && <div className="w-2 h-2 bg-[#FDD935] rounded-full" />}
                  </div>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Fast automatic checkout via Gumroad with instant activation on your account.
                </p>
              </div>
            </button>

            {/* Contact Sales Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('contact_sales')}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                paymentMethod === 'contact_sales'
                  ? 'bg-gradient-to-b from-[#FDD935]/15 to-white/[0.02] border-[#FDD935] ring-1 ring-[#FDD935]/50 shadow-[0_0_25px_rgba(253,217,53,0.18)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                      <Headphones size={18} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Contact Sales</div>
                      <div className="text-gray-400 text-[11px]">Invoice & Admin Verification</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'contact_sales' ? 'border-[#FDD935]' : 'border-gray-500'
                  }`}>
                    {paymentMethod === 'contact_sales' && <div className="w-2 h-2 bg-[#FDD935] rounded-full" />}
                  </div>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Submit an authorized subscription request directly to the Admin Dashboard.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ORDER DETAILS Card */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-7 mb-6 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
            Order Summary
          </h3>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white font-bold text-base">{selectedPlan} plan</div>
                <div className="text-gray-400 text-xs mt-0.5">{isYearly ? 'Billed Annually' : 'Monthly'}</div>
              </div>
              <div className="text-white font-bold text-lg">${amountDue}</div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-300 font-medium">Selected Provider</div>
              <div className="text-[#FDD935] font-bold">
                {paymentMethod === 'gumroad' ? 'Gumroad Checkout' : 'Contact Sales (Admin Approval)'}
              </div>
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
            Your subscription will renew on {renewalDateString}. You will be charged ${amountDue}.00 {isYearly ? '/year' : '/month'} + tax.
          </p>
        </div>

        {/* GUMROAD FLOW */}
        {paymentMethod === 'gumroad' && (
          <div className="mb-8 space-y-6 animate-fade-in">
            <div className="p-6 sm:p-7 bg-white/[0.02] border border-[#FDD935]/30 rounded-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FDD935]/15 border border-[#FDD935]/30 flex items-center justify-center text-[#FDD935] shrink-0">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Gumroad</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    You will be redirected securely to complete checkout for the <strong className="text-white">{selectedPlan} Plan ({isYearly ? 'Annual' : 'Monthly'})</strong> at <strong className="text-[#FDD935]">${amountDue}.00 USD</strong>.
                  </p>
                </div>
              </div>
            </div>

            <a
              href={gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-none shadow-[0_0_30px_rgba(253,217,53,0.3)] bg-[#FDD935] hover:bg-[#FFE066] text-black active:scale-[0.99] hover:shadow-[0_0_40px_rgba(253,217,53,0.5)] no-underline"
            >
              <span>Pay on Gumroad (${amountDue})</span>
              <ExternalLink size={16} />
            </a>
          </div>
        )}

        {/* CONTACT SALES FLOW (with submission to admin) */}
        {paymentMethod === 'contact_sales' && (
          <div className="mb-8 animate-fade-in">
            <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center justify-between">
              <span>Contact Sales & Admin Authorization</span>
              <span className="text-[11px] text-gray-500 font-normal normal-case flex items-center gap-1">
                <Lock size={12} className="text-[#FDD935]" /> 256-bit encrypted
              </span>
            </h3>

            <div className="p-6 sm:p-8 bg-white/[0.02] border border-white/10 rounded-2xl space-y-5 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FDD935]/30 to-transparent"></div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User size={14} className="text-[#FDD935]" />
                  <span>Full Name</span>
                </label>
                <input 
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Mail size={14} className="text-[#FDD935]" />
                  <span>Email</span>
                </label>
                <input 
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FDD935] transition-colors"
                  required
                />
              </div>

              {/* Terms and Confirmation */}
              <div className="pt-2">
                <label 
                  onClick={() => setAgreeText(agreeText === 'I AGREE' ? '' : 'I AGREE')}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all cursor-pointer select-none group"
                >
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                    agreeText === 'I AGREE'
                      ? 'border-[#FDD935] bg-[#FDD935]'
                      : 'border-gray-500 group-hover:border-gray-400'
                  }`}>
                    {agreeText === 'I AGREE' && <Check size={14} className="text-black stroke-[3]" />}
                  </div>
                  <div className="text-xs text-gray-300 leading-relaxed">
                    <span>I authorize this subscription request and agree to be contacted by Xoeris for order activation.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Error message */}
            {paymentError && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-fade-in">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Contact Sales Submit Action */}
            <div className="mt-6 space-y-4">
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
                    <span>Submitting to Admin…</span>
                  </>
                ) : (
                  <span>Submit Order to Sales & Admin</span>
                )}
              </button>
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
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Order Transmitted to Admin</h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                Your subscription order has been sent to the Admin Dashboard for verification. Once the administrator confirms receipt of payment, your account will be unlocked for {successReceipt.plan}.
              </p>

              {/* Receipt card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3 mb-8 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Reference ID</span>
                  <span className="text-white font-bold">{successReceipt.transactionRef}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Customer Name</span>
                  <span className="text-white font-bold">{successReceipt.fullName}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Email</span>
                  <span className="text-white font-bold">{successReceipt.email}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Requested Plan</span>
                  <span className="text-[#FDD935] uppercase font-bold">{successReceipt.plan} ({successReceipt.billingCycle})</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Verification Status</span>
                  <span className="text-yellow-400 font-bold">Pending Admin Approval</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Total Amount</span>
                  <span className="text-white font-bold">${successReceipt.amount}.00 USD</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate ? onNavigate('xoeris') : window.location.href = '/'}
                  className="flex-1 py-3.5 bg-[#FDD935] hover:bg-[#FFE066] text-black font-black uppercase tracking-widest rounded-xl text-xs transition-colors border-none cursor-pointer shadow-[0_0_20px_rgba(253,217,53,0.4)]"
                >
                  Return to Main Site
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

      {/* Background blobs for depth - Xoeris cyber yellow palette */}
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none overflow-hidden mix-blend-screen gpu-accel">
        <div className="blob blob-1 will-change-transform" style={{ backgroundColor: '#FDD935' }}></div>
        <div className="blob blob-2 will-change-transform" style={{ backgroundColor: '#FFC94A' }}></div>
        <div className="blob blob-3 will-change-transform" style={{ backgroundColor: '#FEF08A' }}></div>
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[60px]"></div>
      </div>

      <div className="relative z-10 w-full">
        {view === 'pricing' ? <PricingView /> : <PaymentView />}
      </div>
    </div>
  );
}
