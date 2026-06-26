import { state } from '../core/state.js';
import { loadFromCache, saveToStorage, saveLastTab, loadLastTab, loadPresets, savePresets } from '../core/storage.js';
import { updateModeUI, renderProjectSwitcherPanel } from '../ui/settings.js';
import { switchTab } from '../ui/sidebar.js';

export const setProjectMode = (mode) => {
  state.projectMode = mode;
  saveToStorage('ss_project_mode', mode);
  updateModeUI();
};

export const switchProject = (id) => {
  state.projectId = id;
  const lastTab = loadLastTab(id);
  state.activeTab = lastTab;
  switchTab(lastTab);
  renderProjectSwitcherPanel();
};
