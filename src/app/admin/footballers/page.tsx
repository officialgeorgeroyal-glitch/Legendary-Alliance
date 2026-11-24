'use client';

import React, { useState } from 'react';
import {
  Award,
  Shield,
  CheckCircle2,
  ExternalLink,
  Clock,
  UserCheck,
  AlertCircle,
  Search,
  Filter,
  Sparkles,
  Building,
  Flag
} from 'lucide-react';
import { FootballerVerification, MemberRole } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface CandidateAthlete {
  id: string;
  userId: string;
  fullName: string;
  role: MemberRole;
  heritageCountry: string;
  residenceCountry: string;
  currentClub?: string;
  formerClubs?: string;
  transfermarktUrl?: string;
  kycStatus: 'VERIFIED';
  livenessScore: number;
  eligibilityStatus: 'ELIGIBLE' | 'APPROVED' | 'REJECTED';
  awardedAt?: string;
}

export default function FootballerAdminPanel() {
  const supabase = createClient();

  const [candidates, setCandidates] = useState<CandidateAthlete[]>([
    {
      id: 'cand-1',
      userId: 'usr-101',
      fullName: 'Victor Osimhen',
      role: 'CURRENT_FOOTBALLER',
      heritageCountry: 'Nigeria (NG)',
      residenceCountry: 'Turkey (TR)',
      currentClub: 'Galatasaray SK (on loan from SSC Napoli)',
      formerClubs: 'Lille OSC, VfL Wolfsburg, Charleroi',
      transfermarktUrl: 'https://www.transfermarkt.com/victor-osimhen/profil/spieler/401923',
      kycStatus: 'VERIFIED',
      livenessScore: 99.4,
      eligibilityStatus: 'ELIGIBLE',
    },
    {
      id: 'cand-2',
      userId: 'usr-102',
      fullName: 'Jay-Jay Okocha',
      role: 'FORMER_FOOTBALLER',
      heritageCountry: 'Nigeria (NG)',
      residenceCountry: 'United Kingdom (GB)',
      currentClub: 'Retired Veteran Icon',
      formerClubs: 'Paris Saint-Germain, Bolton Wanderers, Eintracht Frankfurt, Fenerbahçe',
      transfermarktUrl: 'https://www.transfermarkt.com/jay-jay-okocha/profil/spieler/3708',
      kycStatus: 'VERIFIED',
      livenessScore: 98.9,
      eligibilityStatus: 'ELIGIBLE',
    },
    {
      id: 'cand-3',
      userId: 'usr-103',
      fullName: 'Sadio Mané',
      role: 'CURRENT_FOOTBALLER',
      heritageCountry: 'Senegal (SN)',
      residenceCountry: 'Saudi Arabia (SA)',
      currentClub: 'Al-Nassr FC',
      formerClubs: 'Liverpool FC, Bayern Munich, Southampton FC, Red Bull Salzburg',
      transfermarktUrl: 'https://www.transfermarkt.com/sadio-mane/profil/spieler/204051',
      kycStatus: 'VERIFIED',
      livenessScore: 99.1,
      eligibilityStatus: 'APPROVED',
      awardedAt: '2026-11-20T10:30:00Z',
    },
  ]);

  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [selectedNotes, setSelectedNotes] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApproveLegend = async (candidateId: string, athleteName: string) => {
    // 1. Update candidate state
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              eligibilityStatus: 'APPROVED',
              awardedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setSuccessMessage(`Official "Legend / Elite" status successfully conferred to ${athleteName}!`);
    setTimeout(() => setSuccessMessage(null), 4000);

    // Call Supabase function if available
    try {
      const candidate = candidates.find((c) => c.id === candidateId);
      if (candidate) {
        await supabase.rpc('approve_footballer_legend', {
          target_user_id: candidate.userId,
          notes_input: selectedNotes[candidateId] || 'Approved via Admin Fast-Track Panel',
        });
      }
    } catch (e) {
      // Local state already updated
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    if (filterRole === 'ALL') return true;
    return c.role === filterRole;
  });

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Executive Concierge & Admin Review</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white">
            Legend / Elite Athlete Fast-Track Panel
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Hybrid verification queue: Active & veteran African footballers with verified KYC biometrics eligible for official "Legend / Elite" VIP status.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilterRole('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterRole === 'ALL' ? 'bg-gold-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Athletes
            </button>
            <button
              onClick={() => setFilterRole('CURRENT_FOOTBALLER')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterRole === 'CURRENT_FOOTBALLER'
                  ? 'bg-gold-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Pros
            </button>
            <button
              onClick={() => setFilterRole('FORMER_FOOTBALLER')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterRole === 'FORMER_FOOTBALLER'
                  ? 'bg-gold-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Veterans & Legends
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-3 shadow-emerald-glow animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Athletes List */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate) => {
          const isApproved = candidate.eligibilityStatus === 'APPROVED';

          return (
            <div
              key={candidate.id}
              className={`glass-card p-6 rounded-2xl border transition-all ${
                isApproved
                  ? 'border-gold-500/50 bg-gradient-to-r from-gold-950/20 via-slate-900/80 to-slate-900 shadow-gold-glow'
                  : 'border-slate-800 hover:border-gold-500/30'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Dossier */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-white font-display">
                      {candidate.fullName}
                    </h3>

                    {/* Role Badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                        candidate.role === 'CURRENT_FOOTBALLER'
                          ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {candidate.role === 'CURRENT_FOOTBALLER' ? 'Current Footballer' : 'Former Footballer'}
                    </span>

                    {/* KYC Verified Chip */}
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>KYC Verified ({candidate.livenessScore}%)</span>
                    </span>

                    {/* Official Legend Badge if approved */}
                    {isApproved && (
                      <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-gold-400 to-amber-500 px-3 py-1 rounded-full shadow-gold-glow">
                        <Award className="w-3.5 h-3.5" />
                        <span>LEGEND / ELITE</span>
                      </span>
                    )}
                  </div>

                  {/* Career & Heritage Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        Heritage & Residence
                      </span>
                      <span>{candidate.heritageCountry} • Resides in {candidate.residenceCountry}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        Club Context
                      </span>
                      <span className="truncate block font-medium text-gold-300">
                        {candidate.currentClub || 'Veteran Alumnus'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        Career Roster
                      </span>
                      <span className="truncate block text-slate-400">
                        {candidate.formerClubs}
                      </span>
                    </div>
                  </div>

                  {/* External Reference */}
                  {candidate.transfermarktUrl && (
                    <div className="pt-1">
                      <a
                        href={candidate.transfermarktUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs text-gold-400 hover:text-gold-300 hover:underline font-mono"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect Transfermarkt Pro Dossier</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Right Action Block */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-center gap-3 min-w-[200px]">
                  {isApproved ? (
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Conferred & Active</span>
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Awarded: {new Date(candidate.awardedAt || '').toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApproveLegend(candidate.id, candidate.fullName)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-slate-950 shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Approve Legend / Elite</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
