'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  Coins,
  Award,
  CheckCircle2,
  ArrowRight,
  Zap,
  Star,
  ShieldCheck,
  Trophy,
  Gift,
  ArrowUpRight,
  Clock,
  Minus,
} from 'lucide-react';
import {
  getLoyaltyAccount,
  getPointsLedger,
  getRewardsCatalog,
  redeemReward,
  calculateTierProgress,
  TIER_THRESHOLDS,
} from '@/lib/services/loyalty-service';
import {
  LoyaltyAccount,
  LoyaltyPointTransaction,
  LoyaltyReward,
  LoyaltyTier,
  PointsEventType,
} from '@/types';

// Tier configuration
const TIER_CONFIG: Record<
  LoyaltyTier,
  { label: string; color: string; bgClass: string; borderClass: string; icon: React.ReactNode; description: string }
> = {
  SCOUT: {
    label: 'Scout',
    color: 'text-slate-300',
    bgClass: 'bg-slate-800',
    borderClass: 'border-slate-700',
    icon: <Star className="w-5 h-5" />,
    description: 'Beginning your journey in the Alliance. Complete KYC and refer members to advance.',
  },
  VANGUARD: {
    label: 'Vanguard',
    color: 'text-blue-300',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/40',
    icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
    description: 'Active and committed. Access asset intelligence packs and digital community events.',
  },
  CAPTAIN: {
    label: 'Captain',
    color: 'text-purple-300',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/40',
    icon: <Trophy className="w-5 h-5 text-purple-400" />,
    description: 'A respected pillar. VIP summit access, delegation reviews, and governance proposals.',
  },
  LEGENDARY_AMBASSADOR: {
    label: 'Legendary Ambassador',
    color: 'text-gold-300',
    bgClass: 'bg-gold-500/10',
    borderClass: 'border-gold-500/40',
    icon: <Award className="w-5 h-5 text-gold-400" />,
    description: 'The pinnacle of Alliance membership. Exclusive inspection delegations, media access, and global deal previews.',
  },
};

const EVENT_CONFIG: Record<PointsEventType, { label: string; iconClass: string }> = {
  ONBOARDING_COMPLETED: { label: 'Profile Onboarding', iconClass: 'text-blue-400' },
  KYC_VERIFIED: { label: 'KYC Identity Verified', iconClass: 'text-emerald-400' },
  REFERRAL_QUALIFIED: { label: 'Qualified Referral', iconClass: 'text-gold-400' },
  ASSET_PROPOSAL_SUBMITTED: { label: 'Asset Proposal Submitted', iconClass: 'text-cyan-400' },
  ASSET_PROPOSAL_APPROVED: { label: 'Asset Proposal Approved', iconClass: 'text-purple-400' },
  CONTRIBUTION_PLEDGED: { label: 'Syndicate Pledge', iconClass: 'text-gold-400' },
  GOVERNANCE_VOTE: { label: 'Governance Vote Cast', iconClass: 'text-teal-400' },
  POINTS_REDEEMED: { label: 'Reward Redeemed', iconClass: 'text-red-400' },
};

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  INTELLIGENCE: { icon: <Zap className="w-4 h-4" />, color: 'text-cyan-400' },
  ACCESS: { icon: <ShieldCheck className="w-4 h-4" />, color: 'text-blue-400' },
  EVENT: { icon: <Star className="w-4 h-4" />, color: 'text-purple-400' },
  EXPERIENCE: { icon: <Award className="w-4 h-4" />, color: 'text-gold-400' },
};

const ALL_TIERS: LoyaltyTier[] = ['SCOUT', 'VANGUARD', 'CAPTAIN', 'LEGENDARY_AMBASSADOR'];

