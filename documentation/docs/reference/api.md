# API Reference

Complete API documentation for all Anouk classes, methods, and functions.

---

## Overview

Anouk exports the following main components:

```javascript
import {
  AIService,           // Core AI service class
  ConfigManager,       // Configuration management singleton
  createSettingsPanel, // Settings UI component factory
  toggleSettingsPanel  // Settings panel visibility toggle
} from 'anouk';
```

---

## AIService

The primary class for interacting with AI providers. Handles API calls, caching, rate limiting, and configuration.

### Constructor

```javascript
new AIService(config)
```

Creates a new AIService instance with the specified configuration.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `config` | Object | Yes | - | Configuration object |
| `config.provider` | string | No | `'together'` | AI provider identifier |
| `config.apiKey` | string | Yes* | `''` | API authentication key |
| `config.model` | string | No | Provider-specific | Model identifier |
| `config.baseUrl` | string | No | Provider-specific | API endpoint URL |
| `config.maxTokens` | number | No | `2000` | Maximum response tokens |
| `config.temperature` | number | No | `0.7` | Response randomness (0-2) |
| `config.systemPrompt` | string | No | `''` | Default system instruction |

*Required for cloud providers; not required for local providers like Ollama.

#### Example

```javascript
// Basic initialization
const aiService = new AIService({
  provider: 'openai',
  apiKey: 'sk-your-api-key'
});

// Full configuration
const aiService = new AIService({
  provider: 'openai',
  apiKey: 'sk-your-api-key',
  model: 'gpt-4',
  baseUrl: 'https://api.openai.com/v1',
  maxTokens: 4000,
  temperature: 0.5,
  systemPrompt: 'You are a helpful assistant specialized in summarization.'
});
```

---

### Methods

#### call()

Makes an AI API call with automatic caching and rate limiting.

```javascript
aiService.call(instruction, content, id, cacheKey) → Promise<string>
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `instruction` | string | Yes | The prompt/instruction for the AI |
| `content` | string | Yes | The content to process |
| `id` | string | Yes | Unique identifier for caching (e.g., URL, email ID) |
| `cacheKey` | string | Yes | Cache key suffix to differentiate cache types |

##### Returns

`Promise<string>` - The AI-generated response text

##### Behavior

1. **Cache Check**: First checks if a cached response exists for `${id}_${cacheKey}`
2. **Rate Limiting**: If no cache, waits for request queue (1-second delay between requests)
3. **API Call**: Makes the API request with the combined instruction and content
4. **Cache Storage**: Stores successful responses in cache
5. **Return**: Returns the response text

##### Example

```javascript
// Basic usage
const summary = await aiService.call(
  'Summarize this article in 3 sentences',
  articleText,
  'article-123',
  'summary'
);

// Different cache keys for different operations
const summary = await aiService.call('Summarize', text, pageUrl, 'summary');
const analysis = await aiService.call('Analyze sentiment', text, pageUrl, 'sentiment');
const keywords = await aiService.call('Extract keywords', text, pageUrl, 'keywords');
```

##### Error Handling

```javascript
try {
  const result = await aiService.call(instruction, content, id, key);
} catch (error) {
  if (error.message.includes('401')) {
    // Invalid API key
  } else if (error.message.includes('429')) {
    // Rate limited (rare with built-in rate limiting)
  } else if (error.message.includes('500')) {
    // Server error
  }
}
```

---

#### makeRequest()

Makes a direct API call without caching. Useful when you need fresh results or don't want to pollute the cache.

```javascript
aiService.makeRequest(instruction, content) → Promise<string>
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `instruction` | string | Yes | The prompt/instruction |
| `content` | string | Yes | The content to process |

##### Returns

`Promise<string>` - The AI response text

##### Example

```javascript
// Always get fresh results
const freshAnalysis = await aiService.makeRequest(
  'What is the current sentiment of this text?',
  userInput
);

// Real-time translation without caching
const translation = await aiService.makeRequest(
  'Translate to French',
  englishText
);
```

