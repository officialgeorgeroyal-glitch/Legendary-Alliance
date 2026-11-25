'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { NewsBrief, SEED_NEWS_BRIEFS, loadNewsBriefs } from '@/lib/newsBriefs';

export default function NewsBriefsPreview({ limit = 3 }: { limit?: number }) {
  const [briefs, setBriefs] = useState<NewsBrief[]>(SEED_NEWS_BRIEFS.slice(0, limit));

  useEffect(() => {
    setBriefs(loadNewsBriefs(window.localStorage).slice(0, limit));
  }, [limit]);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 space-y-5">
      {/* Visual Alliance Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
        <img
          src="/images/alliance-hero.svg"
          alt="Legendary Alliance Global Football Assets"
          className="w-full h-44 md:h-56 object-cover"
        />
      </div>

      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Latest Alliance News Briefs</h2>
          <p className="text-xs text-gray-400">
            Live updates on club acquisitions, training facilities, hospitality, and football tech.
          </p>
        </div>
        <Link
          href="/news"
          className="rounded-lg bg-amber-500 text-black font-semibold px-4 py-2 text-xs hover:bg-amber-400 transition"
        >
          Open Full News Feed →
        </Link>
      </div>

      {/* Visual News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {briefs.map((item) => (
          <Link
            key={item.id}
            href="/news"
            className="group rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-amber-400/50 transition flex flex-col justify-between"
          >
            <div>
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-36 object-cover border-b border-white/10 group-hover:scale-[1.02] transition-transform"
              />
              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-400 font-semibold">{item.category}</span>
                  <span className="text-gray-400">{item.publishedAt}</span>
                </div>
                <h3 className="text-sm font-semibold text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-gray-300 line-clamp-2">{item.summary}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}