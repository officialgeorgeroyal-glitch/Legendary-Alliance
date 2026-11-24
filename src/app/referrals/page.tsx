'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  Sparkles,
  TrendingUp,
  Share2,
  Crown,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { getMemberReferrals, getScoutLeaderboard } from '@/lib/services/referral-service';
import { MemberReferral, ReferralStatus } from '@/types';

const STATUS_CONFIG: Record<
  ReferralStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  QUALIFIED: {
    label: 'Qualified — +500 pts Awarded',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30',
  },
  PENDING_KYC: {
    label: 'Pending KYC Verification',
    icon: <Clock className="w-3.5 h-3.5" />,
    className: 'text-amber-300 bg-amber-950/40 border-amber-500/30',
  },
  REWARDED: {
    label: 'Reward Issued',
    icon: <Award className="w-3.5 h-3.5" />,
    className: 'text-gold-300 bg-gold-950/40 border-gold-500/30',
  },
  INELIGIBLE: {
    label: 'Ineligible',
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: 'text-slate-400 bg-slate-900 border-slate-700',
  },
};

const ROLE_LABELS = {
  CURRENT_FOOTBALLER: 'Current Footballer',
  FORMER_FOOTBALLER: 'Former Footballer',
  ENTHUSIAST: 'Enthusiast / Diaspora',
};

