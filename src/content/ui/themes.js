import { saveTheme } from '../core/storage.js';
import { state } from '../core/state.js';

export const THEMES = {
  dark: {
    '--bg-solid': '#282828', '--bg': 'rgba(40, 40, 40, 0.85)', '--bg2': 'rgba(48, 48, 48, 0.70)', '--bg3': 'rgba(255, 255, 255, 0.08)', '--bg4': 'rgba(40, 40, 40, 0.90)',
    '--border': 'rgba(255, 255, 255, 0.08)', '--border2': 'rgba(255, 255, 255, 0.15)',
    '--text': '#ffffff', '--text2': '#f2f2f7', '--text3': '#ebebf5', '--text4': 'rgba(235, 235, 245, 0.6)', '--text5': 'rgba(235, 235, 245, 0.3)',
    '--accent-rgb': '10, 132, 255', '--accent': '#0a84ff', '--accent2': '#5e5ce6', '--accent-bg': 'rgba(10, 132, 255, 0.15)',
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
    '--accent-rgb': '37, 99, 235', '--accent': '#2563eb', '--accent2': '#3b82f6', '--accent-bg': 'rgba(37, 99, 235, 0.12)',
    '--success-rgb': '5, 150, 105', '--success': '#059669',
    '--error-rgb': '220, 38, 38', '--error': '#dc2626',
    '--mark-bg': '#bdd6ff', '--mark-text': '#0040a0',
    '--shadow': 'rgba(0,0,0,0.06)', '--blur-depth': '24px',
    '--font-main': "'Outfit', sans-serif",
  },
};

export function applyTheme(t, stateRef = state) {
  stateRef.theme = t;
  saveTheme(t);
  const vars = THEMES[t];
  const root = document.getElementById('ss-extension-host');
  if (root) {
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }
}
