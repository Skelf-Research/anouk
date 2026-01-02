# AI Providers Guide

Configure Anouk to work with your preferred AI provider.

---

## Supported Providers

Anouk works with any OpenAI-compatible API. Here are the officially supported providers:

| Provider | Local/Cloud | Free Tier | Notes |
|----------|-------------|-----------|-------|
| OpenAI | Cloud | No | Industry standard |
| Together.xyz | Cloud | Yes | Default provider |
| Anthropic | Cloud | No | Claude models |
| Ollama | Local | Yes | Privacy-focused |
| Hugging Face | Cloud | Yes | Open models |

---

## OpenAI

The industry-standard provider with GPT-4 and GPT-3.5 models.

### Setup

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Configure Anouk:

```javascript
const aiService = new AIService({
  provider: 'openai',
  apiKey: 'sk-your-api-key',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4'
});
```

### Available Models

| Model | Context | Best For |
|-------|---------|----------|
| `gpt-4` | 8K | Complex reasoning |
| `gpt-4-turbo` | 128K | Long documents |
| `gpt-3.5-turbo` | 16K | Fast, cost-effective |

### Pricing Note

OpenAI charges per token. GPT-4 is significantly more expensive than GPT-3.5-turbo.

---

## Together.xyz

Default provider with competitive pricing and open-source models.

### Setup

1. Create an account at [together.xyz](https://together.xyz)
2. Get your API key from the dashboard
3. Configure:

```javascript
const aiService = new AIService({
  provider: 'together',
  apiKey: 'your-together-key',
  baseUrl: 'https://api.together.xyz/v1',
  model: 'meta-llama/Llama-3-70b-chat-hf'
});
```

### Available Models

| Model | Parameters | Notes |
|-------|------------|-------|
| `meta-llama/Llama-3-70b-chat-hf` | 70B | Recommended |
| `mistralai/Mixtral-8x7B-Instruct-v0.1` | 8x7B | Fast |
| `togethercomputer/CodeLlama-34b-Instruct` | 34B | Code-focused |

---

## Anthropic Claude

Anthropic's Claude models are known for safety and helpfulness.

### Setup

1. Get API access at [anthropic.com](https://www.anthropic.com)
2. Configure using the OpenAI-compatible endpoint:

```javascript
const aiService = new AIService({
  provider: 'anthropic',
  apiKey: 'sk-ant-your-key',
  baseUrl: 'https://api.anthropic.com/v1',
  model: 'claude-3-opus-20240229'
});
```

### Available Models

| Model | Context | Best For |
|-------|---------|----------|
| `claude-3-opus-20240229` | 200K | Complex tasks |
| `claude-3-sonnet-20240229` | 200K | Balanced |
| `claude-3-haiku-20240307` | 200K | Fast, efficient |

!!! note "API Compatibility"
    Some Anthropic features may require additional headers. Check Anthropic's documentation for details.

---

## Ollama (Local)

Run AI models locally for privacy and offline use.

### Setup

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a model:

```bash
ollama pull llama2
```

3. Start the server:

```bash
ollama serve
```

4. Configure Anouk:

```javascript
const aiService = new AIService({
  provider: 'ollama',
  apiKey: '',  // Not required for local
  baseUrl: 'http://localhost:11434/v1',
  model: 'llama2'
});
```

### Available Models

```bash
# List available models
ollama list

# Popular models
ollama pull llama2
ollama pull mistral
ollama pull codellama
ollama pull phi
```

### Benefits

- **Privacy**: Data never leaves your machine
- **Free**: No API costs
- **Offline**: Works without internet
- **Fast**: No network latency

### Requirements

- 8GB+ RAM for 7B models
- 16GB+ RAM for 13B models
- GPU recommended for larger models

---

## Hugging Face

Access thousands of open-source models.

### Setup

1. Create account at [huggingface.co](https://huggingface.co)
2. Generate API token in settings
3. Configure:

```javascript
const aiService = new AIService({
  provider: 'huggingface',
  apiKey: 'hf_your_token',
  baseUrl: 'https://api-inference.huggingface.co/v1',
  model: 'meta-llama/Llama-2-70b-chat-hf'
});
```

### Pro Tier

Some models require a Pro subscription. Check model pages for access requirements.

---

## Custom Providers

Connect to any OpenAI-compatible API:

```javascript
const aiService = new AIService({
  provider: 'custom',
  apiKey: 'your-key',
  baseUrl: 'https://your-api.example.com/v1',
  model: 'your-model-name'
});
```

### LM Studio

```javascript
{
  provider: 'lmstudio',
  baseUrl: 'http://localhost:1234/v1',
  model: 'local-model'
}
```

### Azure OpenAI

```javascript
{
  provider: 'azure',
  baseUrl: 'https://your-resource.openai.azure.com',
  apiKey: 'your-azure-key',
  model: 'your-deployment-name'
}
```

---

## Switching Providers

### Runtime Switching

```javascript
// Switch to a different provider
aiService.updateConfig({
  provider: 'openai',
  apiKey: 'sk-new-key',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4'
});
```

### Using Presets

```javascript
import { ConfigManager } from 'anouk';

// Get preset for a provider
const openaiConfig = ConfigManager.getPresetConfigs()['openai'];

// Apply preset (remember to add your API key)
aiService.updateConfig({
  ...openaiConfig,
  apiKey: 'your-key'
});
```

---

## Provider Comparison

| Feature | OpenAI | Together | Ollama | Claude |
|---------|--------|----------|--------|--------|
| Speed | Fast | Fast | Varies | Fast |
| Cost | $$$$ | $$ | Free | $$$ |
| Privacy | Cloud | Cloud | Local | Cloud |
| Models | GPT | Open | Open | Claude |
| Context | 128K | 32K | 32K | 200K |

---

## Troubleshooting

### Connection Refused (Ollama)

```bash
# Ensure Ollama is running
ollama serve

# Check if model is downloaded
ollama list
```

### 401 Unauthorized

- Verify API key is correct
- Check key hasn't expired
- Ensure key has required permissions

### 429 Rate Limited

- Reduce request frequency
- Anouk includes built-in rate limiting (1s delay)
- Consider upgrading your API plan

### Model Not Found

- Verify model name is exact
- Check provider documentation for available models
- Some models require special access
