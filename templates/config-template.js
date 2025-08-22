// config-template.js - Configuration template

// Default configuration
export const defaultConfig = {
    providerUrl: 'https://api.together.xyz/v1/chat/completions',
    apiKey: process.env.ANOUK_API_KEY || '',
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    systemPrompt: 'You are a helpful assistant.'
};

// OpenAI configuration
export const openaiConfig = {
    providerUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4',
    systemPrompt: 'You are a helpful assistant.'
};

// Anthropic configuration
export const anthropicConfig = {
    providerUrl: 'https://api.anthropic.com/v1/messages',
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: 'claude-3-sonnet-20240229',
    systemPrompt: 'You are a helpful assistant.'
};

// Ollama configuration (local)
export const ollamaConfig = {
    providerUrl: 'http://localhost:11434/api/chat',
    apiKey: '', // Ollama doesn't require an API key
    model: 'llama3',
    systemPrompt: 'You are a helpful assistant.'
};

// Export all configurations
export default {
    default: defaultConfig,
    openai: openaiConfig,
    anthropic: anthropicConfig,
    ollama: ollamaConfig
};