import { formatNumber, formatPercent, valClass, signStr } from '../utils.js';

export function renderProfile(profileData, quotesData) {
  const el = document.getElementById('profile-content');
  const p = profileData?.[0];
  const q = quotesData?.[0]; // latest quote

  if (!p && !q) {
    el.innerHTML = '<div class="section-error">無公司資料</div>';
    return;
  }

  const name = p?.['股票名稱'] || q?.['股票名稱'] || '';
  const fullName = p?.['公司名稱'] || '';
  const industry = p?.['產業名稱'] || '';
  const chairman = p?.['董事長'] || '';
  const capital = p?.['實收資本額'];
  const listDate = p?.['上市日期'] || p?.['上櫃日期'] || '';

  const close = q?.['收盤價'];
  const change = q?.['漲跌'];
  const changeP = q?.['漲幅'];
  const pe = q?.['本益比'];
  const pb = q?.['股價淨值比'];
  const vol = q?.['成交量'];
  const mktCap = q?.['總市值'];
  const date = q?.['日期'] || '';

  el.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <div class="flex items-baseline gap-3 mb-1">
          <span class="text-2xl font-bold">${p?.['股票代號'] || ''} ${name}</span>
          <span class="text-sm text-muted">${industry}</span>
        </div>
        <div class="text-sm text-muted space-x-4">
          ${fullName ? `<span>${fullName}</span>` : ''}
          ${chairman ? `<span>董事長：${chairman}</span>` : ''}
          ${capital ? `<span>資本額：${formatNumber(capital / 1e8, 2)} 億</span>` : ''}
          ${listDate ? `<span>上市：${listDate}</span>` : ''}
        </div>
      </div>
      ${close != null ? `
      <div class="text-right shrink-0">
        <div class="text-3xl font-bold ${valClass(change)}">${formatNumber(close, 2)}</div>
        <div class="text-sm ${valClass(change)}">
          ${signStr(change)}${formatNumber(change, 2)}（${signStr(changeP)}${formatPercent(changeP)}）
        </div>
        <div class="text-xs text-muted mt-1">${date}</div>
        <div class="flex gap-4 mt-2 text-xs text-muted justify-end">
          ${pe != null ? `<span>PE ${formatNumber(pe, 1)}</span>` : ''}
          ${pb != null ? `<span>PB ${formatNumber(pb, 2)}</span>` : ''}
          ${vol != null ? `<span>量 ${formatNumber(vol, 0)} 張</span>` : ''}
          ${mktCap != null ? `<span>市值 ${formatNumber(mktCap, 1)} 億</span>` : ''}
        </div>
      </div>` : ''}
    </div>
  `;
}