##### Note

This method still uses the request queue for rate limiting but bypasses the cache entirely.

---

#### getCachedResponse()

Retrieves a previously cached response.

```javascript
aiService.getCachedResponse(id, cacheKey) → string | null
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier used when caching |
| `cacheKey` | string | Yes | The cache key suffix |

##### Returns

`string | null` - The cached response or `null` if not found

##### Example

```javascript
// Check cache before making expensive API call
const cached = aiService.getCachedResponse(emailId, 'summary');
if (cached) {
  displaySummary(cached);
} else {
  const fresh = await aiService.call(instruction, content, emailId, 'summary');
  displaySummary(fresh);
}
```

---

#### setCachedResponse()

Manually stores a response in the cache.

```javascript
aiService.setCachedResponse(id, cacheKey, response) → void
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier |
| `cacheKey` | string | Yes | The cache key suffix |
| `response` | string | Yes | The response to cache |

##### Example

```javascript
// Manually cache a computed result
const processedResult = postProcess(aiResponse);
aiService.setCachedResponse(documentId, 'processed', processedResult);

// Pre-populate cache from external source
const savedSummaries = await fetchSavedSummaries();
savedSummaries.forEach(s => {
  aiService.setCachedResponse(s.id, 'summary', s.text);
});
```

---

#### updateConfig()

Updates the service configuration at runtime.

```javascript
aiService.updateConfig(newConfig) → void
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `newConfig` | Object | Yes | Configuration properties to update |

##### Example

```javascript
// Update single property
aiService.updateConfig({ temperature: 0.3 });

// Update multiple properties
aiService.updateConfig({
  model: 'gpt-4-turbo',
  maxTokens: 8000,
  temperature: 0.5
});

// Switch providers
aiService.updateConfig({
  provider: 'anthropic',
  apiKey: 'sk-ant-new-key',
  model: 'claude-3-opus-20240229',
  baseUrl: 'https://api.anthropic.com/v1'
});
```

##### Note

Configuration changes take effect immediately for subsequent API calls. Existing cached responses remain valid.

---

#### getConfig()

Returns the current configuration.

```javascript
aiService.getConfig() → Object
```

##### Returns

`Object` - The current configuration object

##### Example

```javascript
const config = aiService.getConfig();
console.log('Current provider:', config.provider);
console.log('Current model:', config.model);
console.log('API key set:', !!config.apiKey);

// Conditional logic based on config
if (config.provider === 'ollama') {
  console.log('Using local model - no API costs');
}
```

---

## ConfigManager

A singleton for managing configuration persistence across sessions. Handles loading, saving, and managing provider presets.

### Importing

```javascript
import { ConfigManager } from 'anouk';

// ConfigManager is a singleton - same instance everywhere
const config = ConfigManager;
```

---

### Methods

#### loadConfig()

Loads configuration from localStorage.

```javascript
ConfigManager.loadConfig() → Object
```

##### Returns

`Object` - The loaded configuration, merged with defaults

##### Example

```javascript
// Load saved configuration on startup
const savedConfig = ConfigManager.loadConfig();
const aiService = new AIService(savedConfig);
```

---

#### saveConfig()

Saves the current configuration to localStorage.

```javascript
ConfigManager.saveConfig() → void
```

##### Example

```javascript
// Update and save
ConfigManager.updateConfig('apiKey', 'new-key');
ConfigManager.saveConfig();  // Persists to localStorage
```

---

#### getConfig()

Returns the current configuration state.

```javascript
ConfigManager.getConfig() → Object
```

##### Returns

`Object` - Current configuration object

---

#### updateConfig()

Updates a single configuration value.

```javascript
ConfigManager.updateConfig(key, value) → void
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | Yes | Configuration key to update |
| `value` | any | Yes | New value |

##### Example

```javascript
ConfigManager.updateConfig('apiKey', 'sk-new-key');
ConfigManager.updateConfig('temperature', 0.8);
ConfigManager.saveConfig();  // Remember to save!
```

