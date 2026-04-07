/** 千分位格式化 */
export function formatNumber(n, decimals = 0) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('zh-TW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** 營收格式化（仟元 → 億元） */
export function formatRevenue(n) {
  if (n == null || isNaN(n)) return '—';
  const v = Number(n);
  if (Math.abs(v) >= 1e8) return (v / 1e8).toFixed(2) + ' 億';
  if (Math.abs(v) >= 1e4) return (v / 1e4).toFixed(2) + ' 萬';
  return formatNumber(v);
}

/** 百分比格式化 */
export function formatPercent(n, decimals = 2) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toFixed(decimals) + '%';
}

/** 漲跌 CSS class */
export function valClass(n) {
  if (n == null || isNaN(n) || Number(n) === 0) return 'val-neutral';
  return Number(n) > 0 ? 'val-up' : 'val-down';
}

/** 漲跌符號 */
export function signStr(n) {
  if (n == null || isNaN(n)) return '';
  return Number(n) > 0 ? '+' : '';
}

/** 日期字串取月日 MM/DD */
export function shortDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return `${parts[1]}/${parts[2]}`;
}

/** 計算比率 (a/b * 100) */
export function calcRate(a, b) {
  if (!b || Number(b) === 0) return null;
  return (Number(a) / Number(b)) * 100;
}

/** 清空容器內容 */
export function clearSection(el) {
  el.innerHTML = '';
}

/** 顯示錯誤訊息 */
export function showError(el, msg = '載入失敗') {
  el.innerHTML = `<div class="section-error">${msg}</div>`;
}
