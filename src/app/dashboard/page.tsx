'use client';
import React from 'react';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import {
  Award,
  Shield,
  Building2,
  Hotel,
  Cpu,
  Bed,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  Globe2,
  Send,
  Scale,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserProfile, AccountTier, MemberRole } from '@/types';

export default function DashboardPage() {
  // Demo active profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user-demo-1',
    full_name: 'Victor Osimhen',
    role: 'CURRENT_FOOTBALLER',
    country_of_residence: 'Turkey (TR)',
    african_heritage_country: 'Nigeria (NG)',
    favorite_football_clubs: ['Galatasaray SK', 'Arsenal FC', 'Enyimba International FC'],
    african_national_team: 'Nigeria (Super Eagles)',
    current_club: 'Galatasaray SK',
    former_clubs: 'SSC Napoli, Lille OSC, Charleroi',
    transfermarkt_url: 'https://www.transfermarkt.com/victor-osimhen/profil/spieler/401923',
    account_tier: 'LEGEND_ELITE', // Demonstrating Legend/Elite tier
    onboarding_completed: true,
    created_at: '2026-11-20T10:00:00Z',
    updated_at: '2026-11-24T12:00:00Z',
  });

  // Asset Proposals state
  const [proposals, setProposals] = useState([
    {
      id: 'prop-1',
      title: 'European 2nd Tier Football Club Acquisition',
      assetType: 'FOOTBALL_CLUB',
      country: 'Portugal / Belgium',
      estimatedScale: '€12M – €18M',
      suggestedBy: 'Victor Osimhen (Legend / Elite)',
      reviewStatus: 'Under Management Prospecting',
      description: 'Acquisition of an established Portuguese Liga 2 club with existing UEFA-certified training grounds to serve as primary gateway for African academy graduates.',
    },
    {
      id: 'prop-2',
      title: 'West African Elite Performance Academy & Sports Resort',
      assetType: 'SPORTS_HOTEL',
      country: 'Senegal / Ivory Coast',
      estimatedScale: '$8M - $10M',
      suggestedBy: 'Sadio Mané (Legend / Elite)',
      reviewStatus: 'Feasibility Review',
      description: 'Integrated 120-bed sports hotel, recovery spa, and 4 FIFA-standard pitches catering to visiting national teams and European winter camps.',
    },
    {
      id: 'prop-3',
      title: 'Athlete Accommodation Hostel & Scouting Tech Hub',
      assetType: 'ATHLETE_HOSTEL',
      country: 'Nigeria (Lagos / Abuja)',
      estimatedScale: '$3.5M',
      suggestedBy: 'Jay-Jay Okocha (Legend / Elite)',
      reviewStatus: 'Collective Consideration',
      description: 'Hostel and residency hub featuring AI video analytics and GPS performance labs for 80 young African footballers.',
    },
  ]);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newAssetType, setNewAssetType] = useState('FOOTBALL_CLUB');
  const [newCountry, setNewCountry] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const isLegend = profile.account_tier === 'LEGEND_ELITE';

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCountry || !newDescription) return;

    const newProp = {
      id: `prop-${Date.now()}`,
      title: newTitle,
      assetType: newAssetType,
      country: newCountry,
      estimatedScale: 'To be appraised',
      suggestedBy: `${profile.full_name} (${isLegend ? 'Legend / Elite' : 'Verified Member'})`,
      reviewStatus: 'Submitted for Collective Review',
      description: newDescription,
    };

    setProposals([newProp, ...proposals]);
    setNewTitle('');
    setNewCountry('');
    setNewDescription('');
    setProposalSubmitted(true);
    setTimeout(() => setProposalSubmitted(false), 4000);
  };
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('legendary_alliance_proposals_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProposals(parsed);
        }
      }
    } catch {
      // Fall back to initial seed proposals if storage is unavailable or JSON is invalid
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('legendary_alliance_proposals_v1', JSON.stringify(proposals));
    } catch {
      // Ignore storage write errors in restricted environments
    }
  }, [proposals]);

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* PROFILE HEADER & BADGE DISPLAY */}
      <div className="glass-card p-8 rounded-3xl border border-gold-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            {/* Avatar / Shield */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-600 to-amber-700 p-1 shadow-gold-glow flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                {isLegend ? (
                  <Award className="w-10 h-10 text-gold-400 animate-pulse" />
                ) : (
                  <Shield className="w-10 h-10 text-emerald-400" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {profile.full_name}
                </h1>

                {/* LEGEND / ELITE GOLD BADGE */}
                {isLegend ? (
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-wider bg-gradient-to-r from-gold-400 via-amber-400 to-gold-600 text-slate-950 shadow-gold-glow uppercase">
                    <Award className="w-4 h-4 text-slate-950" />
                    <span>Legend / Elite Status</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Member</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300">
                {profile.role.replace('_', ' ')} • Current Club:{' '}
                <span className="text-gold-400 font-semibold">{profile.current_club}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Heritage: <strong className="text-slate-200">{profile.african_heritage_country}</strong></span>
                <span>•</span>
                <span>Residence: <strong className="text-slate-200">{profile.country_of_residence}</strong></span>
                <span>•</span>
                <span>National Team: <strong className="text-slate-200">{profile.african_national_team}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Stats / Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
              href="/admin/footballers"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-gold-500/30 text-gold-300 hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
            >
              <Award className="w-4 h-4 text-gold-400" />
              <span>Admin Fast-Track Queue</span>
            </Link>
            <Link
              href="/kyc"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>KYC Verified</span>
            </Link>
          </div>
        </div>

        {/* Legend / Elite Privilege Banner */}
        {isLegend && (
          <div className="mt-6 pt-6 border-t border-gold-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gold-200/90">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>
                <strong>Legend Privilege Activated:</strong> You have priority review access for asset prospectuses, advisory board invitations, and private facility delegations.
              </span>
            </div>
            <span className="text-[11px] font-mono text-gold-400 font-bold">
              ID: LA-VIP-2026-001
            </span>
          </div>
        )}
      </div>

      {/* ASSET OPPORTUNITY PROPOSALS & SUGGESTION BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Asset Proposals Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-display text-white">
                Global Asset Review Board
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Opportunities suggested by Alliance members for collective consideration
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
              {proposals.length} Proposals Active
            </span>
          </div>

          <div className="space-y-4">
            {proposals.map((prop) => (
              <div
                key={prop.id}
                className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-gold-500/40 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20 mr-2">
                      {prop.assetType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">
                      Target: <strong className="text-slate-200">{prop.country}</strong>
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {prop.title}
                    </h3>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-gold-500/30 text-gold-300">
                    {prop.reviewStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {prop.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                  <span>Suggested by: <strong className="text-gold-300">{prop.suggestedBy}</strong></span>
                  <span>Estimated Scale: <strong className="text-white">{prop.estimatedScale}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Member Suggestion Box */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-gold-500/25 relative shadow-xl">
            <div className="flex items-center space-x-2 text-gold-400 mb-2">
              <PlusCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-display">
                Suggest an Asset for Consideration
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              As a verified member, you can recommend clubs, academies, hostels, or sports technologies to the Alliance.
            </p>

            {proposalSubmitted && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Proposal submitted to the Executive Review Board!</span>
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Asset Opportunity Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Belgian Challenger Pro League Club"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Asset Classification
                </label>
                <select
                  value={newAssetType}
                  onChange={(e) => setNewAssetType(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="FOOTBALL_CLUB">Football Club (Domestic / European)</option>
                  <option value="TRAINING_ACADEMY">Elite Training Facility / Academy</option>
                  <option value="SPORTS_HOTEL">Sports Hotel & High-Performance Resort</option>
                  <option value="ATHLETE_HOSTEL">Athlete Accommodation Hostel</option>
                  <option value="FOOTBALL_TECH">Football Performance Technology / Scouting</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Target Country / Location
                </label>
                <input
                  type="text"
                  required
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="e.g. France / Nigeria / Spain"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Strategic Rationale & Overview
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Why is this a valuable acquisition for African football empowerment? Detail facilities, player pipeline, and upside."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-slate-950 shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Alliance Management</span>
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 flex-shrink-0 text-gold-500" />
              <span>
                Suggestions do not guarantee acquisition. All deals are structured through regulated SPVs.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
