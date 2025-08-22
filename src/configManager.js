// configManager.js - Configuration manager for AI service

class ConfigManager {
    constructor() {
        // Default configuration for OpenAI-compatible providers
        this.defaultConfig = {
            providerUrl: 'https://api.together.xyz/v1/chat/completions',
            apiKey: '',
            model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
            systemPrompt: 'You are a helpful assistant that analyzes emails.'
        };
        
        // Load configuration from storage if available
        this.loadConfig();
    }
    
    // Load configuration from localStorage
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem('ai-extension-config');
            if (savedConfig) {
                this.config = { ...this.defaultConfig, ...JSON.parse(savedConfig) };
            } else {
                this.config = { ...this.defaultConfig };
            }
        } catch (error) {
            console.error('Error loading configuration:', error);
            this.config = { ...this.defaultConfig };
        }
    }
    
    // Save configuration to localStorage
    saveConfig(config) {
        try {
            this.config = { ...this.config, ...config };
            localStorage.setItem('ai-extension-config', JSON.stringify(this.config));
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }
    
    // Get current configuration
    getConfig() {
        return { ...this.config };
    }
    
    // Update specific configuration values
    updateConfig(key, value) {
        this.config[key] = value;
        this.saveConfig(this.config);
    }
    
    // Update multiple configuration values at once
    updateConfigBatch(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig(this.config);
    }
    
    // Reset to default configuration
    resetToDefault() {
        this.config = { ...this.defaultConfig };
        this.saveConfig(this.config);
    }
    
    // Get available preset configurations
    getPresetConfigs() {
        return {
            together: {
                providerUrl: 'https://api.together.xyz/v1/chat/completions',
                apiKey: '',
                model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                systemPrompt: 'You are a helpful assistant that analyzes emails.'
            },
            openai: {
                providerUrl: 'https://api.openai.com/v1/chat/completions',
                apiKey: '',
                model: 'gpt-4-turbo',
                systemPrompt: 'You are a helpful assistant that analyzes emails.'
            },
            anthropic: {
                providerUrl: 'https://api.anthropic.com/v1/messages',
                apiKey: '',
                model: 'claude-3-sonnet-20240229',
                systemPrompt: 'You are a helpful assistant that analyzes emails.'
            },
            ollama: {
                providerUrl: 'http://localhost:11434/api/chat',
                apiKey: '',
                model: 'llama3',
                systemPrompt: 'You are a helpful assistant that analyzes emails.'
            }
        };
    }
}

// Create a singleton instance
const configManager = new ConfigManager();

export default configManager;