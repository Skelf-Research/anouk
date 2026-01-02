# Configuration Guide

Learn how to configure Anouk for your specific needs.

---

## Configuration Overview

Anouk uses a hierarchical configuration system:

1. **Default Config** - Built-in defaults from `aiConfig.js`
2. **Stored Config** - Persisted in localStorage
3. **Runtime Config** - Updated via settings panel or code

Higher-priority configurations override lower ones.

---

## Basic Configuration

### AIService Configuration

```javascript
import { AIService } from 'anouk';

const aiService = new AIService({
  provider: 'openai',
  apiKey: 'sk-your-api-key',
  model: 'gpt-4',
  baseUrl: 'https://api.openai.com/v1',
  maxTokens: 2000,
  temperature: 0.7
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `provider` | string | `'together'` | AI provider name |
| `apiKey` | string | `''` | API authentication key |
| `model` | string | varies | Model identifier |
| `baseUrl` | string | varies | API endpoint URL |
| `maxTokens` | number | `2000` | Maximum response tokens |
| `temperature` | number | `0.7` | Response randomness (0-1) |
| `systemPrompt` | string | `''` | Default system instruction |

---

## Using ConfigManager

The `ConfigManager` provides centralized configuration management:

```javascript
import { ConfigManager } from 'anouk';

const config = ConfigManager;

// Load saved configuration
config.loadConfig();

// Update a single setting
config.updateConfig('apiKey', 'new-api-key');

// Update multiple settings
config.updateConfigBatch({
  provider: 'openai',
  model: 'gpt-4',
  apiKey: 'sk-xxx'
});

// Get current configuration
const current = config.getConfig();

// Save to localStorage
config.saveConfig();

// Reset to defaults
config.resetToDefault();
```

---

## Provider Presets

Anouk includes presets for popular providers:

```javascript
const presets = ConfigManager.getPresetConfigs();
```

### Available Presets

#### OpenAI

```javascript
{
  provider: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4',
  maxTokens: 2000
}
```

#### Together.xyz

```javascript
{
  provider: 'together',
  baseUrl: 'https://api.together.xyz/v1',
  model: 'meta-llama/Llama-3-70b-chat-hf',
  maxTokens: 2000
}
```

#### Anthropic Claude

```javascript
{
  provider: 'anthropic',
  baseUrl: 'https://api.anthropic.com/v1',
  model: 'claude-3-opus-20240229',
  maxTokens: 4000
}
```

#### Ollama (Local)

```javascript
{
  provider: 'ollama',
  baseUrl: 'http://localhost:11434/v1',
  model: 'llama2',
  maxTokens: 2000
}
```

#### Hugging Face

```javascript
{
  provider: 'huggingface',
  baseUrl: 'https://api-inference.huggingface.co/v1',
  model: 'meta-llama/Llama-2-70b-chat-hf',
  maxTokens: 2000
}
```

---

## Runtime Configuration

### Settings Panel

Add a settings panel to your extension:

```javascript
import { createSettingsPanel, toggleSettingsPanel } from 'anouk';

// Create the panel
const panel = createSettingsPanel(aiService);
document.body.appendChild(panel);

// Toggle visibility
settingsButton.onclick = () => toggleSettingsPanel(panel);
```

### Programmatic Updates

Update configuration at runtime:

```javascript
// Update AI service configuration
aiService.updateConfig({
  model: 'gpt-3.5-turbo',
  temperature: 0.5
});

// Get current config
const config = aiService.getConfig();
```

---

## Environment-Specific Configuration

### Development

```javascript
const config = {
  provider: 'ollama',
  baseUrl: 'http://localhost:11434/v1',
  model: 'llama2'
};
```

### Production

```javascript
const config = {
  provider: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4'
};
```

### Dynamic Configuration

```javascript
const isDev = process.env.NODE_ENV === 'development';

const aiService = new AIService(
  isDev ? devConfig : prodConfig
);
```

---

## Storage and Persistence

Configuration is stored in localStorage:

```javascript
// Storage key
const STORAGE_KEY = 'anouk_config';

// Manual save
localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

// Manual load
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
```

### Clear Configuration

```javascript
// Clear all Anouk data
localStorage.removeItem('anouk_config');
localStorage.removeItem('anouk_cache');
```

---

## Caching Configuration

Configure response caching behavior:

```javascript
// Caching is automatic with AIService.call()
// The fourth parameter is the cache key type

await aiService.call(
  instruction,
  content,
  emailId,      // Unique identifier
  'summary'     // Cache key suffix
);

// Disable caching for a specific call
await aiService.makeRequest(instruction, content);
```

### Cache Management

```javascript
// Get cached response
const cached = aiService.getCachedResponse(id, 'summary');

// Set cached response
aiService.setCachedResponse(id, 'summary', response);

// Clear all cached responses
localStorage.removeItem('anouk_cache');
```

---

## Security Best Practices

!!! danger "Never Commit API Keys"
    API keys should never be hardcoded or committed to version control.

### Recommended Approaches

1. **Settings Panel**: Let users enter their own keys
2. **Environment Variables**: For build-time injection
3. **Secure Storage**: Use Chrome's `chrome.storage.sync`

### Using Chrome Storage

```javascript
// Save securely
chrome.storage.sync.set({ apiKey: 'sk-xxx' });

// Load
chrome.storage.sync.get(['apiKey'], (result) => {
  aiService.updateConfig({ apiKey: result.apiKey });
});
```

---

## Troubleshooting Configuration

### Config Not Persisting

```javascript
// Ensure saveConfig is called
config.updateConfig('key', 'value');
config.saveConfig(); // Don't forget this!
```

### Wrong Provider Being Used

```javascript
// Check current configuration
console.log(aiService.getConfig());

// Verify preset was applied
console.log(ConfigManager.getPresetConfigs()['openai']);
```

### API Key Issues

```javascript
// Verify key is set
const { apiKey } = aiService.getConfig();
console.log('API Key set:', !!apiKey);
console.log('Key prefix:', apiKey?.substring(0, 5));
```
