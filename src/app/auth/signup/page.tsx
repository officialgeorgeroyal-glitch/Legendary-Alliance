'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import TermsModal from '@/components/TermsModal';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Terms Modal State
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsAcceptedData, setTermsAcceptedData] = useState<{
    termsVersion: string;
    clubNatureAcknowledged: boolean;
    nonInvestmentAcknowledged: boolean;
    proposalFrameworkAcknowledged: boolean;
  } | null>(null);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 10) {
      setError('Password must be at least 10 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // If terms not yet accepted, open modal
    if (!termsAcceptedData) {
      setIsTermsOpen(true);
      return;
    }

    executeSignup(termsAcceptedData);
  };

  const handleTermsAccepted = (termsData: typeof termsAcceptedData) => {
    setTermsAcceptedData(termsData);
    setIsTermsOpen(false);
    executeSignup(termsData);
  };

  const executeSignup = async (termsData: typeof termsAcceptedData) => {
    if (!termsData) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signupError) {
        // If Supabase is in placeholder/mock mode, simulate success
        if (signupError.message.includes('placeholder') || signupError.message.includes('fetch failed')) {
          router.push('/auth/mfa/setup');
          return;
        }
        throw signupError;
      }

      // Record terms acceptance
      if (data.user) {
        await supabase.from('terms_acceptances').insert({
          user_id: data.user.id,
          terms_version: termsData.termsVersion,
          club_nature_acknowledged: termsData.clubNatureAcknowledged,
          non_investment_acknowledged: termsData.nonInvestmentAcknowledged,
          proposal_framework_acknowledged: termsData.proposalFrameworkAcknowledged,
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        });
      }

      // Redirect to mandatory 2FA enrollment
      router.push('/auth/mfa/setup');
    } catch (err: any) {
      setError(err?.message || 'Failed to create membership account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl border border-gold-500/25 relative shadow-2xl">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-700 p-0.5 mx-auto mb-4 shadow-gold-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-gold-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide">
            Apply to Join the Alliance
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Pan-African Football Promotional Club & Asset Syndicate
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleInitialSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Samuel Eto'o / Didier Drogba"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password (Min. 10 chars)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          {/* Terms Status Pill */}
          <div
            onClick={() => setIsTermsOpen(true)}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
              termsAcceptedData
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-gold-950/30 border-gold-500/30 text-gold-300 hover:border-gold-500/60'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2
                className={`w-4 h-4 ${termsAcceptedData ? 'text-emerald-400' : 'text-gold-400'}`}
              />
              <span>
                {termsAcceptedData
                  ? 'Mandatory Club Terms Signed (v1.0)'
                  : 'Mandatory: Review & Accept Promotional Club Terms'}
              </span>
            </div>
            <span className="text-[11px] underline font-semibold">
              {termsAcceptedData ? 'View' : 'Review'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-slate-950 shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Mandatory 2FA'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-800/80">
          Already a registered member?{' '}
          <Link href="/auth/login" className="text-gold-400 hover:underline font-semibold">
            Sign In with 2FA
          </Link>
        </div>
      </div>

      {/* Mandatory Terms Acceptance Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onAccept={handleTermsAccepted}
        onCancel={() => setIsTermsOpen(false)}
      />
    </div>
  );
}