---

#### updateConfigBatch()

Updates multiple configuration values at once.

```javascript
ConfigManager.updateConfigBatch(updates) → void
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `updates` | Object | Yes | Object with key-value pairs to update |

##### Example

```javascript
// Switch to OpenAI
ConfigManager.updateConfigBatch({
  provider: 'openai',
  apiKey: 'sk-xxx',
  model: 'gpt-4',
  baseUrl: 'https://api.openai.com/v1'
});
ConfigManager.saveConfig();
```

---

#### getPresetConfigs()

Returns predefined configurations for supported providers.

```javascript
ConfigManager.getPresetConfigs() → Object
```

##### Returns

`Object` - Map of provider names to their default configurations

##### Example

```javascript
const presets = ConfigManager.getPresetConfigs();

console.log(presets);
// {
//   openai: { provider: 'openai', baseUrl: '...', model: 'gpt-4', ... },
//   together: { provider: 'together', baseUrl: '...', model: '...', ... },
//   anthropic: { ... },
//   ollama: { ... },
//   huggingface: { ... }
// }

// Apply a preset
const openaiPreset = presets.openai;
ConfigManager.updateConfigBatch({
  ...openaiPreset,
  apiKey: 'your-key'
});
```

---

#### resetToDefault()

Resets configuration to built-in defaults.

```javascript
ConfigManager.resetToDefault() → void
```

##### Example

```javascript
// Reset everything to defaults
ConfigManager.resetToDefault();
ConfigManager.saveConfig();

// User must re-enter API key after reset
```

---

## UI Functions

### createSettingsPanel()

Creates a settings panel UI component for runtime configuration.

```javascript
createSettingsPanel(aiService) → HTMLElement
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `aiService` | AIService | Yes | The AIService instance to configure |

#### Returns

`HTMLElement` - The settings panel DOM element

#### Example

```javascript
import { AIService, createSettingsPanel } from 'anouk';

const aiService = new AIService({ provider: 'together' });
const settingsPanel = createSettingsPanel(aiService);

// Add to DOM
document.body.appendChild(settingsPanel);
```

#### Panel Features

The settings panel includes:

- **Provider Selector**: Dropdown to switch between providers
- **API Key Input**: Secure input for API key
- **Model Selector**: Choose from available models
- **Temperature Slider**: Adjust response creativity
- **Max Tokens Input**: Set response length limit
- **Save Button**: Persist changes
- **Reset Button**: Restore defaults

---

### toggleSettingsPanel()

Shows or hides the settings panel.

```javascript
toggleSettingsPanel(panel) → void
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `panel` | HTMLElement | Yes | The settings panel element |

#### Example

```javascript
import { createSettingsPanel, toggleSettingsPanel } from 'anouk';

const settingsPanel = createSettingsPanel(aiService);
document.body.appendChild(settingsPanel);

// Toggle on button click
settingsButton.addEventListener('click', () => {
  toggleSettingsPanel(settingsPanel);
});

// Toggle on keyboard shortcut
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === ',') {
    e.preventDefault();
    toggleSettingsPanel(settingsPanel);
  }
});
```

---

## Type Definitions

### Configuration Object

```typescript
interface AnoukConfig {
  /** AI provider identifier */
  provider: 'openai' | 'together' | 'anthropic' | 'ollama' | 'huggingface' | string;

  /** API authentication key */
  apiKey: string;

  /** Model identifier */
  model: string;

  /** API endpoint URL */
  baseUrl: string;

  /** Maximum response tokens */
  maxTokens: number;

  /** Response randomness (0-2) */
  temperature: number;

