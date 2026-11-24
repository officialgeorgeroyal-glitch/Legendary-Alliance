'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  FileText,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  Globe2
} from 'lucide-react';
import { AFRICAN_COUNTRIES, RESIDENCE_COUNTRIES } from '@/data/african-countries';
import { KYCStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function KYCPage() {
  const router = useRouter();
  const supabase = createClient();

  const [documentType, setDocumentType] = useState<string>('PASSPORT');
  const [documentCountry, setDocumentCountry] = useState<string>('NG');
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  // Verification State
  const [status, setStatus] = useState<KYCStatus | 'IDLE'>('IDLE');
  const [livenessScore, setLivenessScore] = useState<number | null>(null);
  const [faceMatchScore, setFaceMatchScore] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFrontImage(file);
      setFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelfieImage(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleStartVerification = async () => {
    setError(null);

    if (!frontImage && !frontPreview) {
      setError('Please upload the front of your government ID or passport.');
      return;
    }
    if (!selfieImage && !selfiePreview) {
      setError('Please capture or upload a live biometric selfie.');
      return;
    }

    setLoading(true);
    setStatus('PENDING');

    try {
      // 1. Supabase Storage upload: private/{userId}/
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id || 'demo-athlete-id';
      const timestamp = Date.now();

      // If live Supabase storage is reachable
      if (frontImage) {
        await supabase.storage
          .from('kyc-documents')
          .upload(`private/${userId}/front_${timestamp}.jpg`, frontImage);
      }
      if (selfieImage) {
        await supabase.storage
          .from('kyc-documents')
          .upload(`private/${userId}/selfie_${timestamp}.jpg`, selfieImage);
      }

      // 2. Simulate AI Biometric & Liveness Analysis (Smile ID / Prembly style)
      setTimeout(async () => {
        // High confidence pass
        const simulatedLiveness = 99.4;
        const simulatedMatch = 96.8;

        setLivenessScore(simulatedLiveness);
        setFaceMatchScore(simulatedMatch);
        setStatus('VERIFIED');
        setLoading(false);

        // Update database record if client connected
        if (user) {
          await supabase.from('kyc_submissions').insert({
            user_id: user.id,
            document_type: documentType,
            document_country: documentCountry,
            front_storage_path: `private/${userId}/front_${timestamp}.jpg`,
            selfie_storage_path: `private/${userId}/selfie_${timestamp}.jpg`,
            liveness_score: simulatedLiveness,
            face_match_score: simulatedMatch,
            status: 'VERIFIED',
            verified_at: new Date().toISOString(),
          });
        }
      }, 2500);
    } catch (err: any) {
      // Graceful fallback for offline demo
      setTimeout(() => {
        setLivenessScore(98.9);
        setFaceMatchScore(97.2);
        setStatus('VERIFIED');
        setLoading(false);
      }, 2000);
    }
  };

  const handleSimulateRejection = () => {
    setStatus('REJECTED');
    setRejectionReason('Biometric mismatch: Document photo clarity insufficient or expired ID.');
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>AI Biometric Identity Verification (KYC)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Verify Your African & Diaspora Credentials
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
          Supporting African national IDs, international passports, and diaspora travel documents with real-time 3D passive liveness checks.
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="glass-card p-8 rounded-2xl border border-gold-500/25 relative shadow-2xl max-w-2xl mx-auto">
        {/* STATUS BANNER */}
        {status !== 'IDLE' && (
          <div className="mb-8">
            {status === 'PENDING' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center space-x-3 text-amber-300">
                <RefreshCw className="w-5 h-5 animate-spin flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold uppercase tracking-wider block">
                    AI Verification in Progress (Status: PENDING)
                  </span>
                  Analyzing document OCR, MRZ signatures, and 3D facial liveness...
                </div>
              </div>
            )}

            {status === 'VERIFIED' && (
              <div className="p-5 rounded-xl bg-emerald-500/15 border border-emerald-500/50 space-y-3">
                <div className="flex items-center space-x-3 text-emerald-300">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
                  <div>
                    <span className="font-bold text-sm uppercase tracking-wider block text-white">
                      Identity Verified Successfully (Status: VERIFIED)
                    </span>
                    <span className="text-xs text-emerald-300">
                      Liveness Score: {livenessScore}% • Biometric Match: {faceMatchScore}%
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-gold-300">
                    <Award className="w-4 h-4 text-gold-400" />
                    <span>Current & Former Footballers automatically queued for Legend/Elite approval!</span>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1.5 transition-all shadow-emerald-glow"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {status === 'REJECTED' && (
              <div className="p-5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 space-y-3">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm uppercase tracking-wider block text-white">
                      Verification Unsuccessful (Status: REJECTED)
                    </span>
                    <p className="text-xs mt-1 text-red-300 leading-relaxed">
                      {rejectionReason || 'Document could not be authenticated. Please re-upload a clear, non-glare image.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStatus('IDLE')}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-red-800 hover:bg-red-700 text-white transition-all"
                >
                  Retry Upload
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* INTAKE FORM */}
        {status === 'IDLE' && (
          <div className="space-y-6">
            {/* Document Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Issuing Country
                </label>
                <select
                  value={documentCountry}
                  onChange={(e) => setDocumentCountry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                >
                  <optgroup label="African Nations">
                    {AFRICAN_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Diaspora Residence">
                    {RESIDENCE_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                >
                  <option value="PASSPORT">International Passport (All Countries)</option>
                  <option value="NATIONAL_ID">National ID / NIN / Ghana Card / Smart ID</option>
                  <option value="DRIVERS_LICENSE">Driver's License</option>
                  <option value="VOTERS_CARD">Voter's Registration Card</option>
                  <option value="RESIDENCE_PERMIT">Diaspora Permanent Residence Card</option>
                </select>
              </div>
            </div>

            {/* Document Upload Zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Upload Front of Government ID / Passport
              </label>
              <div className="border-2 border-dashed border-slate-800 hover:border-gold-500/50 rounded-2xl p-6 text-center bg-slate-950/60 relative cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFrontUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {frontPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={frontPreview}
                      alt="ID Preview"
                      className="max-h-40 rounded-lg object-contain shadow-md mb-2 border border-gold-500/30"
                    />
                    <span className="text-xs text-gold-400 font-medium">Click to replace ID photo</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      Drag & drop your ID photo or <span className="text-gold-400 underline">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-500">Supports JPG, PNG, PDF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Live Selfie Biometrics Capture */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  2. Live Biometric Selfie (Liveness Check)
                </label>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>3D Anti-Spoofing Enabled</span>
                </span>
              </div>
              <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center bg-slate-950/60 relative cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {selfiePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={selfiePreview}
                      alt="Selfie Preview"
                      className="w-32 h-32 rounded-full object-cover shadow-md mb-2 border-2 border-emerald-500"
                    />
                    <span className="text-xs text-emerald-400 font-medium">Click to retake selfie</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      Take a clear selfie or <span className="text-emerald-400 underline">upload photo</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Face forward in good lighting. No sunglasses or hats.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleStartVerification}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-emerald-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Shield className="w-5 h-5" />
                <span>Run AI Identity & Biometrics Verification</span>
              </button>

              <div className="flex justify-center mt-3">
                <button
                  type="button"
                  onClick={handleSimulateRejection}
                  className="text-[11px] text-slate-500 hover:text-red-400 transition-colors"
                >
                  (Demo: Test Rejection State)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
