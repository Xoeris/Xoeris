import React, { useState, useEffect } from 'react';
import { Check, ArrowLeft, CreditCard, ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react';
import FadeIn from './components/FadeIn';

export default function SubscriptionsPage({ onNavigate }) {
  const [view, setView] = useState(() => {
    return window.location.pathname === '/payment' ? 'payment' : 'pricing';
  });
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [activeTab, setActiveTab] = useState('individual');

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
    <div className={`flex flex-col p-8 rounded-3xl border transition-all duration-300 ${highlighted ? 'bg-[#1a1a1a] border-white/20 shadow-2xl ring-1 ring-white/10' : 'bg-[#141414] border-white/10 hover:border-white/20'}`}>
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Icon className="text-white" size={24} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{price === '0' ? '$0' : `$${price}`}</span>
          {price !== '0' && <span className="text-gray-500 text-sm font-medium">USD / month</span>}
        </div>
        {price !== '0' && (billingCycle === 'yearly' || title === 'Max') && (
          <div className="text-gray-500 text-xs mt-1">billed annually</div>
        )}
      </div>
      <button 
        onClick={() => title === 'Pro' ? handleSwitchView('payment') : null}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 mb-8 ${highlighted ? 'bg-white text-black hover:bg-gray-200' : 'bg-transparent border border-white/20 text-white hover:bg-white/5'}`}
      >
        {buttonText}
      </button>
      <div className="space-y-4">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
          {title === 'Free' ? 'Features' : `Everything in ${title === 'Pro' ? 'Free' : 'Pro'} and:`}
        </div>
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-3 text-sm text-gray-300">
            <Check size={18} className="text-gray-500 shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const PricingView = () => (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-10 tracking-tight">Plans that grow with you</h1>
        
        {/* Tab Switcher */}
        <div className="inline-flex p-1.5 bg-[#141414] rounded-2xl border border-white/5 mb-10">
          <button 
            onClick={() => setActiveTab('individual')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'individual' ? 'bg-[#222] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Individual
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'team' ? 'bg-[#222] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Team and Enterprise
          </button>
        </div>

        {/* Billing Toggle */}
        {activeTab === 'individual' && (
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-12 h-6 bg-[#222] rounded-full p-1 transition-colors hover:bg-[#333]"
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>Yearly</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider">Save 30%</span>
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PricingCard 
          title="Free"
          description="Meet Xoeris"
          price="0"
          buttonText="Use Xoeris for free"
          icon={Zap}
          features={[
            "Real-time data visualization",
            "Basic dataset exploration",
            "Community API access",
            "Standard export formats",
            "Public dashboard hosting"
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
              "Xoeris Engine directly in your workflow",
              "Advanced predictive modeling",
              "Priority API throughput",
              "Custom data connectors",
              "Private encrypted storage"
            ]}
          />
        </div>
        <PricingCard 
          title="Max"
          description="Enterprise-grade performance"
          price="100"
          buttonText="Get Max plan"
          icon={Info}
          features={[
            "Unlimited data processing",
            "Dedicated node clusters",
            "Early access to ML models",
            "SLA-backed uptime",
            "24/7 dedicated support"
          ]}
        />
      </div>

      <p className="mt-12 text-center text-gray-600 text-xs max-w-2xl mx-auto">
        *Usage limits apply. Prices shown don't include applicable tax. Prices and plans are subject to change at Xoeris's discretion.
      </p>
    </div>
  );

  const PaymentView = () => (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
      <header className="mb-12">
        <button 
          onClick={() => handleSwitchView('pricing')}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to plans</span>
        </button>
        <h1 className="text-4xl font-black text-white mb-8">Pro plan</h1>

        {/* Payment Cycle Switcher */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`p-6 rounded-2xl border text-left transition-all ${billingCycle === 'monthly' ? 'bg-[#1a1a1a] border-white/30 ring-1 ring-white/10' : 'bg-[#141414] border-white/10 hover:border-white/20'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingCycle === 'monthly' ? 'border-white' : 'border-gray-700'}`}>
                {billingCycle === 'monthly' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
            </div>
            <div className="text-white font-bold mb-1">Monthly</div>
            <div className="text-gray-500 text-sm">$50.00/month + tax</div>
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`p-6 rounded-2xl border text-left transition-all relative ${billingCycle === 'yearly' ? 'bg-[#1a1a1a] border-white/30 ring-1 ring-white/10' : 'bg-[#141414] border-white/10 hover:border-white/20'}`}
          >
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider">Save 30%</div>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billingCycle === 'yearly' ? 'border-white' : 'border-gray-700'}`}>
                {billingCycle === 'yearly' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
            </div>
            <div className="text-white font-bold mb-1">Yearly</div>
            <div className="text-gray-500 text-sm">$35.00/month + tax</div>
          </button>
        </div>
      </header>

      {/* Order Details */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 mb-6">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Order details</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-bold">Pro plan</div>
              <div className="text-gray-500 text-xs mt-1">{billingCycle === 'yearly' ? 'Annually' : 'Monthly'}</div>
            </div>
            <div className="text-white font-bold">${billingCycle === 'yearly' ? '420' : '50'}</div>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between items-center">
            <div className="text-gray-400 font-medium">Subtotal</div>
            <div className="text-white font-bold">${billingCycle === 'yearly' ? '420' : '50'}</div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="text-white font-bold">Total due today</div>
            <div className="text-white font-bold">${billingCycle === 'yearly' ? '420' : '50'}</div>
          </div>
        </div>
      </div>

      {/* Auto-renew Note */}
      <div className="flex gap-4 p-6 bg-[#141414] border border-white/10 rounded-2xl mb-12">
        <Info size={20} className="text-gray-500 shrink-0" />
        <p className="text-sm text-gray-400 leading-relaxed">
          Your subscription will auto renew on {new Date(new Date().setFullYear(new Date().getFullYear() + (billingCycle === 'yearly' ? 1 : 0), new Date().getMonth() + (billingCycle === 'monthly' ? 1 : 0))).toLocaleDateString()}. You will be charged ${billingCycle === 'yearly' ? '420.00/year' : '50.00/month'} + tax.
        </p>
      </div>

      {/* Payment Method */}
      <div className="mb-12">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Payment method</h3>
        <div className="flex items-center justify-between p-6 bg-[#141414] border border-white/10 rounded-2xl hover:border-white/20 transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <CreditCard size={20} className="text-gray-400" />
            </div>
            <div>
              <div className="text-white font-bold">Visa •••• 2609</div>
              <div className="text-gray-500 text-xs">Expires 12/28</div>
            </div>
          </div>
          <div className="text-gray-500 group-hover:text-white transition-colors">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>

      {/* Terms and Subscribe */}
      <div className="space-y-8">
        <div className="flex gap-4 items-start">
          <div className="mt-1">
            <div className="w-5 h-5 rounded border border-gray-700 bg-[#141414] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm" />
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            You agree that Xoeris will charge your card in the amount above now and on a recurring annual basis until you cancel in accordance with our <a href="#" className="text-gray-400 hover:text-white underline">terms</a>. You can cancel at any time in your account settings.
          </p>
        </div>
        <button className="w-full py-4 rounded-2xl bg-[#222] hover:bg-[#2a2a2a] text-gray-300 hover:text-white font-black uppercase tracking-[0.2em] transition-all border border-white/5 active:scale-[0.98]">
          Subscribe
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background blobs for depth */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#F9CB43] blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#705EBC] blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 opacity-30" />
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
