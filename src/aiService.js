// aiService.js - Configurable AI service for any OpenAI-compatible provider
import configManager from './configManager.js';

class AIService {
    constructor(config = {}) {
        // Use provided config or load from config manager
        this.config = { ...configManager.getConfig(), ...config };
    }

    async call(instruction, content, emailId, cacheKey) {
        const cacheFullKey = `${emailId}_${cacheKey}`;
        const cachedResponse = this.getCachedResponse(cacheFullKey);
        
        if (cachedResponse) {
            console.log(`Using cached response for ${cacheFullKey}`);
            return cachedResponse;
        }

        const response = await this.makeRequest(instruction, content);
        this.setCachedResponse(cacheFullKey, response);
        return response;
    }

    async makeRequest(instruction, content) {
        // Reload config in case it was updated
        const currentConfig = configManager.getConfig();
        
        // Prepare request body according to OpenAI API format
        const requestBody = {
            model: currentConfig.model,
            messages: [
                { role: 'system', content: currentConfig.systemPrompt },
                { role: 'user', content: `${instruction}

${content}` }
            ]
        };

        const response = await fetch(currentConfig.providerUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentConfig.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        // Handle different response formats from various providers
        if (result.choices && result.choices.length > 0) {
            // Standard OpenAI format
            return result.choices[0].message.content;
        } else if (result.message && result.message.content) {
            // Some providers might use a different format
            return result.message.content;
        } else {
            // Fallback for unexpected response formats
            return JSON.stringify(result);
        }
    }

    // Cache helper functions
    getCachedResponse(key) {
        try {
            const cachedData = localStorage.getItem(key);
            return cachedData ? JSON.parse(cachedData) : null;
        } catch (error) {
            console.error('Cache retrieval error:', error);
            return null;
        }
    }

    setCachedResponse(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Cache storage error:', error);
        }
    }
    
    // Method to update configuration
    updateConfig(newConfig) {
        configManager.saveConfig(newConfig);
        this.config = { ...this.config, ...newConfig };
    }
    
    // Method to get current configuration
    getConfig() {
        return configManager.getConfig();
    }
}

export default AIService;