# Anouk

**The Complete AI-Powered Browser Extension Framework**

Anouk is a powerful, flexible framework for creating AI-powered browser extensions with universal OpenAI-compatible provider support. Whether you're building a Gmail assistant, a code reviewer, or any other AI-enhanced browser tool, Anouk provides everything you need to get started quickly and scale effectively.

---

## What is Anouk?

Anouk is both a **framework** and a **library** designed to democratize the development of AI-powered browser extensions. It abstracts away the complexity of:

- **AI Provider Integration**: Connect to any OpenAI-compatible API with a single configuration object
- **Response Caching**: Built-in intelligent caching reduces API costs and improves user experience
- **Request Management**: Automatic rate limiting and request queuing prevent API throttling
- **UI Components**: Pre-built, customizable sidebar, floating buttons, and settings panels
- **Configuration Management**: Persistent settings with runtime updates and provider presets

### The Problem Anouk Solves

Building AI-powered browser extensions traditionally requires:

1. Writing boilerplate code for API communication
2. Implementing caching strategies to reduce costs
3. Building UI components from scratch
4. Managing configuration and API keys securely
5. Handling rate limits and request queuing
6. Supporting multiple AI providers

**Anouk handles all of this out of the box**, letting you focus on your extension's unique functionality.

---

## Key Features

### Multi-Provider AI Support

Anouk works seamlessly with any OpenAI-compatible API provider:

| Provider | Type | Free Tier | Best For |
|----------|------|-----------|----------|
| **OpenAI** | Cloud | No | Production apps, GPT-4 capabilities |
| **Together.xyz** | Cloud | Yes | Cost-effective, open-source models |
| **Anthropic Claude** | Cloud | No | Long context, safety-focused |
| **Ollama** | Local | Yes | Privacy, offline use, no API costs |
| **Hugging Face** | Cloud | Limited | Access to thousands of models |
| **Custom** | Any | Varies | Self-hosted, enterprise deployments |

### Intelligent Caching System

```javascript
// Automatic caching - no extra code needed
const summary = await aiService.call(
  'Summarize this email',
  emailContent,
  emailId,        // Unique identifier
  'summary'       // Cache key type
);

// Second call with same parameters returns cached result instantly
const sameSummary = await aiService.call(
  'Summarize this email',
  emailContent,
  emailId,
  'summary'
);  // Returns from cache - no API call!
```

**Benefits:**
- Reduces API costs by 60-80% in typical usage
- Instant responses for repeated queries
- Automatic cache invalidation strategies
- localStorage-based persistence across sessions

### Request Queue with Rate Limiting

```javascript
// Make multiple requests - Anouk handles queuing automatically
const results = await Promise.all([
  aiService.call('Summarize', content1, id1, 'summary'),
  aiService.call('Summarize', content2, id2, 'summary'),
  aiService.call('Summarize', content3, id3, 'summary'),
]);

// Requests are automatically spaced with 1-second delays
// Prevents 429 (rate limit) errors
```

### Ready-to-Use UI Components

Anouk provides production-ready UI components:

#### Floating Action Button
A customizable button that floats over the page content, providing easy access to your extension's features.

#### Sidebar Panel
A slide-out panel with tabbed navigation, perfect for displaying AI-generated content, settings, and actions.

#### Settings Panel
A complete configuration interface allowing users to:
- Switch between AI providers
- Enter and update API keys
- Select models
- Adjust generation parameters

### CLI Scaffolding

```bash
# Create a complete project in seconds
npx anouk init my-extension

# Generated structure:
my-extension/
├── src/
│   └── extension.js      # Main extension with boilerplate
├── dist/                  # Build output
├── icons/                 # Extension icons (all sizes)
├── manifest.json          # Chrome extension manifest v3
├── package.json           # With build scripts configured
└── README.md              # Project documentation
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Extension                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Your UI    │  │  Your Logic │  │  Event Handlers     │ │
│  │  Components │  │             │  │                     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
├─────────┴────────────────┴─────────────────────┴────────────┤
│                       Anouk Framework                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  AIService  │  │   Config    │  │    UI Components    │ │
│  │             │  │   Manager   │  │                     │ │
│  │  - call()   │  │             │  │  - Settings Panel   │ │
│  │  - cache    │  │  - presets  │  │  - Sidebar          │ │
│  │  - queue    │  │  - persist  │  │  - Buttons          │ │
│  └──────┬──────┘  └─────────────┘  └─────────────────────┘ │
│         │                                                   │
├─────────┴───────────────────────────────────────────────────┤
│                      API Layer                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              OpenAI-Compatible API                   │   │
│  │  (OpenAI, Together, Anthropic, Ollama, HuggingFace) │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Example

Here's a complete, working example that creates an AI-powered page analyzer:

```javascript
import { AIService, createSettingsPanel, toggleSettingsPanel } from 'anouk';

// Initialize the AI service with your preferred provider
const aiService = new AIService({
  provider: 'together',
  apiKey: '',  // Users will enter via settings panel
  model: 'meta-llama/Llama-3-70b-chat-hf',
  maxTokens: 2000,
  temperature: 0.7
});

// Create settings panel for runtime configuration
const settingsPanel = createSettingsPanel(aiService);
document.body.appendChild(settingsPanel);

