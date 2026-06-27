import { saveTheme } from '../core/storage.js';
import { state } from '../core/state.js';
import { shadowRootRef } from '../utils/dom.js';

// The CSS design tokens are declared on #ss-sidebar, so JS overrides
// (theme + accent) must be written to that element — not the shadow host,
// whose inherited values #ss-sidebar would otherwise shadow.
function styleTarget() {
  return (shadowRootRef && shadowRootRef.getElementById('ss-sidebar'))
    || document.getElementById('ss-extension-host');
}

export const THEMES = {
  dark: {
    '--bg-solid': '#282828', '--bg': 'rgba(40, 40, 40, 0.85)', '--bg2': 'rgba(48, 48, 48, 0.70)', '--bg3': 'rgba(255, 255, 255, 0.08)', '--bg4': 'rgba(40, 40, 40, 0.90)',
    '--border': 'rgba(255, 255, 255, 0.08)', '--border2': 'rgba(255, 255, 255, 0.15)',
    '--text': '#ffffff', '--text2': '#f2f2f7', '--text3': '#ebebf5', '--text4': 'rgba(235, 235, 245, 0.6)', '--text5': 'rgba(235, 235, 245, 0.3)',
    '--accent-rgb': '10, 132, 255', '--accent': '#0a84ff', '--accent2': '#5e5ce6', '--accent-bg': 'rgba(10, 132, 255, 0.15)', '--accent-text': '#fff',
    '--success-rgb': '48, 209, 88', '--success': '#30d158',
    '--error-rgb': '255, 69, 58', '--error': '#ff453a',
    '--mark-bg': 'rgba(10, 132, 255, 0.3)', '--mark-text': '#ffffff',
    '--shadow': 'rgba(0,0,0,0.2)', '--blur-depth': '40px',
    '--font-main': "'Outfit', sans-serif",
  },
  light: {
    '--bg-solid': '#f0f2f5', '--bg': 'rgba(255, 255, 255, 0.70)', '--bg2': 'rgba(255, 255, 255, 0.55)', '--bg3': 'rgba(0, 0, 0, 0.04)', '--bg4': 'rgba(245, 245, 250, 0.5)',
    '--border': 'rgba(0, 0, 0, 0.06)', '--border2': 'rgba(0, 0, 0, 0.14)',
    '--text': '#0f172a', '--text2': '#1e293b', '--text3': '#475569', '--text4': '#64748b', '--text5': '#94a3b8',
    '--accent-rgb': '37, 99, 235', '--accent': '#2563eb', '--accent2': '#3b82f6', '--accent-bg': 'rgba(37, 99, 235, 0.12)', '--accent-text': '#fff',
    '--success-rgb': '5, 150, 105', '--success': '#059669',
    '--error-rgb': '220, 38, 38', '--error': '#dc2626',
    '--mark-bg': '#bdd6ff', '--mark-text': '#0040a0',
    '--shadow': 'rgba(0,0,0,0.06)', '--blur-depth': '24px',
    '--font-main': "'Outfit', sans-serif",
  },
};

// Preset accent colors offered in Preferences.
export const ACCENT_PRESETS = [
  { name: 'Blue', value: '#0a84ff' },
  { name: 'Indigo', value: '#5e5ce6' },
  { name: 'Purple', value: '#bf5af2' },
  { name: 'Pink', value: '#ff375f' },
  { name: 'Red', value: '#ff453a' },
  { name: 'Orange', value: '#ff9f0a' },
  { name: 'Green', value: '#30d158' },
  { name: 'Cyan', value: '#64d2ff' },
];

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return null;
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
}

// Scale an "r, g, b" string by a factor (e.g. 0.8 = darker) for the secondary accent.
function shadeRgb(rgb, factor) {
  return rgb.split(',')
    .map(n => Math.max(0, Math.min(255, Math.round(parseInt(n, 10) * factor))))
    .join(', ');
}

export function isValidHex(hex) {
  return /^#[0-9a-f]{6}$/i.test(hex);
}

// Accents that are bright enough to require black button text instead of white.
const DARK_TEXT_ACCENTS = new Set(['#ff9f0a', '#30d158', '#64d2ff']); // Orange, Green, Cyan

// Default accent for a theme (used when no custom color is set).
export function defaultAccent(t = state.theme) {
  return THEMES[t]?.['--accent'] || '#0a84ff';
}

// Override every accent-derived CSS variable with the chosen color.
export function applyAccent(hex, stateRef = state) {
  const root = styleTarget();
  const rgb = hexToRgb(hex);
  if (!root || !rgb) return;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-rgb', rgb);
  root.style.setProperty('--accent-bg', `rgba(${rgb}, 0.15)`);
  // Secondary accent (hover states, focus borders) — a darker shade of the same hue.
  root.style.setProperty('--accent2', `rgb(${shadeRgb(rgb, 0.8)})`);
  // Search highlight color follows the accent too.
  root.style.setProperty('--mark-bg', `rgba(${rgb}, ${stateRef?.theme === 'dark' ? 0.3 : 0.35})`);
  // Bright accents need black button text for contrast.
  root.style.setProperty('--accent-text', DARK_TEXT_ACCENTS.has(hex.toLowerCase()) ? '#000' : '#fff');
}

export function applyTheme(t, stateRef = state) {
  stateRef.theme = t;
  saveTheme(t);
  const vars = THEMES[t];
  const root = styleTarget();
  if (root) {
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }
  // Re-apply the custom accent on top of the freshly applied theme.
  const accent = stateRef.globalSettings?.accentColor;
  if (accent) applyAccent(accent, stateRef);
}
