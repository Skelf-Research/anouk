// index.js - Main entry point for the AI Browser Extension library

import AIService from './aiService.js';
import configManager from './configManager.js';
import { createSettingsPanel, toggleSettingsPanel } from './settingsPanel.js';

// Export all components
export {
    AIService,
    configManager,
    createSettingsPanel,
    toggleSettingsPanel
};

// Default export
export default {
    AIService,
    configManager,
    createSettingsPanel,
    toggleSettingsPanel
};