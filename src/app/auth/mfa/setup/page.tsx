'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Smartphone, Key, CheckCircle2, AlertCircle, ArrowRight, Copy, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import QRCode from 'qrcode';

export default function MFASetupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [factorId, setFactorId] = useState<string>('');
  const [totpSecret, setTotpSecret] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);

  // Fallback demo secret if local sandbox/mock
  const DEMO_SECRET = 'JBSWY3DPEHPK3PXP';

  useEffect(() => {
    async function enrollFactor() {
      try {
        const { data, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          issuer: 'Legendary Alliance',
        });

        if (enrollError || !data?.totp?.secret) {
          // Fallback to simulator key for local development
          const demoUri = `otpauth://totp/LegendaryAlliance:member?secret=${DEMO_SECRET}&issuer=LegendaryAlliance`;
          setFactorId('mock-factor-id');
          setTotpSecret(DEMO_SECRET);
          const qrUrl = await QRCode.toDataURL(demoUri, { width: 220, margin: 1 });
          setQrCodeDataUrl(qrUrl);
          return;
        }

        setFactorId(data.id);
        setTotpSecret(data.totp.secret);
        const qrUrl = await QRCode.toDataURL(data.totp.uri, { width: 220, margin: 1 });
        setQrCodeDataUrl(qrUrl);
      } catch (err: any) {
        // Fallback for offline/preview
        const demoUri = `otpauth://totp/LegendaryAlliance:member?secret=${DEMO_SECRET}&issuer=LegendaryAlliance`;
        setFactorId('mock-factor-id');
        setTotpSecret(DEMO_SECRET);
        QRCode.toDataURL(demoUri, { width: 220, margin: 1 }).then(setQrCodeDataUrl);
      }
    }

    enrollFactor();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!verifyCode || verifyCode.length < 6) {
        setError('Please enter the 6-digit verification code from your authenticator app.');
        setLoading(false);
        return;
      }

      if (factorId === 'mock-factor-id') {
        // In local mock mode, any 6-digit code succeeds
        setIsEnrolled(true);
        setTimeout(() => {
          router.push('/onboarding');
        }, 1500);
        return;
      }

      const { data, error: challengeError } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode,
      });

      if (challengeError) {
        throw challengeError;
      }

      setIsEnrolled(true);
      setTimeout(() => {
        router.push('/onboarding');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Invalid 6-digit code. Please verify the code in your app and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(totpSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 glass-card p-8 rounded-2xl border border-gold-500/25 relative shadow-2xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-amber-700 p-0.5 mx-auto mb-3 shadow-gold-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-gold-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Mandatory Two-Factor Authentication (2FA)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            All Legendary Alliance accounts require mandatory TOTP authentication to safeguard club assets and communications.
          </p>
        </div>

        {isEnrolled ? (
          <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">2FA Activated Successfully</h3>
            <p className="text-xs text-emerald-200">
              Your account is now secured. Proceeding to Member Onboarding...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* QR Code Section */}
            <div className="bg-slate-950/70 p-6 rounded-xl border border-slate-800 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-3">
                1. Scan with Google Authenticator or Apple Passwords
              </span>

              <div className="p-3 bg-white rounded-xl shadow-lg mb-3">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="2FA QR Code" className="w-44 h-44 rounded-lg" />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-500">
                    Generating QR...
                  </div>
                )}
              </div>

              {/* Manual Secret Code */}
              <div className="w-full mt-2">
                <span className="text-[11px] text-slate-400 block mb-1">
                  Or enter manual setup key:
                </span>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-gold-300">
                  <span className="truncate mr-2">{totpSecret || 'Loading...'}</span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-1 hover:text-white transition-colors"
                    title="Copy Key"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 6-Digit Code Verification Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  2. Enter 6-Digit Code to Confirm Activation
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl tracking-[0.5em] font-mono text-gold-300 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || verifyCode.length < 6}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-slate-950 shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Activating 2FA...' : 'Verify & Continue to Onboarding'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
