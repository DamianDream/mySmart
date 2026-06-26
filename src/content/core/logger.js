import { state } from './state.js';
import { loadLogs, saveLogs } from './storage.js';

export const logListeners = [];

export const logAction = (action, detail, payload = null) => {
  const logs = loadLogs();
  
  // Safely stringify and truncate payload if needed
  let safePayload = null;
  if (payload) {
    try {
      const str = JSON.stringify(payload, null, 2);
      safePayload = str.length > 5000 ? str.substring(0, 5000) + '\n...[truncated]' : str;
    } catch (e) {
      safePayload = 'Unserializable payload';
    }
  }

  logs.unshift({ 
    time: Date.now(), 
    action, 
    detail, 
    project: state.projectId, 
    payload: safePayload, 
    id: Date.now() + Math.random() 
  });
  
  if (logs.length > 1000) logs.length = 1000;
  saveLogs(logs);
  
  logListeners.forEach(fn => fn());
};

export const clearLogs = () => { 
  saveLogs([]); 
  logListeners.forEach(fn => fn());
};
