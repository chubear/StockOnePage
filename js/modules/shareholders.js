import { formatPercent } from '../utils.js';

let doughnutChart = null;
let trendChart = null;

export function renderShareholders(data) {
  if (!data || !data.length) {
    document.getElementById('shareholders-chart-container').innerHTML =
      '<div class="section-error">無股權分散資料</div>';
    return;
  }

  // Sort ascending by date
  const sorted = [...data].sort((a, b) => String(a['日期']).localeCompare(String(b['日期'])));
  const latest = sorted[sorted.length - 1];

  renderDoughnut(latest);
  renderTrend(sorted);
}

function renderDoughnut(d) {
  const container = document.getElementById('shareholders-chart-container');
  container.innerHTML = '<canvas id="shareholders-doughnut"></canvas>';
  const ctx = document.getElementById('shareholders-doughnut').getContext('2d');

  // 這些是累計比率：「X張以上」= 持有 X 張以上的人佔全部的比率
  const big1000 = d['1000張以上佔集保比率'] || 0;
  const above400 = d['400張以上佔集保比率'] || 0;
  const below100 = d['100張以下佔集保比率'] || 0;
  const mid400to1000 = Math.max(0, above400 - big1000);
  const mid100to400 = Math.max(0, 100 - above400 - below100);
  const rest = below100;

  if (doughnutChart) doughnutChart.destroy();

  doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['1000張以上', '400~1000張', '100~400張', '100張以下'],
      datasets: [{
        data: [big1000, mid400to1000, mid100to400, rest],
        backgroundColor: [
          'rgba(59,130,246,0.8)',
          'rgba(168,85,247,0.7)',
          'rgba(250,204,21,0.7)',
          'rgba(100,116,139,0.5)',
        ],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              return `${ctx.label}: ${formatPercent(ctx.raw)}`;
            }
          }
        }
      },
    },
  });
}

function renderTrend(data) {
  const container = document.getElementById('shareholders-trend-container');
  container.innerHTML = '<canvas id="shareholders-trend"></canvas>';
  const ctx = document.getElementById('shareholders-trend').getContext('2d');

  const labels = data.map(d => {
    const s = String(d['日期']);
    return s.slice(5); // MM-DD
  });
  const bigRatio = data.map(d => d['1000張以上佔集保比率'] || 0);

  if (trendChart) trendChart.destroy();

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '1000張以上佔集保比率',
        data: bigRatio,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) { return formatPercent(ctx.raw); }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8', font: { size: 10 } },
          grid: { display: false },
        },
        y: {
          ticks: {
            color: '#94a3b8',
            font: { size: 11 },
            callback: v => v + '%',
          },
          grid: { color: '#334155' },
        },
      },
    },
  });
}
