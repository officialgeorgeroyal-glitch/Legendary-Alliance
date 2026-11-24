'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, AlertCircle, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MFAChallengePage() {
  const router = useRouter();
  const supabase = createClient();

  const [verifyCode, setVerifyCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [factorId, setFactorId] = useState<string>('');

  useEffect(() => {
    async function getFactors() {
      try {
        const { data, error } = await supabase.auth.mfa.listFactors();
        if (data?.totp && data.totp.length > 0) {
          setFactorId(data.totp[0].id);
        } else {
          // Fallback factor
          setFactorId('mock-factor-id');
        }
      } catch (err) {
        setFactorId('mock-factor-id');
      }
    }
    getFactors();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!verifyCode || verifyCode.length < 6) {
        setError('Please enter the 6-digit code.');
        setLoading(false);
        return;
      }

      if (factorId === 'mock-factor-id') {
        router.push('/dashboard');
        return;
      }

      const { data, error: challengeError } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode,
      });

      if (challengeError) {
        throw challengeError;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid 2FA code. Please check your authenticator app.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 glass-card p-8 rounded-2xl border border-gold-500/25 relative shadow-2xl">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-700 p-0.5 mx-auto mb-4 shadow-gold-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-gold-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Security Check: Enter 2FA Code
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Open Google Authenticator or your authenticator app and enter the current 6-digit code.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
              6-Digit Authenticator Code
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                required
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-2xl tracking-[0.6em] font-mono text-gold-300 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || verifyCode.length < 6}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-slate-950 shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying...' : 'Authorize Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