// Create a floating button
const button = document.createElement('button');
button.innerHTML = '🤖';
button.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10000;
`;
document.body.appendChild(button);

// Analyze page on click
button.addEventListener('click', async () => {
  try {
    // Extract page content
    const pageText = document.body.innerText.substring(0, 5000);

    // Generate analysis with caching
    const analysis = await aiService.call(
      `Analyze this webpage and provide:
       1. Main topic (1 sentence)
       2. Key points (3-5 bullets)
       3. Sentiment (positive/neutral/negative)`,
      pageText,
      window.location.href,
      'analysis'
    );

    // Display result
    alert(analysis);
  } catch (error) {
    if (error.message.includes('API key')) {
      toggleSettingsPanel(settingsPanel);
    } else {
      console.error('Analysis failed:', error);
    }
  }
});
```

---

## Use Cases

### Email & Communication
- **Gmail Assistant**: Summarize emails, extract action items, generate replies
- **Slack Summarizer**: Condense channel activity, highlight important messages
- **LinkedIn Helper**: Optimize profiles, suggest connection messages

### Development Tools
- **Code Reviewer**: Analyze PRs, suggest improvements, catch bugs
- **Documentation Generator**: Auto-generate docs from code
- **Stack Overflow Assistant**: Find relevant answers, suggest solutions

### Productivity
- **Meeting Notes**: Transcribe and summarize video calls
- **Article Summarizer**: Condense long articles into key points
- **Research Assistant**: Extract and organize information from multiple sources

### Content & Social
- **Twitter/X Assistant**: Generate engaging replies, analyze threads
- **Content Optimizer**: Improve writing, check tone, suggest edits
- **Translation Helper**: Real-time translation with context awareness

---

## Why Choose Anouk?

### For Developers

| Benefit | Description |
|---------|-------------|
| **Rapid Development** | Go from idea to working extension in minutes, not days |
| **Provider Flexibility** | Switch AI providers without changing your code |
| **Cost Optimization** | Built-in caching reduces API costs by 60-80% |
| **Production Ready** | Battle-tested components used in real extensions |
| **Type Safety** | Well-documented interfaces and consistent APIs |
| **Open Source** | MIT licensed, community-driven development |

### For End Users

| Benefit | Description |
|---------|-------------|
| **Privacy Control** | API keys stay on user's machine |
| **Provider Choice** | Use any AI provider, including local models |
| **Offline Capability** | Works with Ollama for fully offline operation |
| **Cost Transparency** | Users control their own API usage |

---

## Comparison with Alternatives

| Feature | Anouk | Raw API Calls | Other Frameworks |
|---------|-------|---------------|------------------|
| Setup Time | Minutes | Hours | Varies |
| Multi-Provider | ✅ Native | ❌ Manual | Partial |
| Caching | ✅ Built-in | ❌ DIY | Varies |
| Rate Limiting | ✅ Automatic | ❌ DIY | Varies |
| UI Components | ✅ Included | ❌ None | Limited |
| CLI Scaffolding | ✅ Yes | ❌ No | Some |
| Browser Extension Focus | ✅ Primary | ❌ No | ❌ No |

---

## Getting Started

Ready to build your first AI-powered extension?

<div class="grid cards" markdown>

-   **Quick Start Guide**

    Get up and running in 5 minutes with our quick start tutorial.

    [Quick Start →](getting-started/quickstart.md)

-   **Installation Options**

    Detailed installation instructions for all environments.

    [Installation →](getting-started/installation.md)

-   **Build Your First Extension**

    Step-by-step tutorial to create a complete extension.

    [Tutorial →](getting-started/first-extension.md)

-   **API Reference**

    Complete documentation of all Anouk APIs.

    [API Docs →](reference/api.md)

</div>

---

## Supported Providers

| Provider | Status | Models | Notes |
|----------|--------|--------|-------|
| OpenAI | ✅ Supported | GPT-4, GPT-4 Turbo, GPT-3.5 Turbo | Industry standard |
| Together.xyz | ✅ Supported | Llama 3, Mixtral, CodeLlama | Default provider, great value |
| Anthropic | ✅ Supported | Claude 3 Opus, Sonnet, Haiku | Via compatible endpoint |
| Ollama | ✅ Supported | Llama 2, Mistral, Phi, etc. | Local, private, free |
| Hugging Face | ✅ Supported | Thousands of models | Inference API |
| Azure OpenAI | ✅ Supported | GPT-4, GPT-3.5 | Enterprise deployments |
| LM Studio | ✅ Supported | Any GGUF model | Local alternative |

---

## Community & Support

### Resources

- **[GitHub Repository](https://github.com/your-org/anouk)** - Source code, issues, and discussions
- **[npm Package](https://www.npmjs.com/package/anouk)** - Install via npm
- **[Examples](examples/gmail-assistant.md)** - Real-world extension examples

### Contributing

We welcome contributions! See our [Contributing Guide](https://github.com/your-org/anouk/blob/main/CONTRIBUTING.md) for details.

### License

Anouk is released under the [MIT License](https://opensource.org/licenses/MIT), making it free for both personal and commercial use.

---

## What's Next?

1. **[Quick Start](getting-started/quickstart.md)** - Get running in 5 minutes
2. **[Your First Extension](getting-started/first-extension.md)** - Build something useful
3. **[Configuration](guides/configuration.md)** - Customize for your needs
4. **[Examples](examples/gmail-assistant.md)** - Learn from real implementations
