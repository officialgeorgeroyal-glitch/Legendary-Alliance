import Link from 'next/link';
import { Shield, Lock, Globe, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gold-500/20 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-gold-500" />
            <span className="text-lg font-bold text-white tracking-wider uppercase font-display">
              Legendary Alliance
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-4">
            A private promotional club uniting current African footballers, former legends, and global diaspora football enthusiasts to pool collective strength, network, and promote the acquisition and stewardship of football assets worldwide.
          </p>
          <div className="flex items-center space-x-2 text-xs text-gold-400/90 font-medium bg-gold-950/30 border border-gold-500/20 rounded-md p-2.5 max-w-md">
            <Scale className="w-4 h-4 flex-shrink-0" />
            <span>Private Promotional Club Model — Not a retail securities or collective investment scheme.</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Club Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Overview</Link></li>
            <li><Link href="/onboarding" className="hover:text-gold-400 transition-colors">Member Onboarding</Link></li>
            <li><Link href="/kyc" className="hover:text-gold-400 transition-colors">Biometric Verification</Link></li>
            <li><Link href="/contributions" className="hover:text-gold-400 transition-colors">Contributions & Pledges</Link></li>
            <li><Link href="/referrals" className="hover:text-gold-400 transition-colors">Referral Programme</Link></li>
            <li><Link href="/loyalty" className="hover:text-gold-400 transition-colors">Loyalty Hub & Rewards</Link></li>
            <li><Link href="/admin/footballers" className="hover:text-gold-400 transition-colors">Legend Fast-Track Panel</Link></li>
            <li><Link href="/dashboard" className="hover:text-gold-400 transition-colors">Member Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Security & Compliance</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mandatory TOTP 2FA</span>
            </li>
            <li className="flex items-center space-x-2">
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              <span>Row-Level Security (RLS)</span>
            </li>
            <li className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Pan-African & Diaspora ID Coverage</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Legendary Alliance Promotional Club. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Private Membership • Asset Stewardship • Global Pan-African Unity</p>
      </div>
    </footer>
  );
}
