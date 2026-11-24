import Link from 'next/link';
import {
  Shield,
  Award,
  Globe2,
  Building2,
  Cpu,
  Bed,
  Hotel,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  Users
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-950 via-background to-slate-950">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-950/60 border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-8 shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Pan-African & Diaspora Football Promotional Club</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display mb-6 leading-tight">
            Uniting African Football Royalty to <span className="gold-gradient-text">Steward Global Assets</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Bringing together current African footballers, former legends, and visionary diaspora enthusiasts to pool influence, network, and prospect premium football assets across the globe.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-slate-950 font-bold text-base shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <span>Join Legendary Alliance</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 border border-gold-500/30 text-slate-200 font-semibold text-base hover:bg-slate-800 hover:border-gold-500/60 transition-all flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5 text-gold-400" />
              <span>Explore Member Onboarding</span>
            </Link>
          </div>

          {/* Core Member Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-2xl border border-gold-500/20 relative overflow-hidden group hover:border-gold-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-4 text-gold-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Current Footballers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Active stars playing in Europe, Africa, the Americas, and Asia. Immediate access to our fast-track Legend/Elite council.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-gold-500/20 relative overflow-hidden group hover:border-gold-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Former Footballers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Retired legends and national icons providing strategic counsel, academy oversight, and legacy building.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-gold-500/20 relative overflow-hidden group hover:border-gold-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4 text-blue-400">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Diaspora Enthusiasts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Executives, founders, and passionate diaspora supporters of African heritage driving global sports ownership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Asset Classes Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 border-y border-gold-500/15 bg-slate-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
              Strategic Asset Classes for <span className="gold-gradient-text">Collective Consideration</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Members suggest opportunities for collective review, while Alliance management and specialized corporate vehicles prospect and execute acquisitions worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-gold-500/40 transition-all">
              <div className="p-3 bg-gold-500/10 rounded-xl text-gold-400 w-fit mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Global Football Clubs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                European, African, and emerging market football clubs with established youth pipelines and commercial brand upside.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-gold-500/40 transition-all">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">High-Performance Academies</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                State-of-the-art training facilities across Sub-Saharan Africa and Europe to nurture next-generation talent.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-gold-500/40 transition-all">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 w-fit mb-4">
                <Hotel className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sports Resorts & Hotels</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bespoke sports hospitality and training camp retreats catering to international teams and pre-season camps.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-gold-500/40 transition-all">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 w-fit mb-4">
                <Bed className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Athlete Accommodation Hostels</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Secure, modern residential hostels supporting trialists, youth athletes, and sports education scholars.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-gold-500/40 transition-all">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 w-fit mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Football & Sports Tech</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI analytics, GPS tracking, video scouting platforms, and recovery technologies optimized for African talent.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-950/30 to-slate-900 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-gold-500/20 rounded-xl text-gold-400 w-fit mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Member Suggestion Box</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Every verified member can formally submit high-potential assets to the Alliance Advisory Board.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-gold-400 flex items-center space-x-1.5 hover:text-gold-300"
              >
                <span>Submit Asset Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Verification Pipeline Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold font-display text-white mb-4">
              Institutional-Grade Security & Verification
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Our 5-tier architecture protects the exclusivity, privacy, and regulatory integrity of the Alliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white mb-2">Mandatory TOTP 2FA</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enforced two-factor authentication via Google Authenticator or Apple Keychain with encrypted backup codes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white mb-2">AI-Backed KYC Biometrics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Broad African National ID and global passport verification paired with live passive 3D facial liveness detection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white mb-2">Hybrid Legend / Elite Flow</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated eligibility upon KYC pass, fast-tracked through our dedicated athlete concierge and admin approval portal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
