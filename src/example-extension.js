// example-extension.js - Example of how to use the AI Browser Extension library

import { AIService, createSettingsPanel } from './index.js';

// Example 1: Basic usage with default configuration
const aiService = new AIService();

// Example 2: Custom configuration
const customAiService = new AIService({
    providerUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'your-api-key-here',
    model: 'gpt-4',
    systemPrompt: 'You are a helpful assistant.'
});

// Example 3: Runtime configuration updates
customAiService.updateConfig({
    model: 'gpt-3.5-turbo'
});

// Example 4: Making AI calls
async function analyzeEmail(emailContent) {
    try {
        const summary = await customAiService.call(
            'Summarize the following email:', 
            emailContent, 
            'email-123', 
            'summary'
        );
        console.log('Email summary:', summary);
    } catch (error) {
        console.error('Error analyzing email:', error);
    }
}

// Example 5: Creating a settings panel
// const settingsPanel = createSettingsPanel(customAiService);

// Example 6: Using predefined configurations
import { openaiConfig, ollamaConfig } from './aiConfig.js';

const openaiService = new AIService(openaiConfig);
const ollamaService = new AIService(ollamaConfig);