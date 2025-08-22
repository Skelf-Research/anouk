// service-template.js - AI service template
import { AIService } from 'anouk';

class CustomAIService extends AIService {
    constructor(config = {}) {
        // Default configuration for this service
        const defaultConfig = {
            providerUrl: 'https://api.openai.com/v1/chat/completions',
            apiKey: process.env.OPENAI_API_KEY || '',
            model: 'gpt-4',
            systemPrompt: 'You are a helpful assistant.'
        };
        
        super({ ...defaultConfig, ...config });
    }
    
    async analyzeText(text, context = '') {
        const instruction = context 
            ? `Analyze the following text in the context of "${context}":`
            : 'Analyze the following text:';
            
        return await this.call(
            instruction,
            text,
            'text-analysis',
            'result'
        );
    }
    
    async generateSummary(text) {
        return await this.call(
            'Summarize the following text:',
            text,
            'summary',
            'result'
        );
    }
    
    async extractKeywords(text) {
        return await this.call(
            'Extract the main keywords from the following text and return them as a comma-separated list:',
            text,
            'keywords',
            'result'
        );
    }
}

export default CustomAIService;