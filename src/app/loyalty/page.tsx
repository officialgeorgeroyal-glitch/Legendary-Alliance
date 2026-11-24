'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LoyaltyActivity {
  id: string;
  label: string;
  pointsDelta: number;
  date: string;
}

const LOYALTY_STORAGE_KEY = 'legendary_alliance_loyalty_v1';

const SEED_ACTIVITIES: LoyaltyActivity[] = [
  {
    id: 'LOY-101',
    label: 'Initial Alliance Contribution Bonus',
    pointsDelta: 500,
    date: '2026-11-05',
  },
  {
    id: 'LOY-102',
    label: 'Community Referral Reward',
    pointsDelta: 250,
    date: '2026-11-15',
  },
];

function getTier(points: number): { name: string; nextThreshold: number | null } {
  if (points >= 2500) return { name: 'Legendary Vanguard', nextThreshold: null };
  if (points >= 1200) return { name: 'Gold Alliance', nextThreshold: 2500 };
  if (points >= 500) return { name: 'Silver Member', nextThreshold: 1200 };
  return { name: 'Bronze Starter', nextThreshold: 500 };
}

export default function LoyaltyPage() {
  const [activities, setActivities] = useState<LoyaltyActivity[]>(SEED_ACTIVITIES);
  const [activityLabel, setActivityLabel] = useState('');
  const [pointsInput, setPointsInput] = useState('100');
  const [error, setError] = useState<string | null>(null);
  const initialActivitiesRef = useRef<LoyaltyActivity[]>(SEED_ACTIVITIES);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOYALTY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActivities(parsed);
        }
      }
    } catch {
      // Keep seed loyalty activities on storage read failure
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(activities));
    } catch {
      // Ignore storage write errors
    }
  }, [activities]);

  const totalPoints = activities.reduce((sum, item) => sum + item.pointsDelta, 0);
  const tier = getTier(totalPoints);

  const handleLogPoints = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedLabel = activityLabel.trim();
    const numericPoints = Number(pointsInput);

    if (!trimmedLabel) {
      setError('Please enter a description for this points entry.');
      return;
    }
    if (!Number.isFinite(numericPoints) || numericPoints === 0) {
      setError('Please enter a non-zero number of points (positive to earn, negative to adjust).');
      return;
    }

    const nextEntry: LoyaltyActivity = {
      id: `LOY-${Date.now().toString().slice(-4)}`,
      label: trimmedLabel,
      pointsDelta: Math.trunc(numericPoints),
      date: new Date().toISOString().slice(0, 10),
    };

    setActivities((prev) => [nextEntry, ...prev]);
    setActivityLabel('');
  };

  const handleResetSeedLoyalty = () => {
    try {
      window.localStorage.removeItem(LOYALTY_STORAGE_KEY);
    } catch {
      // Ignore storage removal errors
    }
    setActivities(initialActivitiesRef.current);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold">Loyalty & Rewards</h1>
            <p className="text-sm text-gray-400">
              Track your alliance points balance, current tier status, and points activity log.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-right">
            <div className="text-xs text-gray-400">Current Balance & Tier</div>
            <div className="text-lg font-semibold text-amber-300">{totalPoints} pts</div>
            <div className="text-xs text-gray-300">
              {tier.name}
              {tier.nextThreshold ? ` · Next tier at ${tier.nextThreshold} pts` : ' · Top tier reached'}
            </div>
          </div>
        </div>

        <form onSubmit={handleLogPoints} className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Activity or Reward Note</label>
              <input
                type="text"
                value={activityLabel}
                onChange={(e) => setActivityLabel(e.target.value)}
                placeholder="e.g., Weekly Contribution Streak or Reward Redemption"
                className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Points Delta</label>
              <input
                type="number"
                value={pointsInput}
                onChange={(e) => setPointsInput(e.target.value)}
                className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleResetSeedLoyalty}
              className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/5"
            >
              Reset Seed Loyalty
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 text-black font-semibold px-4 py-2 text-xs hover:bg-amber-400"
            >
              Save Points Entry
            </button>
          </div>
        </form>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-3">
          <h2 className="text-base font-semibold">Loyalty Ledger</h2>
          <div className="space-y-2">
            {activities.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/30 border border-white/10 px-4 py-3 text-sm"
              >
                <span className="font-medium text-white">{item.label}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      item.pointsDelta >= 0
                        ? 'text-xs font-semibold text-emerald-300'
                        : 'text-xs font-semibold text-amber-300'
                    }
                  >
                    {item.pointsDelta >= 0 ? `+${item.pointsDelta}` : item.pointsDelta} pts
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}