import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Zap, CreditCard, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="w-full flex flex-col gap-24 pb-12">
      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-20 fade-in-up flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl rounded-full opacity-50 -z-10 transform scale-150 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Elevate Your Experience
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-['Outfit'] leading-tight">
            Premium Services, <br/>
            <span className="gradient-text drop-shadow-[0_0_30px_rgba(148,188,255,0.4)]">Booked in Seconds</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover a curated network of top-tier professionals. Seamless booking, secure payments, and exceptional quality for your most important needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Link to="/services" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Browse Services
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            {!user && (
              <Link to="/register" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative w-full z-10 fade-in-up delay-100 flex flex-col items-center">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-['Outfit'] mb-6">
            The <span className="gradient-text-gold drop-shadow-[0_0_20px_rgba(245,200,66,0.3)]">Gold Standard</span>
          </h2>
          <p className="text-gray-400 text-lg">Why discerning clients choose ServiceHub for their professional needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative">
          {/* Decorative line behind cards */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -z-10"></div>

          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Lightning Fast',
              desc: 'Our streamlined interface lets you secure your booking in under 60 seconds.',
              glow: 'rgba(59,130,246,0.15)'
            },
            {
              icon: <CreditCard className="w-8 h-8" />,
              title: 'Bank-Grade Security',
              desc: 'Transactions are protected by state-of-the-art Stripe encryption.',
              glow: 'rgba(139,92,246,0.15)'
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: 'Vetted Quality',
              desc: 'Every service provider is rigorously screened to ensure excellence.',
              glow: 'rgba(234,179,8,0.15)'
            },
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 md:p-10 text-center flex flex-col items-center group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg transform group-hover:scale-110 transition-transform duration-300 mx-auto"
                  style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), transparent), ${feature.glow}`, border: '1px solid rgba(255,255,255,0.1)' }}
               >
                 {feature.icon}
               </div>
               <h3 className="text-xl font-bold mb-4 font-['Outfit'] text-white group-hover:text-blue-300 transition-colors">{feature.title}</h3>
               <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full fade-in-up delay-200 relative">
        <div className="glass-card w-full overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 backdrop-blur-sm"></div>
          
          <div className="relative p-12 md:p-20 flex flex-col items-center text-center z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-['Outfit'] text-white drop-shadow-md">
              Ready to <span className="text-blue-300">Transform</span> Your Workflow?
            </h2>
            
            {user ? (
              <div className="mt-8">
                <Link to="/services" className="btn-primary text-lg px-10 py-4 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                  Explore Services Now
                </Link>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center w-full">
                <p className="text-blue-100/80 mb-10 text-lg max-w-xl text-center">
                  Join thousands of professionals who have upgraded their service booking experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                  <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-[0_0_30px_rgba(139,92,246,0.4)] w-full sm:w-auto">
                    Create Free Account
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg bg-black/40 border-white/20 text-white hover:bg-white/10 px-10 py-4 w-full sm:w-auto">
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
