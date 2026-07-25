import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { AssetDrift } from '@/types/drift';

Chart.register(...registerables);

interface DriftHistoryChartProps {
  assetDrifts: AssetDrift[];
}

// Colors for different assets in the chart
const ASSET_COLORS: Record<string, string> = {
  XLM: '#3174f0',
  USDC: '#27ae60',
  BTC: '#f7931a',
  ETH: '#627eea',
  yXLM: '#8e44ad',
  AQUA: '#1abc9c',
};

const DriftHistoryChart: React.FC<DriftHistoryChartProps> = ({ assetDrifts }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Process data for the chart
  const { labels, datasets } = processChartData(assetDrifts);

  useEffect(() => {
    if (!chartRef.current || assetDrifts.length === 0) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9ca3af',
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#f9fafb',
            bodyColor: '#f9fafb',
            borderColor: '#374151',
            borderWidth: 1,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(55, 65, 81, 0.3)',
              tickLength: 0
            },
            ticks: {
              color: '#9ca3af',
              maxRotation: 0
            }
          },
          y: {
            grid: {
              color: 'rgba(55, 65, 81, 0.3)',
              tickLength: 0
            },
            ticks: {
              color: '#9ca3af'
            },
            title: {
              display: true,
              text: 'Drift %',
              color: '#9ca3af'
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [labels, datasets, assetDrifts.length]);

  if (assetDrifts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Drift History</h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500 dark:text-slate-400">No historical drift data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Drift History Over Time</h3>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
      <p className="text-xs text-gray-500 dark:text-slate-500 mt-4 text-center">
        Tracking drift percentage for each asset over the last 24 hours
      </p>
    </div>
  );
};

// Helper function to process all asset history into unified chart data
function processChartData(assetDrifts: AssetDrift[]) {
  const allTimestamps = new Set<string>();
  const timestampToData: Record<string, Record<string, number>> = {};
  const assetCodes: string[] = [];

  // Collect all timestamps and values from all assets
  assetDrifts.forEach((asset) => {
    assetCodes.push(asset.code);
    asset.history.forEach((point) => {
      const time = new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      allTimestamps.add(time);
      
      if (!timestampToData[time]) {
        timestampToData[time] = {};
      }
      timestampToData[time][asset.code] = point.driftPercent;
    });
  });

  // Convert to sorted array of labels
  const labels = Array.from(allTimestamps).sort();

  // Create datasets for Chart.js
  const datasets = assetDrifts.map((asset) => {
    const data = labels.map(time => timestampToData[time]?.[asset.code] || null);
    return {
      label: asset.code,
      data,
      borderColor: ASSET_COLORS[asset.code] || `#${Math.floor(Math.random()*16777215).toString(16)}`,
      backgroundColor: `${ASSET_COLORS[asset.code] || `#${Math.floor(Math.random()*16777215).toString(16)}`}20`,
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 6
    };
  });

  return { labels, datasets };
}

export default DriftHistoryChart;