export default function LoyaltyPage() {
  const DEMO_USER_ID = 'usr-demo-1';

  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [ledger, setLedger] = useState<LoyaltyPointTransaction[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [acc, txns, catalog] = await Promise.all([
        getLoyaltyAccount(DEMO_USER_ID),
        getPointsLedger(DEMO_USER_ID),
        getRewardsCatalog(),
      ]);
      setAccount(acc);
      setLedger(txns);
      setRewards(catalog);
      setLoading(false);
    }
    load();
  }, []);

  const tierProgress = account ? calculateTierProgress(account.lifetime_points) : null;
  const tierCfg = account ? TIER_CONFIG[account.current_tier] : null;

  const handleRedeem = async (reward: LoyaltyReward) => {
    if (!account || account.current_balance < reward.points_cost) return;
    setRedeemingId(reward.id);
    const result = await redeemReward(DEMO_USER_ID, reward.id);
    if (result.success) {
      setAccount((prev) =>
        prev
          ? { ...prev, current_balance: prev.current_balance - reward.points_cost }
          : prev
      );
      setLedger((prev) => [
        {
          id: `redeem-${Date.now()}`,
          user_id: DEMO_USER_ID,
          event_type: 'POINTS_REDEEMED',
          points: -reward.points_cost,
          balance_after: (account?.current_balance ?? 0) - reward.points_cost,
          description: `Redeemed: ${reward.title}`,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setRedeemSuccess(result.message || `${reward.title} redeemed!`);
      setTimeout(() => setRedeemSuccess(null), 5000);
    }
    setRedeemingId(null);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-2 shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alliance Loyalty & Rewards System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Alliance Loyalty Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Earn points through member activity — contributions, referrals, KYC, and governance.
            Redeem them for exclusive Alliance perks and delegate access.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/contributions"
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-2 w-fit"
          >
            <Coins className="w-4 h-4 text-gold-400" />
            <span>Pledge & Earn</span>
          </Link>
          <Link
            href="/referrals"
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-2 w-fit"
          >
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Refer & Earn</span>
          </Link>
        </div>
      </div>

      {redeemSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-3 animate-in fade-in">
          <Gift className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{redeemSuccess}</span>
        </div>
      )}

      {/* Top Row: Balance Card + Tier Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance & Tier Badge */}
        <div className="glass-card p-7 rounded-3xl border border-gold-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                Current Balance
              </span>
              {tierCfg && (
                <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tierCfg.bgClass} ${tierCfg.color} border ${tierCfg.borderClass}`}>
                  {tierCfg.icon}
                  <span>{tierCfg.label}</span>
                </div>
              )}
            </div>

            <div>
              <span className="text-5xl font-black gold-gradient-text font-display block leading-none">
                {loading ? '—' : account?.current_balance.toLocaleString() ?? '0'}
              </span>
              <span className="text-sm text-slate-400 mt-1 block">Alliance Loyalty Points</span>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Lifetime Points Earned</span>
              <span className="font-bold text-white font-mono">
                {loading ? '—' : account?.lifetime_points.toLocaleString() ?? '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Tier Progress Card */}
        <div className="lg:col-span-2 glass-card p-7 rounded-3xl border border-slate-800 shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-white font-display">
            Tier Progression
          </h2>

          {/* Tier Roadmap */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {ALL_TIERS.map((tier, idx) => {
                const cfg = TIER_CONFIG[tier];
                const isActive = account?.current_tier === tier;
                const isPast = tierProgress
                  ? ALL_TIERS.indexOf(account!.current_tier) > idx
                  : false;
                return (
                  <div key={tier} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border-2 ${
                        isActive
                          ? 'bg-gold-500 border-gold-400 shadow-gold-glow scale-110'
                          : isPast
                          ? 'bg-emerald-600 border-emerald-500'
                          : 'bg-slate-900 border-slate-700'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : isActive ? (
                        <span className="text-slate-950">{cfg.icon}</span>
                      ) : (
                        <span className={cfg.color}>{cfg.icon}</span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold text-center leading-tight hidden sm:block ${isActive ? 'text-gold-300' : isPast ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {cfg.label.split(' ').map((w, i) => (
                        <span key={i} className="block">{w}</span>
                      ))}
                    </span>
                    <span className={`text-[9px] text-center ${isActive ? 'text-gold-400' : 'text-slate-600'} font-mono hidden sm:block`}>
                      {TIER_THRESHOLDS[tier].toLocaleString()} pts
                    </span>
                    {idx < ALL_TIERS.length - 1 && (
                      <div className="absolute h-0.5 bg-slate-800" style={{ display: 'none' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            {tierProgress && tierProgress.nextTier && (
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Progress to{' '}
                    <strong className={TIER_CONFIG[tierProgress.nextTier].color}>
                      {TIER_CONFIG[tierProgress.nextTier].label}
                    </strong>
                  </span>
                  <span className="text-slate-400 font-mono">
                    {tierProgress.pointsToNext.toLocaleString()} pts needed
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-400 to-amber-500 transition-all duration-500"
                    style={{ width: `${tierProgress.percentage}%` }}
                  />
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  {tierProgress.percentage}% complete
                </div>
              </div>
            )}

            {tierProgress?.currentTier === 'LEGENDARY_AMBASSADOR' && (
              <div className="mt-4 p-3 bg-gold-500/10 border border-gold-500/40 rounded-xl text-xs text-gold-200 flex items-center space-x-2">
                <Award className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>You have reached the pinnacle of the Alliance — <strong>Legendary Ambassador</strong>. All perks and delegations are unlocked.</span>
              </div>
            )}
          </div>

          {/* Active Tier Description */}
          {tierCfg && (
            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-4">
              <strong className={tierCfg.color}>{tierCfg.label}:</strong> {tierCfg.description}
            </p>
          )}
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="glass-card p-7 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-white font-display mb-5">
          Ways to Earn Alliance Points
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              title: 'Complete KYC Verification',
              pts: '+250 pts',
              desc: 'Pass AI biometric identity verification.',
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
              bg: 'bg-blue-500/10 border-blue-500/30',
              title: 'Refer a Qualified Member',
              pts: '+500 pts',
              desc: 'Referred member must pass KYC. No self-referrals.',
            },
            {
              icon: <Coins className="w-5 h-5 text-gold-400" />,
              bg: 'bg-gold-500/10 border-gold-500/30',
              title: 'Syndicate Asset Pledge',
              pts: '+10 pts / $1',
              desc: 'Pledge resources towards an approved asset initiative.',
            },
            {
              icon: <Sparkles className="w-5 h-5 text-purple-400" />,
              bg: 'bg-purple-500/10 border-purple-500/30',
              title: 'Submit Asset Proposal',
              pts: '+100 pts',
              desc: 'Suggest a qualifying football asset for Alliance review.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`p-4 rounded-2xl border ${item.bg} space-y-2`}
            >
              <div>{item.icon}</div>
              <div className="text-sm font-bold text-white">{item.title}</div>
              <div className="text-lg font-black text-gold-300 font-mono">{item.pts}</div>
              <div className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalog + Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rewards Catalog — 2 cols */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-xl font-bold text-white font-display">
            Rewards Catalog
          </h2>
          <p className="text-xs text-slate-400 -mt-3">
            Redeem your points for exclusive Alliance perks and delegate experiences.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const catCfg = CATEGORY_CONFIG[reward.category] ?? CATEGORY_CONFIG.EXPERIENCE;
              const canAfford = account ? account.current_balance >= reward.points_cost : false;
              const tierLocked =
                account
                  ? ALL_TIERS.indexOf(account.current_tier) <
                    ALL_TIERS.indexOf(reward.tier_requirement)
                  : true;
              const isRedeeming = redeemingId === reward.id;

              return (
                <div
                  key={reward.id}
                  className={`glass-card p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                    tierLocked
                      ? 'border-slate-800/50 opacity-60'
                      : canAfford
                      ? 'border-gold-500/30 hover:border-gold-500/60 hover:shadow-gold-glow'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${catCfg.color}`}>
                        {catCfg.icon}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        tierLocked
                          ? 'bg-slate-900 text-slate-500 border-slate-700'
                          : 'bg-gold-500/10 text-gold-400 border-gold-500/30'
                      }`}>
                        {tierLocked
                          ? `${TIER_CONFIG[reward.tier_requirement].label} Required`
                          : reward.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug">{reward.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{reward.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                    <span className="text-base font-black text-gold-300 font-mono">
                      {reward.points_cost.toLocaleString()} pts
                    </span>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford || tierLocked || isRedeeming}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                        canAfford && !tierLocked
                          ? 'bg-gradient-to-r from-gold-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-gold-glow'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>
                        {isRedeeming
                          ? 'Redeeming...'
                          : tierLocked
                          ? 'Tier Locked'
                          : !canAfford
                          ? 'Need More Points'
                          : 'Redeem'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Points Ledger — 1 col */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-white font-display">
            Points Ledger
          </h2>
          <p className="text-xs text-slate-400 -mt-3">
            Append-only history of all points events.
          </p>

          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3 max-h-[560px] overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-slate-500 text-sm">Loading ledger...</div>
            ) : (
              ledger.map((tx) => {
                const evtCfg = EVENT_CONFIG[tx.event_type];
                const isPositive = tx.points > 0;
                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <span className={`text-xs font-bold block ${evtCfg?.iconClass ?? 'text-slate-300'}`}>
                        {evtCfg?.label ?? tx.event_type}
                      </span>
                      <span className="text-[11px] text-slate-400 block leading-relaxed line-clamp-2">
                        {tx.description}
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-0.5">
                        <span>Bal: {tx.balance_after.toLocaleString()}</span>
                        <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-black flex-shrink-0 font-mono mt-0.5 ${
                        isPositive ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}{tx.points.toLocaleString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
