'use client';

import React, { useState } from 'react';
import { ShieldAlert, Scale, CheckSquare, Square, FileText, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: (termsData: {
    termsVersion: string;
    clubNatureAcknowledged: boolean;
    nonInvestmentAcknowledged: boolean;
    proposalFrameworkAcknowledged: boolean;
  }) => void;
  onCancel?: () => void;
}

export default function TermsModal({ isOpen, onAccept, onCancel }: TermsModalProps) {
  const [agreedClubNature, setAgreedClubNature] = useState(false);
  const [agreedNonInvestment, setAgreedNonInvestment] = useState(false);
  const [agreedProposalFramework, setAgreedProposalFramework] = useState(false);

  if (!isOpen) return null;

  const allAgreed = agreedClubNature && agreedNonInvestment && agreedProposalFramework;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAgreed) return;

    onAccept({
      termsVersion: 'v1.0-promotional-club',
      clubNatureAcknowledged: agreedClubNature,
      nonInvestmentAcknowledged: agreedNonInvestment,
      proposalFrameworkAcknowledged: agreedProposalFramework,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-950/80 via-slate-900 to-slate-900 border-b border-gold-500/20 p-6 flex items-start space-x-4">
          <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded-xl text-gold-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display tracking-wide">
              Mandatory Membership Terms & Club Disclosures
            </h3>
            <p className="text-sm text-gold-400/90 mt-1">
              Legendary Alliance — Private Football Promotional Club Charter (v1.0)
            </p>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-sm text-slate-300 border-b border-slate-800">
            {/* Critical Legal Banner */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-relaxed">
                <span className="font-bold text-amber-300 uppercase block mb-1">
                  Private Promotional Club • Non-Investment Notice
                </span>
                Legendary Alliance operates strictly as a private, cross-border promotional association and strategic alliance. It is <strong className="text-amber-100">NOT</strong> a mutual fund, collective investment scheme (CIS), alternative investment fund (AIF), or public retail securities platform.
              </div>
            </div>

            {/* Terms Articles */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-gold-400 text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>1. Nature of the Promotional Club</span>
                </h4>
                <p>
                  Legendary Alliance is formed to unite current African professional footballers, former legends, and passionate enthusiasts of African heritage worldwide. The Club provides community, strategic networking, promotional advocacy, and a forum for sports business intelligence aimed at elevating African and diaspora ownership in global football.
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-gold-400 text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>2. Asset Suggestions vs. Management Prospecting</span>
                </h4>
                <p>
                  Club members are encouraged to suggest, identify, and submit prospective football assets (including football clubs, elite training academies, sports hotels, athlete accommodation hostels, and football performance technology) for collective review and community interest.
                </p>
                <p>
                  All commercial negotiation, technical due diligence, legal structuring, and execution of asset transactions remain exclusively under the fiduciary prospecting authority of Alliance Executive Management and licensed international transaction partners. Member suggestions do not guarantee acquisition or direct equity allocation.
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-gold-400 text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>3. KYC, AML, & Cross-Border Compliance</span>
                </h4>
                <p>
                  By enrolling, members consent to comprehensive identity verification (KYC) verifying their government identification and live facial biometrics. Members attest that all personal resources, dues, and participations originate from lawful, non-sanctioned sources in full compliance with international anti-money laundering (AML) standards.
                </p>
              </div>
            </div>

            {/* Mandatory Checkboxes */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div
                onClick={() => setAgreedClubNature(!agreedClubNature)}
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                  agreedClubNature
                    ? 'bg-gold-500/10 border-gold-500/50 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 text-gold-400">
                  {agreedClubNature ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
                <div className="text-xs">
                  <span className="font-semibold block text-slate-200">
                    Acknowledgment of Private Promotional Club Status
                  </span>
                  I explicitly acknowledge and agree that Legendary Alliance is a private Promotional Club and not a retail investment platform, broker-dealer, or collective investment fund.
                </div>
              </div>

              <div
                onClick={() => setAgreedNonInvestment(!agreedNonInvestment)}
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                  agreedNonInvestment
                    ? 'bg-gold-500/10 border-gold-500/50 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 text-gold-400">
                  {agreedNonInvestment ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
                <div className="text-xs">
                  <span className="font-semibold block text-slate-200">
                    Non-Securities & Voluntary Membership Confirmation
                  </span>
                  I understand that joining the Club does not constitute a public offering of securities or a guarantee of financial returns.
                </div>
              </div>

              <div
                onClick={() => setAgreedProposalFramework(!agreedProposalFramework)}
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                  agreedProposalFramework
                    ? 'bg-gold-500/10 border-gold-500/50 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 text-gold-400">
                  {agreedProposalFramework ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-500" />}
                </div>
                <div className="text-xs">
                  <span className="font-semibold block text-slate-200">
                    Opportunity Proposal & Management Prospecting Framework
                  </span>
                  I agree that member asset recommendations are for collective consideration, while Alliance management conducts formal global prospecting, vetting, and governance.
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center space-x-1.5">
              <CheckCircle2 className={`w-4 h-4 ${allAgreed ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>
                {allAgreed
                  ? 'All terms acknowledged. You may now continue.'
                  : 'Check all 3 mandatory acknowledgments to proceed.'}
              </span>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg transition-colors w-full sm:w-auto text-center"
                >
                  Decline & Exit
                </button>
              )}
              <button
                type="submit"
                disabled={!allAgreed}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all w-full sm:w-auto ${
                  allAgreed
                    ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-slate-950 shadow-gold-glow hover:brightness-110 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Accept & Proceed
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
