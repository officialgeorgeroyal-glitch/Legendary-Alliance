'use client';

import React, { useEffect, useRef, useState } from 'react';

type KycStatus = 'Pending Review' | 'Verified' | 'Needs Info';

interface KycRecord {
  id: string;
  fullName: string;
  documentType: string;
  documentNumberMasked: string;
  country: string;
  status: KycStatus;
  updatedAt: string;
}

const KYC_STORAGE_KEY = 'legendary_alliance_kyc_v1';

const SEED_KYC_RECORDS: KycRecord[] = [
  {
    id: 'KYC-5001',
    fullName: 'George Royal',
    documentType: 'Passport / Residence Card',
    documentNumberMasked: 'PT-****-8841',
    country: 'Portugal',
    status: 'Verified',
    updatedAt: '2026-11-10',
  },
];

function maskDocumentNumber(rawValue: string): string {
  const cleaned = rawValue.trim();
  if (cleaned.length <= 4) {
    return cleaned ? `****-${cleaned}` : '****';
  }
  const tail = cleaned.slice(-4);
  return `****-${tail}`;
}

export default function KycPage() {
  const [records, setRecords] = useState<KycRecord[]>(SEED_KYC_RECORDS);
  const [fullName, setFullName] = useState('');
  const [documentType, setDocumentType] = useState('National ID / Residence Card');
  const [documentNumber, setDocumentNumber] = useState('');
  const [country, setCountry] = useState('Portugal');
  const [status, setStatus] = useState<KycStatus>('Pending Review');
  const [error, setError] = useState<string | null>(null);
  const initialRecordsRef = useRef<KycRecord[]>(SEED_KYC_RECORDS);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KYC_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed);
        }
      }
    } catch {
      // Keep seed KYC records on storage read failure
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(records));
    } catch {
      // Ignore storage write errors
    }
  }, [records]);

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedName = fullName.trim();
    const trimmedDoc = documentNumber.trim();
    const trimmedCountry = country.trim();

    if (!trimmedName) {
      setError('Please enter the member full name.');
      return;
    }
    if (!trimmedDoc) {
      setError('Please enter an identity or reference number.');
      return;
    }

    const nextRecord: KycRecord = {
      id: `KYC-${Date.now().toString().slice(-4)}`,
      fullName: trimmedName,
      documentType,
      documentNumberMasked: maskDocumentNumber(trimmedDoc),
      country: trimmedCountry || 'Portugal',
      status,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setRecords((prev) => [nextRecord, ...prev]);
    setFullName('');
    setDocumentNumber('');
  };

  const handleResetSeedKyc = () => {
    try {
      window.localStorage.removeItem(KYC_STORAGE_KEY);
    } catch {
      // Ignore storage removal errors
    }
    setRecords(initialRecordsRef.current);
    setError(null);
  };

  const latestStatus = records[0]?.status ?? 'Pending Review';

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold">Member KYC Verification</h1>
            <p className="text-sm text-gray-400">
              Submit and review member identity verification status with local persistence.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-right">
            <div className="text-xs text-gray-400">Current Verification Status</div>
            <div className="text-lg font-semibold text-amber-300">{latestStatus}</div>
          </div>
        </div>

        <form onSubmit={handleSubmitKyc} className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Member Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full legal name"
                className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
              >
                <option value="National ID / Residence Card">National ID / Residence Card</option>
                <option value="Passport">Passport</option>
                <option value="Proof of Address">Proof of Address</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Document Number (Masked in History)</label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g., AB123456"
                className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as KycStatus)}
                  className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white"
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Verified">Verified</option>
                  <option value="Needs Info">Needs Info</option>
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleResetSeedKyc}
              className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/5"
            >
              Reset Seed KYC
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 text-black font-semibold px-4 py-2 text-xs hover:bg-amber-400"
            >
              Save KYC Record
            </button>
          </div>
        </form>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-3">
          <h2 className="text-base font-semibold">KYC Verification Log</h2>
          <div className="space-y-2">
            {records.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/30 border border-white/10 px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-medium text-white">{item.fullName}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {item.documentType} ({item.documentNumberMasked}) · {item.country}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded px-2 py-0.5 text-xs bg-white/10 text-amber-300">
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-400">{item.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}