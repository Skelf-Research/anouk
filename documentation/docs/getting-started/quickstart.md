# Quick Start Guide

Get your first AI-powered browser extension running in under 5 minutes.

---

## Overview

This guide will walk you through:

1. Installing Anouk
2. Creating a new extension project
3. Configuring an AI provider
4. Building and loading the extension
5. Testing the AI integration

By the end, you'll have a working extension that can analyze any webpage using AI.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Minimum Version | Check Command | Download |
|----------|-----------------|---------------|----------|
| Node.js | 16.0+ | `node --version` | [nodejs.org](https://nodejs.org) |
| npm | 7.0+ | `npm --version` | Included with Node.js |

### Browser Requirements

| Browser | Minimum Version | Extension Support |
|---------|-----------------|-------------------|
| Google Chrome | 88+ | Full support |
| Microsoft Edge | 88+ | Full support |
| Brave | 1.20+ | Full support |
| Opera | 74+ | Full support |
| Firefox | 109+ | Partial (MV2) |

### API Key (Choose One)

You'll need an API key from at least one provider:

| Provider | Sign Up | Free Tier |
|----------|---------|-----------|
| Together.xyz | [together.xyz](https://together.xyz) | $5 free credit |
| OpenAI | [platform.openai.com](https://platform.openai.com) | Pay-as-you-go |
| Ollama | [ollama.ai](https://ollama.ai) | Free (local) |

!!! tip "Recommended for Beginners"
    **Together.xyz** offers $5 free credit and doesn't require a credit card, making it ideal for getting started.

---

## Step 1: Install Anouk

Open your terminal and install Anouk globally:

```bash
npm install -g anouk
```

Verify the installation:

```bash
anouk --version
```

You should see output like:

```
anouk v1.0.0
```

### Alternative: Use npx (No Global Install)

If you prefer not to install globally:

```bash
npx anouk init my-extension
```

---

## Step 2: Create Your Project

Generate a new extension project:

```bash
anouk init my-first-extension
```

You'll see output showing the created files:

```
Creating new Anouk extension: my-first-extension

✓ Created directory: my-first-extension/
✓ Created: src/extension.js
✓ Created: manifest.json
✓ Created: package.json
✓ Created: icons/ (16x16, 32x32, 48x48, 128x128)
✓ Created: README.md

Next steps:
  cd my-first-extension
  npm install
  npm run build
```

Navigate to your project:

```bash
cd my-first-extension
```

### Project Structure Explained

```
my-first-extension/
├── src/
│   └── extension.js      # Your main extension code
├── dist/                  # Built files (created on build)
├── icons/
│   ├── icon16.png        # Favicon
│   ├── icon32.png        # Small toolbar icon
│   ├── icon48.png        # Extension management page
│   └── icon128.png       # Chrome Web Store
├── manifest.json          # Chrome extension configuration
├── package.json           # npm dependencies and scripts
└── README.md              # Project documentation
```

---

## Step 3: Install Dependencies

Install the required npm packages:

```bash
npm install
```

This installs:
- **anouk**: The core framework
- **esbuild**: Fast JavaScript bundler

---

## Step 4: Configure Your AI Provider

Open `src/extension.js` in your editor. You'll see the default configuration:

```javascript
import { AIService } from 'anouk';

const aiService = new AIService({
  provider: 'together',
  apiKey: '',  // Add your API key here
  model: 'meta-llama/Llama-3-70b-chat-hf'
});
```

### Option A: Hardcode API Key (Development Only)

For quick testing, add your API key directly:

```javascript
const aiService = new AIService({
  provider: 'together',
  apiKey: 'your-api-key-here',  // ⚠️ Don't commit this!
  model: 'meta-llama/Llama-3-70b-chat-hf'
});
```

!!! danger "Security Warning"
    Never commit API keys to version control. This method is for local development only.

### Option B: Use Settings Panel (Recommended)

The generated code includes a settings panel. Users can enter their API key at runtime:

```javascript
import { AIService, createSettingsPanel, toggleSettingsPanel } from 'anouk';

const aiService = new AIService({
  provider: 'together',
  apiKey: '',  // Empty - users will enter via settings
  model: 'meta-llama/Llama-3-70b-chat-hf'
});

// Create settings panel
const settingsPanel = createSettingsPanel(aiService);
document.body.appendChild(settingsPanel);

// Add settings button to your UI
settingsButton.onclick = () => toggleSettingsPanel(settingsPanel);
```

### Provider-Specific Configuration

#### Together.xyz (Default)

```javascript
{
  provider: 'together',
  apiKey: 'your-together-api-key',
  model: 'meta-llama/Llama-3-70b-chat-hf',
  baseUrl: 'https://api.together.xyz/v1'
}
```

#### OpenAI

```javascript
{
  provider: 'openai',
  apiKey: 'sk-your-openai-api-key',
  model: 'gpt-4',
  baseUrl: 'https://api.openai.com/v1'
}
```

#### Ollama (Local)

```javascript
{
  provider: 'ollama',
  apiKey: '',  // Not needed for local
  model: 'llama2',
  baseUrl: 'http://localhost:11434/v1'
}
```

First, ensure Ollama is running:

```bash
ollama serve
ollama pull llama2
```

---

## Step 5: Build the Extension

Compile your extension:

```bash
npm run build
```

Expected output:

```
> esbuild src/extension.js --bundle --outfile=dist/bundle.js

  dist/bundle.js  125.4kb

Done in 43ms
```

For development with auto-rebuild on changes:

```bash
npm run dev
```

This watches for file changes and rebuilds automatically.

---

## Step 6: Load in Chrome

### 6.1 Open Extensions Page

1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Or click: Menu (⋮) → More Tools → Extensions

### 6.2 Enable Developer Mode

Toggle **Developer mode** in the top-right corner:

![Developer mode toggle](https://via.placeholder.com/400x100?text=Enable+Developer+Mode)

### 6.3 Load Your Extension

1. Click **Load unpacked**
2. Navigate to your project folder
3. Select the entire project folder (not just `dist/`)

### 6.4 Verify Installation

You should see your extension in the list:

- **Name**: "My First Extension" (from manifest.json)
- **ID**: A unique identifier (e.g., `abcdefghijklmnop`)
- **Status**: Enabled

---

## Step 7: Test Your Extension

### 7.1 Navigate to a Test Page

Open any webpage, such as:
- A news article
- A Wikipedia page
- A blog post

### 7.2 Find the Extension UI

Look for the floating action button in the bottom-right corner of the page.

### 7.3 Configure API Key (If Not Hardcoded)

1. Click the settings button (gear icon)
2. Select your provider from the dropdown
3. Enter your API key
4. Click **Save**

### 7.4 Test AI Features

1. Click the main action button
2. The extension will analyze the page content
3. View the AI-generated response

---

## Troubleshooting

### Extension Not Appearing

**Symptom**: No extension icon or UI on pages

**Solutions**:

1. **Check manifest.json**:
   ```json
   "content_scripts": [{
     "matches": ["<all_urls>"],
     "js": ["dist/bundle.js"]
   }]
   ```

2. **Verify build output**:
   ```bash
   ls dist/
   # Should show: bundle.js
   ```

3. **Reload extension**:
   - Go to `chrome://extensions/`
   - Click the refresh icon on your extension

4. **Check for errors**:
   - Click "Errors" button on extension card
   - Or check Console in DevTools (F12)

### Build Errors

**Symptom**: `npm run build` fails

**Solutions**:

1. **Clear and reinstall**:
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

2. **Check Node version**:
   ```bash
   node --version  # Should be 16+
   ```

3. **Check for syntax errors**:
   ```bash
   npx esbuild src/extension.js --bundle --outfile=dist/bundle.js 2>&1
   ```

### API Errors

**Symptom**: AI calls fail with errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid API key | Check key is correct and active |
| 403 Forbidden | Key lacks permissions | Verify key permissions on provider dashboard |
| 429 Too Many Requests | Rate limited | Wait 60 seconds, Anouk handles this automatically |
| Network Error | Connection issue | Check internet, verify baseUrl |

### Console Debugging

Open DevTools (F12) and check the Console tab:

```javascript
// Add debug logging to your extension
console.log('AIService config:', aiService.getConfig());
console.log('API Key set:', !!aiService.getConfig().apiKey);
```

---

## Next Steps

Congratulations! You have a working AI-powered browser extension.

### Continue Learning

1. **[Build a Complete Extension](first-extension.md)**
   Create a full-featured Page Summarizer with sidebar UI

2. **[Configuration Deep Dive](../guides/configuration.md)**
   Learn all configuration options and best practices

3. **[AI Providers Guide](../guides/providers.md)**
   Compare providers and optimize for your use case

4. **[API Reference](../reference/api.md)**
   Explore all available methods and options

### Example Projects

- **[Gmail Assistant](../examples/gmail-assistant.md)** - Email analysis and reply generation
- **[Custom Extensions](../examples/custom-extensions.md)** - Twitter, GitHub, and more

---

## Quick Reference

### Common Commands

```bash
# Create new project
anouk init <name>

# Install dependencies
npm install

# Build for production
npm run build

# Development with watch
npm run dev

# Generate additional files
anouk generate extension <name>
anouk generate service <name>
```

### Essential Files

| File | Purpose |
|------|---------|
| `src/extension.js` | Main extension code |
| `manifest.json` | Chrome extension config |
| `package.json` | npm scripts and dependencies |
| `dist/bundle.js` | Built output (don't edit) |

### Useful URLs

| URL | Purpose |
|-----|---------|
| `chrome://extensions/` | Manage extensions |
| `chrome://extensions/?id=YOUR_ID` | Your extension details |
| DevTools Console (F12) | Debug and view logs |
