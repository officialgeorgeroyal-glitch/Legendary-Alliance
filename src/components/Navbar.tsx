'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Sparkles, User, Award, LogOut, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-500/20 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Emblem */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 via-gold-600 to-amber-800 p-0.5 shadow-gold-glow flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-gold-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-wider gold-gradient-text uppercase block font-display">
              Legendary Alliance
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase -mt-1 block">
              Pan-African Football Promotional Club
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link
            href="/"
            className={`transition-colors hover:text-gold-400 ${
              pathname === '/' ? 'text-gold-400 font-medium' : 'text-slate-300'
            }`}
          >
            Overview
          </Link>
          <Link
            href="/onboarding"
            className={`transition-colors hover:text-gold-400 ${
              pathname === '/onboarding' ? 'text-gold-400 font-medium' : 'text-slate-300'
            }`}
          >
            Onboarding
          </Link>
          <Link
            href="/kyc"
            className={`transition-colors hover:text-gold-400 ${
              pathname === '/kyc' ? 'text-gold-400 font-medium' : 'text-slate-300'
            }`}
          >
            Identity Verification
          </Link>
          <Link
            href="/admin/footballers"
            className={`transition-colors hover:text-gold-400 flex items-center space-x-1.5 ${
              pathname.startsWith('/admin') ? 'text-gold-400 font-medium' : 'text-slate-300'
            }`}
          >
            <Award className="w-4 h-4 text-gold-500" />
            <span>Athlete Panel</span>
          </Link>
          <Link
            href="/dashboard"
            className={`transition-colors hover:text-gold-400 ${
              pathname === '/dashboard' ? 'text-gold-400 font-medium' : 'text-slate-300'
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center space-x-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 text-slate-950 font-semibold shadow-gold-glow hover:brightness-110 transition-all"
          >
            <span className="px-4 py-2 rounded-md bg-gradient-to-r from-gold-400 to-gold-500 text-slate-950">
              Join the Alliance
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
