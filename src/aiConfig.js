// aiConfig.js - Configuration file for AI service

// Default configuration for Together.xyz
export const defaultConfig = {
    providerUrl: 'https://api.together.xyz/v1/chat/completions',
    apiKey: 'YOUR_API_KEY_HERE',
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    systemPrompt: 'You are a helpful assistant that analyzes emails.'
};

// Configuration for OpenAI
export const openaiConfig = {
    providerUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'YOUR_OPENAI_API_KEY_HERE',
    model: 'gpt-4',
    systemPrompt: 'You are a helpful assistant that analyzes emails.'
};

// Configuration for Anthropic Claude
export const anthropicConfig = {
    providerUrl: 'https://api.anthropic.com/v1/messages',
    apiKey: 'YOUR_ANTHROPIC_API_KEY_HERE',
    model: 'claude-3-sonnet-20240229',
    systemPrompt: 'You are a helpful assistant that analyzes emails.'
};

// Configuration for local Ollama
export const ollamaConfig = {
    providerUrl: 'http://localhost:11434/api/chat',
    apiKey: '', // Ollama doesn't require an API key
    model: 'llama3',
    systemPrompt: 'You are a helpful assistant that analyzes emails.'
};

// Configuration for Hugging Face
export const huggingfaceConfig = {
    providerUrl: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    apiKey: 'YOUR_HUGGING_FACE_API_KEY_HERE',
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    systemPrompt: 'You are a helpful assistant that analyzes emails.'
};