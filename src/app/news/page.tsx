'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  NewsBrief,
  NewsCategory,
  SEED_NEWS_BRIEFS,
  loadNewsBriefs,
  resetNewsBriefs,
  saveNewsBriefs,
} from '@/lib/newsBriefs';

const CATEGORY_IMAGES: Record<NewsCategory, string> = {
  'Club Acquisitions': '/images/news-club.svg',
  'Training Facilities': '/images/news-academy.svg',
  Hospitality: '/images/news-hospitality.svg',
  'Football Tech': '/images/news-hospitality.svg',
  'Alliance Updates': '/images/alliance-hero.svg',
};

export default function NewsBriefsPage() {
  const [briefs, setBriefs] = useState<NewsBrief[]>(SEED_NEWS_BRIEFS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsCategory>('Club Acquisitions');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBriefs(loadNewsBriefs(window.localStorage));
  }, []);

  const handlePublishBrief = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedSummary = summary.trim();

    if (!trimmedTitle) {
      setError('Please enter a headline for the news brief.');
      return;
    }
    if (!trimmedSummary) {
      setError('Please enter a short summary for the news brief.');
      return;
    }

    const nextBrief: NewsBrief = {
      id: `NEWS-${Date.now().toString().slice(-4)}`,
      title: trimmedTitle,
      category,
      summary: trimmedSummary,
      imageUrl: CATEGORY_IMAGES[category],
      publishedAt: new Date().toISOString().slice(0, 10),
      featured: true,
    };

    const updated = [nextBrief, ...briefs];
    setBriefs(updated);
    saveNewsBriefs(updated, window.localStorage);
    setTitle('');
    setSummary('');
  };

  const handleReset = () => {
    const fresh = resetNewsBriefs(window.localStorage);
    setBriefs(fresh);
    setSelectedCategory('All');
    setError(null);
  };

  const filteredBriefs =
    selectedCategory === 'All'
      ? briefs
      : briefs.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <img
            src="/images/alliance-hero.svg"
            alt="Legendary Alliance News & Intelligence"
            className="w-full h-48 md:h-56 object-cover"
          />
          <div className="p-5 bg-neutral-900/90 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Alliance News Briefs</h1>
              <p className="text-sm text-gray-400">
                Club acquisition updates, academy milestones, and member governance intelligence.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-gray-200 hover:bg-white/5"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Category Filter & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {['All', 'Club Acquisitions', 'Training Facilities', 'Hospitality', 'Football Tech', 'Alliance Updates'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-white/15 px-3.5 py-1.5 text-xs text-gray-300 hover:bg-white/5"
          >
            Reset Seed Briefs
          </button>
        </div>

        {/* News Brief Cards with Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredBriefs.map((item) => (
            <article
              key={item.id}
              className="rounded-xl overflow-hidden bg-white/5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover border-b border-white/10"
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-medium">{item.category}</span>
                    <span className="text-gray-400">{item.publishedAt}</span>
                  </div>
                  <h2 className="text-base font-semibold leading-snug">{item.title}</h2>
                  <p className="text-xs text-gray-300 leading-relaxed">{item.summary}</p>
                </div>
              </div>
              <div className="px-4 py-2.5 bg-black/30 border-t border-white/10 text-[11px] text-gray-400">
                Brief ID: {item.id}
              </div>
            </article>
          ))}
        </div>

        {/* Publish New Brief Form */}
        <form onSubmit={handlePublishBrief} className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-4">
          <h2 className="text-base font-semibold">Post New Alliance Brief</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Stadium Hospitality Partnership Term Sheet Published"
                className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
              >
                <option value="Club Acquisitions">Club Acquisitions</option>
                <option value="Training Facilities">Training Facilities</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Football Tech">Football Tech</option>
                <option value="Alliance Updates">Alliance Updates</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Summary</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a concise update for members..."
              className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="rounded-lg bg-amber-500 text-black font-semibold px-4 py-2 text-xs hover:bg-amber-400"
          >
            Publish News Brief
          </button>
        </form>
      </div>
    </div>
  );
}