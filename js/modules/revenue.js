import { formatRevenue, formatPercent, valClass } from '../utils.js';

let revenueChart = null;

export function renderRevenue(data) {
  const chartContainer = document.getElementById('revenue-chart-container');
  const tableContainer = document.getElementById('revenue-table-container');

  // Sort ascending by date
  const sorted = [...data].sort((a, b) => String(a['年月']).localeCompare(String(b['年月'])));

  renderChart(chartContainer, sorted);
  renderTable(tableContainer, sorted);
}

function renderChart(container, data) {
  container.innerHTML = '<canvas id="revenue-chart"></canvas>';
  const ctx = document.getElementById('revenue-chart').getContext('2d');

  const labels = data.map(d => String(d['年月']).slice(-2) + '月');
  const revenues = data.map(d => (d['單月合併營收'] || 0) / 1e4); // 仟元→百萬
  const yoy = data.map(d => d['單月合併營收年成長'] || 0);

  if (revenueChart) revenueChart.destroy();

  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '單月營收 (百萬)',
          data: revenues,
          backgroundColor: revenues.map((_, i) =>
            yoy[i] >= 0 ? 'rgba(239,68,68,0.7)' : 'rgba(34,197,94,0.7)'
          ),
          borderRadius: 3,
          yAxisID: 'y',
        },
        {
          label: 'YoY%',
          data: yoy,
          type: 'line',
          borderColor: '#facc15',
          backgroundColor: 'transparent',
          pointRadius: 3,
          pointBackgroundColor: '#facc15',
          tension: 0.3,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              if (ctx.datasetIndex === 0) return `營收: ${ctx.raw.toFixed(0)} 百萬`;
              return `YoY: ${ctx.raw.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8', font: { size: 11 } },
          grid: { display: false },
        },
        y: {
          position: 'left',
          ticks: { color: '#94a3b8', font: { size: 11 } },
          grid: { color: '#334155' },
        },
        y1: {
          position: 'right',
          ticks: {
            color: '#facc15',
            font: { size: 11 },
            callback: v => v + '%',
          },
          grid: { display: false },
        },
      },
    },
  });
}

function renderTable(container, data) {
  // Show descending (newest first)
  const rows = [...data].reverse();

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>年月</th>
          <th>單月營收</th>
          <th>YoY%</th>
          <th>累計營收</th>
          <th>累計 YoY%</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(d => `
          <tr>
            <td>${d['年月'] || ''}</td>
            <td>${formatRevenue(d['單月合併營收'])}</td>
            <td class="${valClass(d['單月合併營收年成長'])}">${formatPercent(d['單月合併營收年成長'])}</td>
            <td>${formatRevenue(d['累計合併營收'])}</td>
            <td class="${valClass(d['累計合併營收成長'])}">${formatPercent(d['累計合併營收成長'])}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
