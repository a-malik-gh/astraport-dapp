'use client';

import React from 'react';
import WalletConnect from '@/components/wallet/WalletConnect';
import ThemeToggle from '../../components/ThemeToggle';
import DriftMonitoringDashboard from '@/components/drift/DriftMonitoringDashboard';
import { useWalletStore } from '@/store';

export default function DriftMonitoringPage() {
  const { connected } = useWalletStore();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img src="/AstraPort_logo.svg" alt="AstraPort Logo" className="w-56 h-14 object-contain" />
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/rebalance"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Rebalance
            </a>
            <ThemeToggle />
            <WalletConnect />
          </div>
        </div>
      </header>

      {connected ? (
        <DriftMonitoringDashboard />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mb-8">
            Connect your wallet to view your portfolio drift monitoring and alerts.
          </p>
        </div>
      )}
    </main>
  );
}