import { formatNumber, valClass, signStr } from '../utils.js';
import { renderInstitutionalChart } from '../charts/chip.js';

export function renderInstitutional(foreignData, trustData, brokerData) {
  // Render stacked bar chart
  renderInstitutionalChart(foreignData, trustData, brokerData);

  // Render summary cards
  renderCards(foreignData, trustData, brokerData);
}

function renderCards(foreignData, trustData, brokerData) {
  const container = document.getElementById('institutional-cards');

  const fLatest = foreignData?.[0];
  const tLatest = trustData?.[0];
  const bLatest = brokerData?.[0];

  container.innerHTML = `
    <div class="info-card">
      <div class="card-label">外資</div>
      <div class="card-value ${valClass(fLatest?.['外資買賣超'])}">
        ${fLatest ? signStr(fLatest['外資買賣超']) + formatNumber(fLatest['外資買賣超'], 0) + ' 張' : '—'}
      </div>
      <div class="text-xs text-muted mt-2 space-y-0.5">
        ${fLatest?.['外資持股張數'] != null ? `<div>持股 ${formatNumber(fLatest['外資持股張數'], 0)} 張</div>` : ''}
        ${fLatest?.['外資持股比率'] != null ? `<div>持股比率 ${fLatest['外資持股比率']}%</div>` : ''}
      </div>
    </div>

    <div class="info-card">
      <div class="card-label">投信</div>
      <div class="card-value ${valClass(tLatest?.['投信買賣超'])}">
        ${tLatest ? signStr(tLatest['投信買賣超']) + formatNumber(tLatest['投信買賣超'], 0) + ' 張' : '—'}
      </div>
      <div class="text-xs text-muted mt-2 space-y-0.5">
        ${tLatest?.['投信庫存'] != null ? `<div>庫存 ${formatNumber(tLatest['投信庫存'], 0)} 張</div>` : ''}
        ${tLatest?.['投信持股比率'] != null ? `<div>持股比率 ${tLatest['投信持股比率']}%</div>` : ''}
      </div>
    </div>

    <div class="info-card">
      <div class="card-label">自營商</div>
      <div class="card-value ${valClass(bLatest?.['自營商買賣超'])}">
        ${bLatest ? signStr(bLatest['自營商買賣超']) + formatNumber(bLatest['自營商買賣超'], 0) + ' 張' : '—'}
      </div>
      <div class="text-xs text-muted mt-2 space-y-0.5">
        ${bLatest?.['自營商買賣超_自行買賣'] != null ? `<div>自行 ${signStr(bLatest['自營商買賣超_自行買賣'])}${formatNumber(bLatest['自營商買賣超_自行買賣'], 0)}</div>` : ''}
        ${bLatest?.['自營商買賣超_避險'] != null ? `<div>避險 ${signStr(bLatest['自營商買賣超_避險'])}${formatNumber(bLatest['自營商買賣超_避險'], 0)}</div>` : ''}
      </div>
    </div>
  `;
}
