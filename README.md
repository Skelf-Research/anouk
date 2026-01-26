# Anouk

[![npm version](https://img.shields.io/npm/v/anouk.svg)](https://www.npmjs.com/package/anouk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/skelf-research/anouk/pulls)
[![Documentation](https://img.shields.io/badge/docs-skelfresearch.com-blue)](https://docs.skelfresearch.com/anouk)

**Build AI-powered browser extensions in minutes, not days.**

Anouk is a lightweight framework for creating browser extensions with AI capabilities. Plug in any OpenAI-compatible provider (OpenAI, Anthropic, Together.xyz, Ollama, etc.) and start building.

[Documentation](https://docs.skelfresearch.com/anouk) | [GitHub](https://github.com/skelf-research/anouk)

## Quick Start

```bash
# Install globally
npm install -g anouk

# Create a new extension
anouk init my-ai-extension
cd my-ai-extension

# Build and load in Chrome
npm run build
```

Then load the extension in Chrome: `chrome://extensions` → Enable Developer Mode → Load Unpacked → Select your project folder.

## Use as a Library

```bash
npm install anouk
```

```javascript
import { AIService } from 'anouk';

const ai = new AIService({
  providerUrl: 'https://api.openai.com/v1/chat/completions',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4'
});

const response = await ai.call('Summarize:', content, 'request-id');
```

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Provider** | OpenAI, Anthropic, Together.xyz, Ollama, Hugging Face |
| **Built-in Caching** | Reduce API costs with intelligent response caching |
| **Rate Limiting** | Queue management to stay within provider limits |
| **UI Components** | Pre-built sidebar, floating buttons, settings panels |
| **CLI Scaffolding** | Generate extensions, services, and configs instantly |

## CLI Commands

```bash
anouk init <project-name>              # Create new extension project
anouk generate extension <name>        # Generate extension template
anouk generate service <name>          # Generate AI service template
anouk generate config <name>           # Generate config template
```

## Configuration

### Via Settings Panel (Runtime)
Click the settings button in your extension UI to configure provider, API key, model, and system prompt.

### Via Code

```javascript
// src/aiConfig.js
export default {
  providerUrl: 'https://api.together.xyz/v1/chat/completions',
  apiKey: 'your-api-key',
  model: 'meta-llama/Llama-3-70b-chat-hf',
  systemPrompt: 'You are a helpful assistant.'
};
```

### Supported Providers

| Provider | URL |
|----------|-----|
| OpenAI | `https://api.openai.com/v1/chat/completions` |
| Anthropic | `https://api.anthropic.com/v1/messages` |
| Together.xyz | `https://api.together.xyz/v1/chat/completions` |
| Ollama | `http://localhost:11434/v1/chat/completions` |
| Hugging Face | `https://api-inference.huggingface.co/models/<model>` |

## Project Structure

```
my-extension/
├── src/
│   ├── aiService.js      # AI provider abstraction
│   ├── configManager.js  # Settings management
│   ├── settingsPanel.js  # UI settings component
│   └── extension.js      # Your extension logic
├── dist/                 # Built files
├── manifest.json         # Chrome extension manifest
└── package.json
```

## Development

```bash
# Watch mode - auto-rebuilds on changes
npm run dev
```

## Contributing

Contributions welcome! Please open an issue or submit a PR.

## License

[MIT](LICENSE) - [Skelf Research](https://github.com/skelf-research)
