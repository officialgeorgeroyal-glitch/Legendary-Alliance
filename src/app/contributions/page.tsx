'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Shield,
  Award,
  Sparkles,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Scale,
  Send,
  Hotel,
  Cpu,
  Bed,
  ArrowRight,
  TrendingUp,
  Coins
} from 'lucide-react';
import { createContribution } from '@/lib/services/contribution-service';
import { ContributionType, MemberContribution } from '@/types';

export default function ContributionsPage() {
  const [contributionType, setContributionType] = useState<ContributionType>('ASSET_PLEDGE');
  const [targetAsset, setTargetAsset] = useState<string>('European 2nd Tier Football Club (Gateway)');
  const [amount, setAmount] = useState<number>(2500);
  const [currency, setCurrency] = useState<string>('USD');
  const [paymentMethod, setPaymentMethod] = useState<string>('CARD');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<{
    contribution: MemberContribution;
    pointsAwarded: number;
  } | null>(null);

  // Sample history
  const [contributionsList, setContributionsList] = useState<MemberContribution[]>([
    {
      id: 'tx-prev-1',
      user_id: 'usr-demo-1',
      contribution_type: 'ASSET_PLEDGE',
      target_asset_name: 'West African Elite Academy & Sports Resort',
      amount: 10000,
      currency: 'USD',
      status: 'COMPLETED',
      payment_method: 'WIRE_TRANSFER',
      transaction_reference: 'LA-TX-1700812-4912',
      disclaimer_accepted: true,
      created_at: '2026-11-15T14:30:00Z',
      updated_at: '2026-11-15T14:30:00Z',
    },
    {
      id: 'tx-prev-2',
      user_id: 'usr-demo-1',
      contribution_type: 'ANNUAL_DUES',
      target_asset_name: 'Annual Club Dues & Governance Reserve',
      amount: 1200,
      currency: 'USD',
      status: 'COMPLETED',
      payment_method: 'CARD',
      transaction_reference: 'LA-TX-1700650-8812',
      disclaimer_accepted: true,
      created_at: '2026-11-01T09:15:00Z',
      updated_at: '2026-11-01T09:15:00Z',
    },
  ]);

  const expectedPoints = Math.floor(amount * 10);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('legendary_alliance_contributions_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setContributions(parsed);
        }
      }
    } catch {
      // Keep default seed contributions if storage is unavailable or invalid
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('legendary_alliance_contributions_v1', JSON.stringify(contributions));
    } catch {
      // Ignore storage write errors
    }
  }, [contributions]);

    const [recipientName, setRecipientName] = useState('');
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!disclaimerAccepted) {
      setError('You must acknowledge that this is a private Promotional Club contribution and not a retail investment.');
      return;
    }

    if (amount <= 0) {
      setError('Please enter a valid contribution amount.');
      return;
    }

    setLoading(true);

    try {
      const result = await createContribution({
        userId: 'usr-demo-1',
        contributionType,
        targetAssetName: targetAsset,
        amount,
        currency,
        paymentMethod,
        disclaimerAccepted,
        notes,
      });

      if (!result.success || !result.contribution) {
        throw new Error(result.error || 'Failed to process pledge.');
      }

      setSuccessReceipt({
        contribution: result.contribution,
        pointsAwarded: result.pointsAwarded || expectedPoints,
      });

      setContributionsList([result.contribution, ...contributionsList]);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit pledge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-2 shadow-gold-glow">
            <Coins className="w-3.5 h-3.5 text-gold-400" />
            <span>Club Asset Syndicate & Capital Pledging</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Member Contributions & Syndicate Pledges
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Pledge resources towards the collective acquisition of global football assets (clubs, training facilities, sports hotels, and hostels). Earn 10 Loyalty Points per $1 pledged.
          </p>
        </div>

        <Link
          href="/loyalty"
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-gold-500/30 text-gold-300 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-2 w-fit"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>View Loyalty Points Hub</span>
        </Link>
      </div>

      {/* Aggregate Syndicate Capital Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-gold-500/25">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
            Total Capital Pledged
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-display">
            $24,500,000
          </span>
          <span className="text-[10px] text-emerald-400 block mt-1">Across 142 Global Members</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
            European Club Pipeline
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            $14,000,000
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Belgian & Portuguese Liga 2</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
            African Academies & Hostels
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            $7,500,000
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Senegal, Nigeria & Ivory Coast</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/25">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
            Loyalty Rate
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">
            10x Points
          </span>
          <span className="text-[10px] text-emerald-300 block mt-1">Earned on all completed pledges</span>
        </div>
      </div>

      {/* Main Contribution Form & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-gold-500/30 relative shadow-2xl">
            <h2 className="text-xl font-bold font-display text-white mb-1">
              Submit a Member Contribution / Syndicate Pledge
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Select an asset classification, target initiative, and contribution amount.
            </p>

            {successReceipt && (
              <div className="mb-6 p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center space-x-3 text-emerald-300">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      Pledge Receipt Confirmed: {successReceipt.contribution.transaction_reference}
                    </h3>
                    <p className="text-xs text-emerald-200">
                      Successfully pledged {successReceipt.contribution.currency} {successReceipt.contribution.amount.toLocaleString()} towards {successReceipt.contribution.target_asset_name}.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="text-gold-300 font-semibold flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>+{successReceipt.pointsAwarded.toLocaleString()} Alliance Loyalty Points Credited!</span>
                  </span>
                  <Link href="/loyalty" className="underline font-bold text-white hover:text-gold-300">
                    View Ledger
                  </Link>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Contribution Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Contribution Classification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setContributionType('ASSET_PLEDGE')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      contributionType === 'ASSET_PLEDGE'
                        ? 'bg-gold-500/15 border-gold-500 text-white shadow-gold-glow'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-xs font-bold mb-1">
                      <Building2 className="w-4 h-4 text-gold-400" />
                      <span>Asset Syndicate Pledge</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Capital allocation earmarked for club, academy, hotel, or hostel acquisitions.
                    </p>
                  </div>

                  <div
                    onClick={() => setContributionType('ANNUAL_DUES')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      contributionType === 'ANNUAL_DUES'
                        ? 'bg-gold-500/15 border-gold-500 text-white shadow-gold-glow'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-xs font-bold mb-1">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Annual Club Dues</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Membership standing, operational governance, scouting data, and concierges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Asset Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Football Asset Initiative
                </label>
                <select
                  value={targetAsset}
                  onChange={(e) => setTargetAsset(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="European 2nd Tier Football Club (Gateway)">
                    European 2nd Tier Football Club Gateway (Portugal / Belgium)
                  </option>
                  <option value="West African Elite Academy & Sports Resort">
                    West African Elite High-Performance Academy & Sports Resort (Senegal / Ivory Coast)
                  </option>
                  <option value="Athlete Accommodation Hostel & Scouting Tech Hub">
                    Athlete Accommodation Hostel & Scouting Tech Hub (Nigeria - Lagos/Abuja)
                  </option>
                  <option value="North African Sports Hospitality & Winter Retreat">
                    North African Sports Hospitality & Winter Retreat (Morocco)
                  </option>
                  <option value="General Asset Prospecting Reserve">
                    Alliance General Asset Prospecting Reserve
                  </option>
                </select>
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Pledge Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={100}
                      step={50}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="e.g. 5000"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  {/* Quick Select Buttons */}
                  <div className="flex gap-2 mt-2">
                    {[1000, 2500, 5000, 10000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                          amount === preset
                            ? 'bg-gold-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        ${preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="ZAR">ZAR (R)</option>
                    <option value="KES">KES (KSh)</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Payment / Settlement Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="CARD">Credit / Debit Card (Visa / Mastercard / Amex)</option>
                  <option value="WIRE_TRANSFER">Direct Bank Wire (SWIFT / Fedwire / SEPA)</option>
                  <option value="AFRICAN_RAILS">African Instant Bank Transfer / Paystack / Flutterwave</option>
                  <option value="CRYPTO">Institutional Stablecoin (USDC / USDT on Ethereum / Polygon)</option>
                </select>
              </div>

              {/* Loyalty Points Preview Banner */}
              <div className="p-3.5 rounded-xl bg-gold-950/30 border border-gold-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Loyalty Points to be credited:</span>
                </span>
                <span className="text-gold-300 font-bold font-mono text-sm">
                  +{expectedPoints.toLocaleString()} Alliance Points
                </span>
              </div>

              {/* Mandatory Promotional Club Disclaimer */}
              <div
                onClick={() => setDisclaimerAccepted(!disclaimerAccepted)}
                className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                  disclaimerAccepted
                    ? 'bg-gold-500/10 border-gold-500/50 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 text-gold-400 flex-shrink-0">
                  <CheckCircle2
                    className={`w-5 h-5 ${disclaimerAccepted ? 'text-gold-400' : 'text-slate-600'}`}
                  />
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-bold block text-slate-200">
                    Mandatory Promotional Club Contribution Disclaimer
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    I confirm this pledge represents a private promotional club contribution towards our collective acquisition and promotion strategy, and <strong className="text-slate-200">NOT</strong> a purchase of public retail securities or investment fund units. Formal SPV structuring and shareholder agreements occur under independent regulated transaction vehicles.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-slate-950 shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{loading ? 'Processing Pledge...' : `Confirm & Pledge ${currency} ${amount.toLocaleString()}`}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Contribution History */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">
              My Contribution History
            </h3>
            <p className="text-xs text-slate-400">
              Receipts and records of your syndicate pledges
            </p>

            <div className="space-y-3">
              {contributionsList.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      {tx.currency} {tx.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      {tx.status}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] line-clamp-1">
                    {tx.target_asset_name}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span className="font-mono">{tx.transaction_reference}</span>
                    <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Lifetime Member Pledges:</span>
              <strong className="text-gold-400 font-mono">
                ${contributionsList.reduce((acc, c) => acc + c.amount, 0).toLocaleString()} USD
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