export default function ReferralsPage() {
  const DEMO_USER_ID = 'usr-demo-1';

  const [referralCode, setReferralCode] = useState<string>('LA-VICTOR-77');
  const [referrals, setReferrals] = useState<MemberReferral[]>([]);
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalSignups: 0,
    qualifiedCount: 0,
    totalPointsEarned: 0,
  });
  const [leaderboard, setLeaderboard] = useState<
    { rank: number; name: string; role: string; country: string; qualifiedCount: number; tier: string }[]
  >([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const referralLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/signup?ref=${referralCode}`
      : `https://legendaryalliance.com/auth/signup?ref=${referralCode}`;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [data, board] = await Promise.all([
        getMemberReferrals(DEMO_USER_ID),
        getScoutLeaderboard(),
      ]);
      setReferralCode(data.referralCode);
      setReferrals(data.referrals);
      setStats({
        totalClicks: data.totalClicks,
        totalSignups: data.totalSignups,
        qualifiedCount: data.qualifiedCount,
        totalPointsEarned: data.totalPointsEarned,
      });
      setLeaderboard(board);
      setLoading(false);
    }
    load();
  }, []);

  const copyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const tierBadgeClass: Record<string, string> = {
    LEGENDARY_AMBASSADOR:
      'bg-gradient-to-r from-gold-400 to-amber-500 text-slate-950 font-black',
    CAPTAIN: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    VANGUARD: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    SCOUT: 'bg-slate-800 text-slate-400',
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Alliance Scout & Referral Programme</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Refer Members & Earn Loyalty Points
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Share your unique Alliance referral link. When a referred member completes AI KYC
            verification, you earn <strong className="text-gold-300">500 Loyalty Points</strong> per qualified referral — automatically credited with no limits.
          </p>
        </div>
        <Link
          href="/loyalty"
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-gold-500/30 text-gold-300 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-2 w-fit"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>View Loyalty Hub</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
            Link Clicks
          </span>
          <span className="text-3xl font-extrabold text-white font-display">
            {loading ? '—' : stats.totalClicks}
          </span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
            Signups via Link
          </span>
          <span className="text-3xl font-extrabold text-white font-display">
            {loading ? '—' : stats.totalSignups}
          </span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/25">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
            Qualified Referrals
          </span>
          <span className="text-3xl font-extrabold text-emerald-400 font-display">
            {loading ? '—' : stats.qualifiedCount}
          </span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-gold-500/25">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
            Points Earned
          </span>
          <span className="text-3xl font-extrabold gold-gradient-text font-display">
            {loading ? '—' : stats.totalPointsEarned.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Referral Link + Referred Members List */}
        <div className="lg:col-span-2 space-y-6">

          {/* Referral Code Card */}
          <div className="glass-card p-7 rounded-3xl border border-gold-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white font-display mb-0.5">
                  Your Unique Alliance Referral Link
                </h2>
                <p className="text-xs text-slate-400">
                  Share this link. Points are automatically awarded when the referred member passes AI identity verification.
                </p>
              </div>

              {/* Code Display */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-gold-500/30 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">
                    Your Code
                  </span>
                  <span className="text-xl font-black text-gold-300 font-mono tracking-widest block">
                    {referralCode}
                  </span>
                </div>
                <div className="flex-shrink-0 p-2.5 bg-gold-500/10 border border-gold-500/30 rounded-lg text-gold-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              {/* Full Link + Copy */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono truncate flex-1">
                  {referralLink}
                </span>
                <button
                  onClick={copyLink}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gold-500 text-slate-950 hover:brightness-110'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Referral Rules */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 space-y-1 leading-relaxed">
                <div className="font-bold text-amber-300 flex items-center space-x-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Referral Programme Rules</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-100/80">
                  <li>500 Alliance Points awarded per referral who completes AI KYC verification.</li>
                  <li>Self-referrals are automatically blocked by the system.</li>
                  <li>Duplicate referral credits for the same member are not permitted.</li>
                  <li>Points are credited instantly when the referred member's KYC status changes to VERIFIED.</li>
                  <li>No cap on the number of referrals you can make.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Referred Members Table */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display">
                Referred Members
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {referrals.length} member{referrals.length !== 1 ? 's' : ''} referred
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-500 text-sm">Loading referrals...</div>
            ) : referrals.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <Share2 className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-slate-400 text-sm">No referrals yet.</p>
                <p className="text-slate-500 text-xs">
                  Share your link above and start earning 500 points per qualified member.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((ref) => {
                  const statusConfig = STATUS_CONFIG[ref.status];
                  return (
                    <div
                      key={ref.id}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-gold-400 flex-shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-sm text-white block">
                            {ref.referred_profile?.full_name ?? 'Alliance Member'}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {ref.referred_profile
                              ? ROLE_LABELS[ref.referred_profile.role]
                              : 'Member'}{' '}
                            •{' '}
                            {ref.referred_profile?.african_heritage_country ?? 'African Heritage'}
                          </span>
                          {ref.referred_profile?.account_tier === 'LEGEND_ELITE' && (
                            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-950 bg-gradient-to-r from-gold-400 to-amber-500 px-2 py-0.5 rounded-full mt-1">
                              <Award className="w-2.5 h-2.5" />
                              <span>Legend / Elite</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 text-xs flex-shrink-0">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border font-semibold ${statusConfig.className}`}
                        >
                          {statusConfig.icon}
                          <span>{statusConfig.label}</span>
                        </span>
                        {ref.status === 'QUALIFIED' && (
                          <span className="text-[10px] font-bold text-gold-400 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>+{ref.reward_points} pts</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(ref.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Leaderboard */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-gold-500/25 shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="w-5 h-5 text-gold-400" />
              <h3 className="text-lg font-bold text-white font-display">
                Top Scouts Leaderboard
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Most qualified referrals across the Alliance.
            </p>

            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 ${
                    entry.rank === 1
                      ? 'bg-gold-500/10 border border-gold-500/40 shadow-gold-glow'
                      : 'bg-slate-950/60 border border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        entry.rank === 1
                          ? 'bg-gold-500 text-slate-950'
                          : entry.rank === 2
                          ? 'bg-slate-400 text-slate-950'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {entry.rank}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {entry.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {entry.country} • {entry.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 gap-1">
                    <span className="text-xs font-black text-emerald-400">
                      {entry.qualifiedCount} ✓
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tierBadgeClass[entry.tier] ?? 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {entry.tier.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
              Leaderboard refreshes every 24 hours
            </div>
          </div>

          {/* How it Works */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display">How Referrals Work</h3>
            <ol className="space-y-3 text-xs text-slate-300">
              {[
                { step: '1', text: 'Copy your unique Alliance referral link above.' },
                { step: '2', text: 'Share it with African footballers, veterans, or diaspora enthusiasts.' },
                { step: '3', text: 'They sign up and complete the mandatory Pan-African onboarding.' },
                { step: '4', text: 'When they pass AI KYC biometric verification → 500 Loyalty Points credited to you instantly.' },
                { step: '5', text: 'No cap. Refer 20 members, earn 10,000 points and unlock Legendary Ambassador tier.' },
              ].map(({ step, text }) => (
                <li key={step} className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-gold-500/20 text-gold-400 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step}
                  </span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
