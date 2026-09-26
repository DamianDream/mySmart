import { saveTheme, saveThemeColors, DEFAULT_THEME_COLORS } from '../core/storage.js';
import { state } from '../core/state.js';
import { shadowRootRef } from '../utils/dom.js';

export { DEFAULT_THEME_COLORS };

// The CSS design tokens are declared on #ss-sidebar, so JS overrides
// must be written to that element — not the shadow host.
function styleTarget() {
  return (shadowRootRef && shadowRootRef.getElementById('ss-sidebar'))
    || document.getElementById('ss-extension-host');
}

export const COLOR_PRESETS = [
  { id: 'dark',  name: 'Dark',  desc: 'Classic Dark',  bg: '#282828', button: '#0a84ff', text: '#ffffff' },
  { id: 'light', name: 'Light', desc: 'Classic Light', bg: '#f0f2f5', button: '#2563eb', text: '#0f172a' },
];

export const THEME_LIST = COLOR_PRESETS;

export const THEMES = {
  dark:  computeThemeVars(COLOR_PRESETS[0]),
  light: computeThemeVars(COLOR_PRESETS[1]),
};

export const ACCENT_PRESETS = [
  { name: 'Blue', value: '#0a84ff' },
  { name: 'Indigo', value: '#5e5ce6' },
  { name: 'Purple', value: '#bf5af2' },
  { name: 'Pink', value: '#ff375f' },
  { name: 'Red', value: '#ff453a' },
  { name: 'Orange', value: '#ff9f0a' },
  { name: 'Green', value: '#30d158' },
  { name: 'Cyan', value: '#64d2ff' },
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
];

export function hexToRgb(hex) {
  if (!hex) return null;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const m = /^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(clean);
  if (!m) return null;
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
}

function hexToRgbArray(hex) {
  const rgbStr = hexToRgb(hex);
  if (!rgbStr) return [0, 0, 0];
  return rgbStr.split(',').map(n => parseInt(n.trim(), 10));
}

export function getLuminance(hex) {
  const [r, g, b] = hexToRgbArray(hex);
  return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
}

export function adjustLightness(hex, percent) {
  const [r, g, b] = hexToRgbArray(hex);
  const adjust = (c) => {
    const res = Math.round(c + (percent > 0 ? (255 - c) * percent : c * percent));
    return Math.max(0, Math.min(255, res)).toString(16).padStart(2, '0');
  };
  return `#${adjust(r)}${adjust(g)}${adjust(b)}`;
}

export function isValidHex(hex) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex || '');
}

export function isDarkTheme(t = state.theme) {
  if (t === 'light' || t === 'mono-light') return false;
  if (t === 'dark' || t === 'mono-dark') return true;
  return getLuminance(state.themeColors?.bg || '#282828') < 0.5;
}

export function defaultAccent(t = state.theme) {
  return state.themeColors?.button || '#0a84ff';
}

export function computeThemeVars({ bg, button, text }) {
  const bgHex = isValidHex(bg) ? bg : DEFAULT_THEME_COLORS.bg;
  const btnHex = isValidHex(button) ? button : DEFAULT_THEME_COLORS.button;
  const textHex = isValidHex(text) ? text : DEFAULT_THEME_COLORS.text;

  const bgRgb = hexToRgb(bgHex) || '40, 40, 40';
  const btnRgb = hexToRgb(btnHex) || '10, 132, 255';
  const textRgb = hexToRgb(textHex) || '255, 255, 255';

  const bgLum = getLuminance(bgHex);
  const isDark = bgLum < 0.5;
  const btnLum = getLuminance(btnHex);

  const bg2 = isDark ? adjustLightness(bgHex, 0.08) : adjustLightness(bgHex, -0.05);
  const bg3 = isDark ? `rgba(${textRgb}, 0.08)` : `rgba(0, 0, 0, 0.05)`;
  const bg4 = isDark ? adjustLightness(bgHex, 0.14) : adjustLightness(bgHex, -0.02);

  const border = isDark ? `rgba(${textRgb}, 0.14)` : `rgba(0, 0, 0, 0.12)`;
  const border2 = isDark ? `rgba(${textRgb}, 0.26)` : `rgba(0, 0, 0, 0.22)`;

  const text2 = `rgba(${textRgb}, 0.90)`;
  const text3 = `rgba(${textRgb}, 0.78)`;
  const text4 = `rgba(${textRgb}, 0.58)`;
  const text5 = `rgba(${textRgb}, 0.38)`;

  const btnHover = btnLum < 0.15 ? adjustLightness(btnHex, 0.25) : adjustLightness(btnHex, -0.15);
  const btnText = btnLum > 0.55 ? '#000000' : '#ffffff';

  return {
    '--bg-solid': bgHex,
    '--bg': `rgba(${bgRgb}, 0.88)`,
    '--bg2': bg2,
    '--bg3': bg3,
    '--bg4': bg4,
    '--border': border,
    '--border2': border2,
    '--text': textHex,
    '--text2': text2,
    '--text3': text3,
    '--text4': text4,
    '--text5': text5,
    '--accent-rgb': btnRgb,
    '--accent': btnHex,
    '--accent2': btnHover,
    '--accent-bg': `rgba(${btnRgb}, 0.16)`,
    '--accent-text': btnText,
    '--success-rgb': '48, 209, 88',
    '--success': '#30d158',
    '--error-rgb': '255, 69, 58',
    '--error': '#ff453a',
    '--mark-bg': `rgba(${btnRgb}, 0.32)`,
    '--mark-text': textHex,
    '--shadow': isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.08)',
    '--blur-depth': isDark ? '32px' : '20px',
    '--font-main': "'Outfit', sans-serif",
  };
}

export function applyThemeColors(colors, stateRef = state) {
  const current = {
    bg: isValidHex(colors?.bg) ? colors.bg : DEFAULT_THEME_COLORS.bg,
    button: isValidHex(colors?.button) ? colors.button : DEFAULT_THEME_COLORS.button,
    text: isValidHex(colors?.text) ? colors.text : DEFAULT_THEME_COLORS.text,
  };
  stateRef.themeColors = current;
  saveThemeColors(current);

  const matched = COLOR_PRESETS.find(p =>
    p.bg.toLowerCase() === current.bg.toLowerCase() &&
    p.button.toLowerCase() === current.button.toLowerCase() &&
    p.text.toLowerCase() === current.text.toLowerCase()
  );
  stateRef.theme = matched ? matched.id : 'custom';
  saveTheme(stateRef.theme);

  const vars = computeThemeVars(current);
  const root = styleTarget();
  if (root) {
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }
}

export function applyTheme(t, stateRef = state) {
  if (typeof t === 'object' && t !== null) {
    applyThemeColors(t, stateRef);
    return;
  }
  const preset = COLOR_PRESETS.find(p => p.id === t);
  if (preset) {
    applyThemeColors({ bg: preset.bg, button: preset.button, text: preset.text }, stateRef);
  } else if (stateRef.themeColors) {
    applyThemeColors(stateRef.themeColors, stateRef);
  } else {
    applyThemeColors(DEFAULT_THEME_COLORS, stateRef);
  }
}

export function applyAccent(hex, stateRef = state) {
  if (!isValidHex(hex)) return;
  const colors = {
    ...(stateRef.themeColors || DEFAULT_THEME_COLORS),
    button: hex,
  };
  applyThemeColors(colors, stateRef);
}
