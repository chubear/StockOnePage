import { shortDate } from '../utils.js';

let institutionalChart = null;

export function renderInstitutionalChart(foreignData, trustData, brokerData) {
  const container = document.getElementById('institutional-chart-container');
  container.innerHTML = '<canvas id="institutional-chart"></canvas>';
  const ctx = document.getElementById('institutional-chart').getContext('2d');

  // Merge dates from all sources, sort ascending
  const dateSet = new Set();
  [foreignData, trustData, brokerData].forEach(arr => {
    (arr || []).forEach(d => dateSet.add(d['日期']));
  });
  const dates = [...dateSet].sort();

  const toMap = (arr, key) => {
    const m = {};
    (arr || []).forEach(d => { m[d['日期']] = d[key] || 0; });
    return m;
  };

  const foreignMap = toMap(foreignData, '外資買賣超');
  const trustMap = toMap(trustData, '投信買賣超');
  const brokerMap = toMap(brokerData, '自營商買賣超');

  if (institutionalChart) institutionalChart.destroy();

  institutionalChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dates.map(shortDate),
      datasets: [
        {
          label: '外資',
          data: dates.map(d => foreignMap[d] || 0),
          backgroundColor: 'rgba(59,130,246,0.8)',
          borderRadius: 2,
        },
        {
          label: '投信',
          data: dates.map(d => trustMap[d] || 0),
          backgroundColor: 'rgba(250,204,21,0.8)',
          borderRadius: 2,
        },
        {
          label: '自營商',
          data: dates.map(d => brokerMap[d] || 0),
          backgroundColor: 'rgba(168,85,247,0.8)',
          borderRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { size: 12 } },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              return `${ctx.dataset.label}: ${ctx.raw.toLocaleString()} 張`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 45 },
          grid: { display: false },
        },
        y: {
          stacked: true,
          ticks: { color: '#94a3b8', font: { size: 11 } },
          grid: { color: '#334155' },
        },
      },
    },
  });
}
