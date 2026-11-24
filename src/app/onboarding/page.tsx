'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Award,
  Globe2,
  Heart,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';
import { AFRICAN_COUNTRIES, RESIDENCE_COUNTRIES } from '@/data/african-countries';
import { POPULAR_AFRICAN_CLUBS, POPULAR_GLOBAL_CLUBS, AFRICAN_NATIONAL_TEAMS } from '@/data/football-clubs';
import { MemberRole } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [role, setRole] = useState<MemberRole>('ENTHUSIAST');
  const [countryOfResidence, setCountryOfResidence] = useState<string>('GB');
  const [africanHeritageCountry, setAfricanHeritageCountry] = useState<string>('NG');
  const [africanNationalTeam, setAfricanNationalTeam] = useState<string>('Nigeria');
  const [favoriteClubs, setFavoriteClubs] = useState<string[]>(['Arsenal FC', 'Enyimba International FC']);
  const [currentClub, setCurrentClub] = useState<string>('');
  const [formerClubs, setFormerClubs] = useState<string>('');
  const [transfermarktUrl, setTransfermarktUrl] = useState<string>('');

  const isAthlete = role === 'CURRENT_FOOTBALLER' || role === 'FORMER_FOOTBALLER';
  const totalSteps = isAthlete ? 4 : 3;

  const toggleClub = (clubName: string) => {
    if (favoriteClubs.includes(clubName)) {
      setFavoriteClubs(favoriteClubs.filter((c) => c !== clubName));
    } else {
      if (favoriteClubs.length < 5) {
        setFavoriteClubs([...favoriteClubs, clubName]);
      }
    }
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && !role) {
      setError('Please select your member role.');
      return;
    }
    if (step === 2 && (!countryOfResidence || !africanHeritageCountry)) {
      setError('Please specify both your country of residence and your African heritage.');
      return;
    }
    if (step === 3 && (!africanNationalTeam || favoriteClubs.length === 0)) {
      setError('Please select your African national team and at least one favorite club.');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmitProfile();
    }
  };

  const handleSubmitProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const profilePayload = {
        role,
        country_of_residence: countryOfResidence,
        african_heritage_country: africanHeritageCountry,
        african_national_team: africanNationalTeam,
        favorite_football_clubs: favoriteClubs,
        current_club: isAthlete ? currentClub : null,
        former_clubs: isAthlete ? formerClubs : null,
        transfermarkt_url: isAthlete ? transfermarktUrl : null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };

      if (user) {
        const { error: upsertError } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', user.id);

        if (upsertError && !upsertError.message.includes('placeholder')) {
          throw upsertError;
        }
      }

      // Proceed immediately to AI Identity Verification (KYC)
      router.push('/kyc');
    } catch (err: any) {
      // Fallback for preview mode
      router.push('/kyc');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step {step} of {totalSteps}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Complete Your Alliance Profile
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          Tailoring your experience across the African continent and diaspora football network.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-center space-x-3 mb-10">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-gold-500 text-slate-950 ring-4 ring-gold-500/20 shadow-gold-glow'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < totalSteps && (
                <div
                  className={`w-12 h-1 mx-2 rounded-full transition-all ${
                    isDone ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5 max-w-2xl mx-auto">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Container Card */}
      <div className="glass-card p-8 rounded-2xl border border-gold-500/25 relative shadow-2xl max-w-2xl mx-auto">
        {/* STEP 1: MEMBER ROLE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display mb-1">
                Select Your Member Role
              </h2>
              <p className="text-xs text-slate-400">
                Choose the role that best defines your connection to African football.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Current Footballer */}
              <div
                onClick={() => setRole('CURRENT_FOOTBALLER')}
                className={`p-5 rounded-xl border flex items-start space-x-4 cursor-pointer transition-all ${
                  role === 'CURRENT_FOOTBALLER'
                    ? 'bg-gold-500/15 border-gold-500 shadow-gold-glow text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    role === 'CURRENT_FOOTBALLER'
                      ? 'bg-gold-500 text-slate-950'
                      : 'bg-slate-800 text-gold-400'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">Current Footballer</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-gold-500/20 text-gold-300">
                      Eligible for Legend/Elite
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Active professional or semi-professional player in top domestic or international leagues.
                  </p>
                </div>
              </div>

              {/* Former Footballer */}
              <div
                onClick={() => setRole('FORMER_FOOTBALLER')}
                className={`p-5 rounded-xl border flex items-start space-x-4 cursor-pointer transition-all ${
                  role === 'FORMER_FOOTBALLER'
                    ? 'bg-gold-500/15 border-gold-500 shadow-gold-glow text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    role === 'FORMER_FOOTBALLER'
                      ? 'bg-gold-500 text-slate-950'
                      : 'bg-slate-800 text-emerald-400'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">Former Footballer</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Eligible for Legend/Elite
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Retired professional athlete, veteran national team star, or seasoned sports alumnus.
                  </p>
                </div>
              </div>

              {/* Enthusiast */}
              <div
                onClick={() => setRole('ENTHUSIAST')}
                className={`p-5 rounded-xl border flex items-start space-x-4 cursor-pointer transition-all ${
                  role === 'ENTHUSIAST'
                    ? 'bg-gold-500/15 border-gold-500 shadow-gold-glow text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    role === 'ENTHUSIAST'
                      ? 'bg-gold-500 text-slate-950'
                      : 'bg-slate-800 text-blue-400'
                  }`}
                >
                  <Globe2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">Football Enthusiast</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      Alliance Member
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Investor, entrepreneur, diaspora professional, or devoted supporter of African football excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: RESIDENCE & AFRICAN HERITAGE */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display mb-1">
                Geographic & Ancestral Roots
              </h2>
              <p className="text-xs text-slate-400">
                Bridging your country of daily residence with your African origin or diaspora heritage.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Country of Current Residence
                </label>
                <select
                  value={countryOfResidence}
                  onChange={(e) => setCountryOfResidence(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                >
                  {RESIDENCE_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  African Heritage / Origin Country
                </label>
                <select
                  value={africanHeritageCountry}
                  onChange={(e) => setAfricanHeritageCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} • {c.region}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Supports all 54 African nations plus Afro-Caribbean and global diaspora heritage.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FOOTBALL ALLEGIANCE */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display mb-1">
                Football Passions & Allegiances
              </h2>
              <p className="text-xs text-slate-400">
                Select your beloved African national team and favorite clubs.
              </p>
            </div>

            <div className="space-y-5">
              {/* National Team */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  African National Team Supported
                </label>
                <select
                  value={africanNationalTeam}
                  onChange={(e) => setAfricanNationalTeam(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                >
                  {AFRICAN_NATIONAL_TEAMS.map((team) => (
                    <option key={team.name} value={team.name}>
                      {team.name} ({team.nickname})
                    </option>
                  ))}
                </select>
              </div>

              {/* Favorite Football Clubs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Favorite Football Clubs (Select up to 5)
                  </label>
                  <span className="text-[11px] text-gold-400 font-mono">
                    {favoriteClubs.length}/5 selected
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    African Powerhouses
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_AFRICAN_CLUBS.slice(0, 10).map((club) => {
                      const isSelected = favoriteClubs.includes(club.name);
                      return (
                        <button
                          key={club.id}
                          type="button"
                          onClick={() => toggleClub(club.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-gold-500 text-slate-950 font-bold shadow-gold-glow'
                              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {club.name}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider pt-2">
                    Global / European Leagues
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_GLOBAL_CLUBS.slice(0, 8).map((club) => {
                      const isSelected = favoriteClubs.includes(club.name);
                      return (
                        <button
                          key={club.id}
                          type="button"
                          onClick={() => toggleClub(club.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-gold-500 text-slate-950 font-bold shadow-gold-glow'
                              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {club.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ATHLETE CAREER DOSSIER (ATHLETES ONLY) */}
        {step === 4 && isAthlete && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs text-gold-400 font-semibold bg-gold-950/40 px-2.5 py-1 rounded-md mb-2">
                <Award className="w-4 h-4" />
                <span>Legend / Elite Fast-Track Dossier</span>
              </div>
              <h2 className="text-xl font-bold text-white font-display mb-1">
                Professional Playing Career
              </h2>
              <p className="text-xs text-slate-400">
                Provide your club details for our athlete concierge and verification council.
              </p>
            </div>

            <div className="space-y-4">
              {role === 'CURRENT_FOOTBALLER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Playing Club
                  </label>
                  <input
                    type="text"
                    value={currentClub}
                    onChange={(e) => setCurrentClub(e.target.value)}
                    placeholder="e.g. Galatasaray SK / Al-Ahli / Villarreal"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {role === 'CURRENT_FOOTBALLER' ? 'Previous Professional Clubs' : 'Career Clubs & National Team Caps'}
                </label>
                <input
                  type="text"
                  value={formerClubs}
                  onChange={(e) => setFormerClubs(e.target.value)}
                  placeholder="e.g. Chelsea FC, Marseille, Ivory Coast National Team"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Transfermarkt / Wikipedia Reference Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={transfermarktUrl}
                    onChange={(e) => setTransfermarktUrl(e.target.value)}
                    placeholder="https://www.transfermarkt.com/player/profil/spieler/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Used by our Admin council to rapidly confer "Legend / Elite" status upon KYC pass.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-slate-950 shadow-gold-glow hover:brightness-110 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <span>
              {step === totalSteps
                ? loading
                  ? 'Saving Profile...'
                  : 'Complete & Proceed to KYC'
                : 'Continue'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
