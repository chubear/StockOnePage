import { formatNumber, formatPercent, calcRate, valClass } from '../utils.js';

export function renderIncome(data) {
  const container = document.getElementById('income-table-container');

  // Sort descending (newest first)
  const sorted = [...data].sort((a, b) => String(b['年季']).localeCompare(String(a['年季'])));

  const rows = sorted.map(d => {
    const rev = d['營業收入淨額'];
    const gross = d['營業毛利淨額'];
    const op = d['營業利益'];
    const net = d['稅後純益'];
    const eps = d['每股稅後盈餘'];

    const grossM = calcRate(gross, rev);
    const opM = calcRate(op, rev);
    const netM = calcRate(net, rev);

    return { quarter: d['年季'], rev, grossM, opM, netM, eps };
  });

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>年季</th>
          <th>營收淨額</th>
          <th>毛利率</th>
          <th>營益率</th>
          <th>淨利率</th>
          <th>EPS</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${r.quarter || ''}</td>
            <td>${r.rev != null ? (r.rev / 1e4).toFixed(0) + ' 百萬' : '—'}</td>
            <td class="${valClass(r.grossM)}">${formatPercent(r.grossM)}</td>
            <td class="${valClass(r.opM)}">${formatPercent(r.opM)}</td>
            <td class="${valClass(r.netM)}">${formatPercent(r.netM)}</td>
            <td class="${valClass(r.eps)}">${r.eps != null ? formatNumber(r.eps, 2) : '—'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