  /** Default system instruction */
  systemPrompt?: string;
}
```

### Provider Preset

```typescript
interface ProviderPreset {
  provider: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
}
```

### Cache Entry

```typescript
// Cache keys are stored as: `anouk_cache_${id}_${cacheKey}`
interface CacheStorage {
  [key: string]: string;  // Response text
}
```

---

## Error Types

### API Errors

| Status | Error Type | Common Causes | Resolution |
|--------|------------|---------------|------------|
| 400 | Bad Request | Invalid parameters, malformed request | Check request format |
| 401 | Unauthorized | Invalid or missing API key | Verify API key |
| 403 | Forbidden | Key lacks permissions, region restricted | Check key permissions |
| 404 | Not Found | Invalid model name or endpoint | Verify model/baseUrl |
| 429 | Rate Limited | Too many requests | Wait and retry (handled automatically) |
| 500 | Server Error | Provider issues | Check provider status |
| 503 | Service Unavailable | Provider overloaded | Retry later |

### Handling Errors

```javascript
try {
  const result = await aiService.call(instruction, content, id, key);
  return result;
} catch (error) {
  const message = error.message.toLowerCase();

  if (message.includes('401') || message.includes('unauthorized')) {
    // API key issue
    showSettings();
    return 'Please check your API key in settings.';
  }

  if (message.includes('429') || message.includes('rate')) {
    // Rate limited - Anouk handles this, but if it persists:
    return 'Service is busy. Please try again in a moment.';
  }

  if (message.includes('network') || message.includes('fetch')) {
    // Network issue
    return 'Network error. Please check your connection.';
  }

  // Unknown error
  console.error('AI Service Error:', error);
  return 'An unexpected error occurred. Please try again.';
}
```

---

## Advanced Usage

### Custom Request Interceptor

```javascript
class ExtendedAIService extends AIService {
  async makeRequest(instruction, content) {
    // Pre-process
    const processedContent = this.preProcess(content);

    // Call parent
    const response = await super.makeRequest(instruction, processedContent);

    // Post-process
    return this.postProcess(response);
  }

  preProcess(content) {
    // Clean up content
    return content.replace(/\s+/g, ' ').trim();
  }

  postProcess(response) {
    // Format response
    return response.trim();
  }
}
```

### Batch Processing

```javascript
async function batchProcess(items, aiService) {
  const results = [];

  for (const item of items) {
    // Anouk's built-in rate limiting handles timing
    const result = await aiService.call(
      'Process this item',
      item.content,
      item.id,
      'processed'
    );
    results.push({ id: item.id, result });
  }

  return results;
}
```

### Cache Warming

```javascript
async function warmCache(urls, aiService) {
  console.log('Warming cache for', urls.length, 'pages');

  for (const url of urls) {
    // Check if already cached
    const cached = aiService.getCachedResponse(url, 'summary');
    if (cached) continue;

    // Fetch and cache
    const content = await fetchPageContent(url);
    await aiService.call('Summarize', content, url, 'summary');
  }

  console.log('Cache warming complete');
}
```

---

## Best Practices

### 1. Always Handle Errors

```javascript
// Good
try {
  const result = await aiService.call(...);
  displayResult(result);
} catch (error) {
  displayError(error.message);
}

// Bad - unhandled rejection
const result = await aiService.call(...);
displayResult(result);
```

### 2. Use Meaningful Cache Keys

```javascript
// Good - specific and meaningful
aiService.call(instruction, content, emailId, 'summary');
aiService.call(instruction, content, emailId, 'reply_formal');
aiService.call(instruction, content, emailId, 'reply_casual');

// Bad - generic or reused keys
aiService.call(instruction, content, 'key1', 'data');
```

### 3. Configure System Prompts

```javascript
// Good - specific system prompt
const aiService = new AIService({
  systemPrompt: `You are an email assistant. Be professional,
    concise, and focus on actionable information.`
});

// Less optimal - generic or no system prompt
const aiService = new AIService({});
```

### 4. Save Configuration Changes

```javascript
// Good - save after batch updates
ConfigManager.updateConfigBatch({ ... });
ConfigManager.saveConfig();

// Bad - forgetting to save
ConfigManager.updateConfig('apiKey', 'new-key');
// Lost on page refresh!
```
