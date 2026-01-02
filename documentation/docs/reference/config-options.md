# Configuration Options

Complete reference for all Anouk configuration options.

---

## Core Options

### provider

**Type:** `string`
**Default:** `'together'`
**Required:** No

The AI provider to use. Determines which preset configuration to apply.

```javascript
{ provider: 'openai' }
```

**Valid values:** `'openai'`, `'together'`, `'anthropic'`, `'ollama'`, `'huggingface'`, or any custom string.

---

### apiKey

**Type:** `string`
**Default:** `''`
**Required:** Yes (for cloud providers)

API authentication key for the provider.

```javascript
{ apiKey: 'sk-your-api-key-here' }
```

!!! warning "Security"
    Never commit API keys to version control. Use environment variables or runtime configuration.

---

### model

**Type:** `string`
**Default:** Varies by provider
**Required:** No

The model identifier to use for API requests.

```javascript
{ model: 'gpt-4' }
```

**Common values by provider:**

| Provider | Models |
|----------|--------|
| OpenAI | `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo` |
| Together | `meta-llama/Llama-3-70b-chat-hf`, `mistralai/Mixtral-8x7B-Instruct-v0.1` |
| Anthropic | `claude-3-opus-20240229`, `claude-3-sonnet-20240229` |
| Ollama | `llama2`, `mistral`, `codellama` |

---

### baseUrl

**Type:** `string`
**Default:** Varies by provider
**Required:** No

The API endpoint URL.

```javascript
{ baseUrl: 'https://api.openai.com/v1' }
```

**Default values by provider:**

| Provider | Base URL |
|----------|----------|
| OpenAI | `https://api.openai.com/v1` |
| Together | `https://api.together.xyz/v1` |
| Anthropic | `https://api.anthropic.com/v1` |
| Ollama | `http://localhost:11434/v1` |
| Hugging Face | `https://api-inference.huggingface.co/v1` |

---

## Generation Options

### maxTokens

**Type:** `number`
**Default:** `2000`
**Required:** No

Maximum number of tokens in the response.

```javascript
{ maxTokens: 4000 }
```

**Considerations:**
- Higher values allow longer responses
- May increase API costs
- Must be within model's context limit

---

### temperature

**Type:** `number`
**Default:** `0.7`
**Range:** `0` to `1` (some models support up to `2`)
**Required:** No

Controls response randomness/creativity.

```javascript
{ temperature: 0.3 }
```

**Guidelines:**

| Value | Effect | Use Case |
|-------|--------|----------|
| 0.0-0.3 | More deterministic | Factual, consistent outputs |
| 0.4-0.7 | Balanced | General use |
| 0.8-1.0 | More creative | Creative writing, brainstorming |

---

### systemPrompt

**Type:** `string`
**Default:** `''`
**Required:** No

Default system instruction prepended to all requests.

```javascript
{
  systemPrompt: 'You are a helpful email assistant. Be concise and professional.'
}
```

**Best practices:**
- Keep it concise but specific
- Define the assistant's role and behavior
- Include any constraints or formatting requirements

---

## Provider Presets

Presets provide sensible defaults for each provider. Access via:

```javascript
ConfigManager.getPresetConfigs()
```

### OpenAI Preset

```javascript
{
  provider: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4',
  maxTokens: 2000,
  temperature: 0.7
}
```

### Together Preset

```javascript
{
  provider: 'together',
  baseUrl: 'https://api.together.xyz/v1',
  model: 'meta-llama/Llama-3-70b-chat-hf',
  maxTokens: 2000,
  temperature: 0.7
}
```

### Anthropic Preset

```javascript
{
  provider: 'anthropic',
  baseUrl: 'https://api.anthropic.com/v1',
  model: 'claude-3-opus-20240229',
  maxTokens: 4000,
  temperature: 0.7
}
```

### Ollama Preset

```javascript
{
  provider: 'ollama',
  baseUrl: 'http://localhost:11434/v1',
  model: 'llama2',
  maxTokens: 2000,
  temperature: 0.7
}
```

### Hugging Face Preset

```javascript
{
  provider: 'huggingface',
  baseUrl: 'https://api-inference.huggingface.co/v1',
  model: 'meta-llama/Llama-2-70b-chat-hf',
  maxTokens: 2000,
  temperature: 0.7
}
```

---

## Storage Keys

Anouk uses localStorage with these keys:

| Key | Purpose |
|-----|---------|
| `anouk_config` | Persisted configuration |
| `anouk_cache_*` | Cached API responses |

### Clear All Data

```javascript
// Clear configuration
localStorage.removeItem('anouk_config');

// Clear all cached responses
Object.keys(localStorage)
  .filter(key => key.startsWith('anouk_cache_'))
  .forEach(key => localStorage.removeItem(key));
```

---

## Environment Variables

For build-time configuration:

```javascript
// In your extension code
const config = {
  apiKey: process.env.ANOUK_API_KEY,
  provider: process.env.ANOUK_PROVIDER || 'together'
};
```

**With esbuild:**

```bash
esbuild src/extension.js --bundle --define:process.env.ANOUK_API_KEY=\"your-key\"
```

---

## Configuration Priority

Configuration is resolved in this order (highest priority first):

1. **Runtime updates** - `aiService.updateConfig()`
2. **Constructor config** - `new AIService(config)`
3. **Stored config** - From localStorage
4. **Provider preset** - Based on provider name
5. **Default config** - Built-in defaults

**Example:**

```javascript
// Default: temperature = 0.7
// Stored config: temperature = 0.5
// Constructor: temperature not specified
// Runtime: aiService.updateConfig({ temperature: 0.3 })

// Result: temperature = 0.3
```

---

## Complete Configuration Example

```javascript
import { AIService } from 'anouk';

const aiService = new AIService({
  // Provider identification
  provider: 'openai',

  // Authentication
  apiKey: 'sk-your-api-key',

  // API endpoint
  baseUrl: 'https://api.openai.com/v1',

  // Model selection
  model: 'gpt-4',

  // Generation parameters
  maxTokens: 2000,
  temperature: 0.7,

  // System behavior
  systemPrompt: `You are a helpful assistant that specializes in
email analysis. Always respond in a professional, concise manner.
Format lists using bullet points.`
});
```

---

## Validation

Anouk performs basic validation on configuration:

| Option | Validation |
|--------|------------|
| `temperature` | Must be between 0 and 2 |
| `maxTokens` | Must be positive integer |
| `baseUrl` | Must be valid URL format |

Invalid configurations may result in API errors or unexpected behavior.
