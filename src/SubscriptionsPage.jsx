import React, { useState, useEffect } from 'react';
import { Check, Zap, ShieldCheck, Info, ArrowLeft, ArrowRight, CreditCard } from 'lucide-react';
import FadeIn from './components/FadeIn';

export default function SubscriptionsPage({ onNavigate }) {
  const [view, setView] = useState(() => {
    return window.location.pathname === '/payment' ? 'payment' : 'pricing';
  });
  const [billingCycle, setBillingCycle] = useState('yearly');

  useEffect(() => {
    const handlePopState = () => {
      setView(window.location.pathname === '/payment' ? 'payment' : 'pricing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSwitchView = (newView) => {
    const path = newView === 'payment' ? '/payment' : '/subscription';
    window.history.pushState({}, '', path);
    setView(newView);
    window.scrollTo(0, 0);
  };

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
            onClick={() => onNavigate && onNavigate('xoeris')}
            className="h-8 w-32 transition-transform duration-300 hover:scale-105 bg-transparent border-none p-0 cursor-pointer"
          >
            <img src="/xoeris_logo_emblem.png" alt="Xoeris" className="w-full h-full object-contain object-right" />
          </button>
        </div>

        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Plans that grow with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDD935] to-[#FFC94A]">Xoeris</span>
          </h1>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-12 h-6 rounded-full p-1 transition-colors ${billingCycle === 'yearly' ? 'bg-[#FDD935]' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
              <span className="text-[11px] font-semibold bg-[#FDD935]/15 text-[#FDD935] border border-[#FDD935]/30 px-2 py-0.5 rounded-full">Save 30%</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard 
            title="Free"
            description="Meet Xoeris"
            price="0"
            buttonText="Use Xoeris for free"
            icon={Zap}
            features={[
              "Basic Xoeris products",
              "Chat with Xalme on Web for a limited usage",
              "Join Xoeris Community",
              "Being a contributor for Xoeris Development Programs"
            ]}
          />
          <PricingCard 
            title="Pro"
            description="Deep analysis and collaboration"
            highlighted={true}
            price={billingCycle === 'yearly' ? '35' : '50'}
            buttonText="Get Pro plan"
            icon={ShieldCheck}
            features={[
              "Pro Xoeris products",
              "Chat with Xalme on web, Android, and desktop",
              "Higher usage limits",
              "Access to more Xalme models",
              "Customer support from Xoeris Agent",
              "Early access to Beta Xoeris products and features"
            ]}
          />
          <PricingCard 
            title="Ultra"
            description="Enterprise-grade performance"
            price="100"
            buttonText="Get Ultra plan"
            icon={Info}
            features={[
              "All Xoeris products",
              "Access Xalme Code on web",
              "Up to 10x more usage than Pro*",
              "High priorities for customer support from Xoeris Agent",
              "Early access to Alpha, Beta, and Dev Xoeris products and advanced features"
            ]}
          />
        </div>

        <p className="mt-12 text-center text-hide-text-disabled text-xs max-w-2xl mx-auto">
          *Usage limits apply. Prices shown don't include applicable tax. Prices and plans are subject to change at Xoeris's discretion.
        </p>
      </div>
    );
  };

  const PaymentView = () => (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
      <header className="mb-12">
        <button 
          onClick={() => handleSwitchView('pricing')}
          className="flex items-center gap-2 text-hide-text-muted hover:text-hide-text-primary transition-colors duration-hide-fast mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to plans</span>
        </button>
        <h1 className="text-4xl font-black text-hide-text-primary mb-8">Pro plan</h1>

        {/* Payment Cycle Switcher */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`p-6 rounded-hide-lg border text-left transition-all duration-hide-fast ${billingCycle === 'monthly' ? 'bg-hide-primary border-hide-border-default ring-1 ring-hide-border-subtle' : 'bg-hide-canvas border-hide-border-subtle hover:border-hide-border-default'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingCycle === 'monthly' ? 'border-hide-action' : 'border-hide-border-default'}`}>
                {billingCycle === 'monthly' && <div className="w-2.5 h-2.5 bg-hide-action rounded-full" />}
              </div>
            </div>
            <div className="text-hide-text-primary font-bold mb-1">Monthly</div>
            <div className="text-hide-text-muted text-sm">$50.00/month + tax</div>
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`p-6 rounded-hide-lg border text-left transition-all duration-hide-fast relative ${billingCycle === 'yearly' ? 'bg-hide-primary border-hide-border-default ring-1 ring-hide-border-subtle' : 'bg-hide-canvas border-hide-border-subtle hover:border-hide-border-default'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingCycle === 'yearly' ? 'border-hide-action' : 'border-hide-border-default'}`}>
                {billingCycle === 'yearly' && <div className="w-2.5 h-2.5 bg-hide-action rounded-full" />}
              </div>
            </div>
            <div className="text-hide-text-primary font-bold mb-1">Yearly</div>
            <div className="text-hide-text-muted text-sm">$35.00/month + tax</div>
          </button>
        </div>
      </header>

      {/* Order Details */}
      <div className="bg-hide-canvas border border-hide-border-subtle rounded-hide-lg p-8 mb-6">
        <h3 className="text-sm font-bold text-hide-text-primary mb-6 uppercase tracking-wider">Order details</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-hide-text-primary font-bold">Pro plan</div>
              <div className="text-hide-text-muted text-xs mt-1">{billingCycle === 'yearly' ? 'Annually' : 'Monthly'}</div>
            </div>
            <div className="text-hide-text-primary font-bold">${billingCycle === 'yearly' ? '420' : '50'}</div>
          </div>
          <div className="h-px bg-hide-border-subtle" />
          <div className="flex justify-between items-center">
            <div className="text-hide-text-secondary font-medium">Subtotal</div>
            <div className="text-hide-text-primary font-bold">${billingCycle === 'yearly' ? '420' : '50'}</div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="text-hide-text-primary font-bold">Total due today</div>
            <div className="text-hide-text-primary font-bold">${billingCycle === 'yearly' ? '420' : '50'}</div>
          </div>
        </div>
      </div>

      {/* Auto-renew Note */}
      <div className="flex gap-4 p-6 bg-hide-canvas border border-hide-border-subtle rounded-hide-lg mb-12">
        <Info size={20} className="text-hide-text-muted shrink-0" />
        <p className="text-sm text-hide-text-secondary leading-relaxed">
          Your subscription will auto renew on {new Date(new Date().setFullYear(new Date().getFullYear() + (billingCycle === 'yearly' ? 1 : 0), new Date().getMonth() + (billingCycle === 'monthly' ? 1 : 0))).toLocaleDateString()}. You will be charged ${billingCycle === 'yearly' ? '420.00/year' : '50.00/month'} + tax.
        </p>
      </div>

      {/* Payment Method */}
      <div className="mb-12">
        <h3 className="text-sm font-bold text-hide-text-primary mb-6 uppercase tracking-wider">Payment method</h3>
        <div className="flex items-center justify-between p-6 bg-hide-canvas border border-hide-border-subtle rounded-hide-lg hover:border-hide-border-default transition-all duration-hide-fast cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-hide-md bg-hide-elevated border border-hide-border-subtle">
              <CreditCard size={20} className="text-hide-text-muted" />
            </div>
            <div>
              <div className="text-hide-text-primary font-bold">Visa •••• 2609</div>
              <div className="text-hide-text-muted text-xs">Expires 12/28</div>
            </div>
          </div>
          <div className="text-hide-text-muted group-hover:text-hide-text-primary transition-colors duration-hide-fast">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>

      {/* Terms and Subscribe */}
      <div className="space-y-8">
        <div className="flex gap-4 items-start">
          <div className="mt-1">
            <div className="w-5 h-5 rounded-hide-sm border border-hide-border-default bg-hide-canvas flex items-center justify-center">
              <div className="w-2 h-2 bg-hide-action rounded-sm" />
            </div>
          </div>
          <p className="text-xs text-hide-text-muted leading-relaxed">
            You agree that Xoeris will charge your card in the amount above now and on a recurring annual basis until you cancel in accordance with our <a href="#" className="text-hide-text-secondary hover:text-hide-text-primary underline transition-colors duration-hide-fast">terms</a>. You can cancel at any time in your account settings.
          </p>
        </div>
        <button className="w-full py-4 rounded-hide-lg bg-hide-action hover:bg-hide-action-hover text-hide-action-text font-black uppercase tracking-[0.2em] transition-all duration-hide-fast border border-hide-action active:scale-[0.98]">
          Subscribe
        </button>
      </div>
    </div>
  );

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
