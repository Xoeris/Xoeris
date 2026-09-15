import React, { useState, useEffect } from 'react';
import { Menu, X, Check, Zap, ShieldCheck, Info, ArrowLeft, ArrowRight, CreditCard, Store, Building2 } from 'lucide-react';
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
    <div className={`flex flex-col p-8 rounded-hide-xl border transition-all duration-hide-medium ${highlighted ? 'bg-hide-primary border-hide-border-default shadow-hide-popup ring-1 ring-hide-border-subtle' : 'bg-hide-canvas border-hide-border-subtle hover:border-hide-border-default'}`}>
      <div className="mb-6">
        <div className="w-12 h-12 rounded-hide-lg bg-hide-elevated border border-hide-border-subtle flex items-center justify-center mb-4">
          <Icon className="text-hide-text-primary" size={24} />
        </div>
        <h3 className="text-2xl font-bold text-hide-text-primary mb-2">{title}</h3>
        <p className="text-hide-text-muted text-sm">{description}</p>
      </div>
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-hide-text-primary">{price === '0' ? '$0' : `$${price}`}</span>
          {price !== '0' && <span className="text-hide-text-muted text-sm font-medium">USD / month</span>}
        </div>
        <div className="h-5">
          {price !== '0' && (billingCycle === 'yearly' || title === 'Max') && (
            <div className="text-hide-text-muted text-xs mt-1">billed annually</div>
          )}
        </div>
      </div>
      <button 
        onClick={() => title === 'Pro' ? handleSwitchView('payment') : null}
        className={`w-full py-3.5 rounded-hide-lg font-bold text-sm transition-all duration-hide-fast mb-8 ${highlighted ? 'bg-hide-action text-hide-action-text hover:bg-hide-action-hover' : 'bg-transparent border border-hide-border-default text-hide-text-primary hover:bg-hide-hover'}`}
      >
        {buttonText}
      </button>
      <div className="space-y-4">
        <div className="text-xs font-bold text-hide-text-muted uppercase tracking-widest mb-4">
          {title === 'Free' ? 'Features' : `Everything in ${title === 'Pro' ? 'Free' : 'Pro'} and:`}
        </div>
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-3 text-sm text-hide-text-secondary">
            <Check size={18} className="text-hide-action shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const PricingView = () => {
    if (activeTab === 'individual') {
      return (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-hide-text-primary mb-10 tracking-tight">Plans that grow with you</h1>
            
            {/* Tab Switcher */}
            <div className="inline-flex p-1.5 bg-hide-canvas rounded-hide-lg border border-hide-border-subtle mb-10">
              <button 
                onClick={() => setActiveTab('individual')}
                className={`px-8 py-2.5 rounded-hide-md text-sm font-bold transition-all duration-hide-fast ${activeTab === 'individual' ? 'bg-hide-elevated text-hide-text-primary shadow-lg' : 'text-hide-text-muted hover:text-hide-text-primary'}`}
              >
                Individual
              </button>
              <button 
                onClick={() => setActiveTab('team')}
                className={`px-8 py-2.5 rounded-hide-md text-sm font-bold transition-all duration-hide-fast ${activeTab === 'team' ? 'bg-hide-elevated text-hide-text-primary shadow-lg' : 'text-hide-text-muted hover:text-hide-text-primary'}`}
              >
                Team and Enterprise
              </button>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-hide-text-primary' : 'text-hide-text-muted'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-hide-fast ${billingCycle === 'yearly' ? 'bg-hide-action' : 'bg-hide-toggle-track'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-hide-medium ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-hide-text-primary' : 'text-hide-text-muted'}`}>Yearly</span>
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

          <p className="mt-12 text-center text-hide-text-disabled text-xs max-w-2xl mx-auto">
            *Usage limits apply. Prices shown don't include applicable tax. Prices and plans are subject to change at Xoeris's discretion.
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-hide-text-primary mb-10 tracking-tight">Enterprise-grade security</h1>
          
          <div className="inline-flex p-1.5 bg-hide-canvas rounded-hide-lg border border-hide-border-subtle mb-10">
            <button 
              onClick={() => setActiveTab('individual')}
              className={`px-8 py-2.5 rounded-hide-md text-sm font-bold transition-all duration-hide-fast ${activeTab === 'individual' ? 'bg-hide-elevated text-hide-text-primary shadow-lg' : 'text-hide-text-muted hover:text-hide-text-primary'}`}
            >
              Individual
            </button>
            <button 
              onClick={() => setActiveTab('team')}
              className={`px-8 py-2.5 rounded-hide-md text-sm font-bold transition-all duration-hide-fast ${activeTab === 'team' ? 'bg-hide-elevated text-hide-text-primary shadow-lg' : 'text-hide-text-muted hover:text-hide-text-primary'}`}
            >
              Team and Enterprise
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team Card */}
          <div className="bg-hide-canvas border border-hide-border-subtle rounded-hide-xl p-8 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-hide-lg bg-hide-elevated flex items-center justify-center border border-hide-border-subtle">
                <Store className="text-hide-text-muted" size={32} />
              </div>
              <span className="px-2 py-0.5 rounded-hide-md bg-hide-elevated border border-hide-border-subtle text-[10px] text-hide-text-muted font-bold">5-150 users</span>
            </div>
            
            <h3 className="text-3xl font-bold text-hide-text-primary mb-2">Team</h3>
            <p className="text-hide-text-muted text-sm mb-10">Predictable usage per seat</p>

            <div className="bg-hide-primary rounded-hide-lg p-6 border border-hide-border-subtle mb-10 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-hide-text-primary font-bold mb-1">Standard seat</div>
                  <div className="text-hide-text-muted text-[10px] leading-relaxed">
                    All Xoeris features, plus more usage than Pro*<br/>
                    $25 /mo when billed monthly
                  </div>
                </div>
                <div className="text-hide-text-primary font-bold text-lg flex items-baseline gap-1">
                  $20<span className="text-hide-text-muted text-xs">/mo</span>
                </div>
              </div>
              <div className="h-px bg-hide-border-subtle" />
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-hide-text-primary font-bold mb-1">Premium seat</div>
                  <div className="text-hide-text-muted text-[10px] leading-relaxed">
                    5x more usage than standard seats*<br/>
                    $125 /mo when billed monthly
                  </div>
                </div>
                <div className="text-hide-text-primary font-bold text-lg flex items-baseline gap-1">
                  $100<span className="text-hide-text-muted text-xs">/mo</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              {[
                "200K context window",
                "Extra usage available at API rates",
                "Xoeris Code",
                "Cowork",
                "Central billing and administration",
                "Single sign-on (SSO) and domain capture",
                "Admin controls for remote and local connectors",
                "Enterprise deployment for the Xoeris desktop app",
                "Enterprise search across your organization",
                "Connect Microsoft 365, Slack, and more",
                "No model training on your content by default"
              ].map((f, i) => (
                <div key={i} className="flex gap-3 text-sm text-hide-text-secondary">
                  <Check size={18} className="text-hide-action shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <button className="w-full py-4 rounded-hide-lg bg-hide-ghost text-hide-text-muted font-bold text-sm cursor-not-allowed">
                Get Team plan
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-hide-text-muted font-bold uppercase tracking-widest bg-hide-elevated py-3 rounded-hide-lg border border-hide-border-subtle">
                <Info size={14} /> Work email address required
              </div>
            </div>
          </div>

          {/* Enterprise Card */}
          <div className="bg-hide-canvas border border-hide-border-subtle rounded-hide-xl p-8 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-hide-lg bg-hide-elevated flex items-center justify-center border border-hide-border-subtle">
                <Building2 className="text-hide-text-muted" size={32} />
              </div>
              <span className="px-2 py-0.5 rounded-hide-md bg-hide-elevated border border-hide-border-subtle text-[10px] text-hide-text-muted font-bold">20+ users</span>
            </div>
            
            <h3 className="text-3xl font-bold text-hide-text-primary mb-2">Enterprise</h3>
            <p className="text-hide-text-muted text-sm mb-10">Flexible pooled usage</p>

            <div className="bg-hide-primary rounded-hide-lg p-6 border border-hide-border-subtle mb-10">
              <div className="text-hide-text-primary font-bold mb-2">Seat price + usage at API rates</div>
              <div className="text-hide-text-muted text-[10px]">
                $20/seat. Usage cost scales with model and task.
              </div>
            </div>

            <div className="text-[10px] font-bold text-hide-text-muted uppercase tracking-widest mb-6">All Team features, plus:</div>
            
            <div className="space-y-4 mb-10">
              {[
                "Pay-as-you-go pricing with pooled usage across your org",
                "Set user and org spend limits",
                "500K context window",
                "Role-based access with fine grained permissioning",
                "System for Cross-domain Identity Management (SCIM)",
                "Audit logs",
                "Compliance API for observability and monitoring",
                "Network-level access control",
                "Custom data retention controls",
                "IP allowlisting",
                "Google Docs cataloging"
              ].map((f, i) => (
                <div key={i} className="flex gap-3 text-sm text-hide-text-secondary">
                  <Check size={18} className="text-hide-action shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <button className="w-full py-4 rounded-hide-lg bg-hide-ghost text-hide-text-muted font-bold text-sm cursor-not-allowed">
                Get Enterprise plan
              </button>
              <div className="p-4 bg-hide-elevated rounded-hide-lg border border-hide-border-subtle">
                <div className="flex gap-2 text-[10px] text-hide-text-muted font-bold leading-relaxed uppercase tracking-widest">
                  <Info size={14} className="shrink-0" />
                  <span>A work email address is required to create an Enterprise account. <a href="#" className="text-hide-text-secondary underline">Contact sales</a> for more information.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-hide-text-disabled text-[10px] max-w-2xl mx-auto">
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
    <div className="bg-hide-canvas min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background blobs for depth — HIDE brand palette */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-hide-accent blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-hide-action blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 opacity-30" />
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
