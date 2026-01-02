# Installation Guide

Comprehensive installation instructions for all environments and use cases.

---

## Overview

Anouk can be installed in several ways depending on your needs:

| Method | Best For | Command |
|--------|----------|---------|
| **npm Package** | Using as a library in your project | `npm install anouk` |
| **Global CLI** | Creating new projects | `npm install -g anouk` |
| **From Source** | Contributing or modifying Anouk | `git clone ...` |
| **npx** | One-off project creation | `npx anouk init` |

---

## System Requirements

### Minimum Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Node.js** | 16.0.0 | 18.0.0+ (LTS) |
| **npm** | 7.0.0 | 9.0.0+ |
| **RAM** | 2 GB | 4 GB+ |
| **Disk Space** | 100 MB | 500 MB |

### Checking Your Environment

```bash
# Check Node.js version
node --version
# Expected: v16.0.0 or higher

# Check npm version
npm --version
# Expected: 7.0.0 or higher

# Check available disk space (Linux/macOS)
df -h .
```

### Installing Node.js

If you don't have Node.js installed:

#### macOS

```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

#### Windows

```powershell
# Using winget
winget install OpenJS.NodeJS

# Or using Chocolatey
choco install nodejs

# Or download from nodejs.org
```

#### Linux (Ubuntu/Debian)

```bash
# Using NodeSource (recommended for latest LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using apt (may be older version)
sudo apt update
sudo apt install nodejs npm
```

#### Linux (Fedora/RHEL)

```bash
# Using dnf
sudo dnf install nodejs npm

# Or using NodeSource
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs
```

---

## Installation Methods

### Method 1: npm Package (Recommended for Projects)

Install Anouk as a dependency in your extension project:

```bash
# Create project directory
mkdir my-extension
cd my-extension

# Initialize npm project
npm init -y

# Install Anouk
npm install anouk
```

#### What Gets Installed

```
node_modules/
└── anouk/
    ├── src/
    │   ├── aiService.js       # AI service class
    │   ├── configManager.js   # Configuration management
    │   ├── settingsPanel.js   # Settings UI component
    │   ├── api.js             # API interaction layer
    │   ├── aiConfig.js        # Default configurations
    │   └── index.js           # Main exports
    ├── bin/
    │   └── anouk-cli.js       # CLI tool
    ├── templates/             # Code generation templates
    └── package.json
```

#### Using in Your Code

```javascript
// ES Modules (recommended)
import { AIService, ConfigManager, createSettingsPanel } from 'anouk';

// CommonJS
const { AIService, ConfigManager, createSettingsPanel } = require('anouk');
```

---

### Method 2: Global CLI Installation

Install the CLI globally for creating new projects:

```bash
npm install -g anouk
```

#### Verify Installation

```bash
anouk --version
# Output: anouk v1.0.0

anouk help
# Shows available commands
```

#### Troubleshooting Global Install

**Permission Errors on Linux/macOS:**

```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g anouk

# Option 2: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g anouk
```

**Command Not Found:**

```bash
# Check npm global bin location
npm config get prefix

# Ensure it's in your PATH
echo $PATH | grep -o '[^:]*npm[^:]*'

# Add to PATH if missing
export PATH="$(npm config get prefix)/bin:$PATH"
```

---

### Method 3: From Source

Clone and build Anouk from source:

```bash
# Clone the repository
git clone https://github.com/your-org/anouk.git
cd anouk

# Install dependencies
npm run deps
# Or: npm install

# Build the project
npm run build

# Link for local development (optional)
npm link
```

#### Development Commands

```bash
# Install dependencies
npm run deps

# Create dist directory
npm run stage

# Bundle with esbuild
npm run bundle

# Full build (stage + bundle)
npm run build

# Watch mode for development
npm run dev
```

#### Project Structure (Source)

```
anouk/
├── src/
│   ├── aiService.js          # Core AI service
│   ├── configManager.js      # Configuration singleton
│   ├── settingsPanel.js      # Settings UI
│   ├── api.js                # API layer with queue
│   ├── aiConfig.js           # Provider presets
│   ├── gmailJsLoader.js      # Gmail.js integration
│   ├── extension.js          # Reference implementation
│   ├── extensionInjector.js  # Content script injector
│   ├── index.js              # Library exports
│   └── example-extension.js  # Example code
├── bin/
│   └── anouk-cli.js          # CLI implementation
├── templates/
│   ├── extension-template.js # New extension template
│   ├── service-template.js   # Service class template
│   └── config-template.js    # Config file template
├── dist/                     # Build output
├── icons/                    # Extension icons
├── manifest.json             # Chrome manifest
├── package.json              # Package configuration
└── README.md                 # Documentation
```

---

### Method 4: Using npx (No Installation)

Run Anouk commands without installing:

```bash
# Create a new project
npx anouk init my-extension

# Generate files
npx anouk generate extension my-component
```

!!! note "npx Behavior"
    npx downloads the package temporarily if not installed globally. This is slower but doesn't require global installation.

---

## Setting Up a New Project

### Quick Setup with CLI

```bash
# Create project
anouk init my-extension
cd my-extension

# Install dependencies
npm install

# Start development
npm run dev
```

### Manual Setup

#### Step 1: Create Project Structure

```bash
mkdir my-extension
cd my-extension

# Create directories
mkdir -p src dist icons

# Initialize npm
npm init -y
```

#### Step 2: Install Dependencies

```bash
npm install anouk
npm install --save-dev esbuild
```

#### Step 3: Create manifest.json

```json
{
  "manifest_version": 3,
  "name": "My AI Extension",
  "version": "1.0.0",
  "description": "An AI-powered browser extension built with Anouk",
  "permissions": [
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["dist/bundle.js"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png"
    },
    "default_title": "My AI Extension"
  }
}
```

#### Step 4: Create package.json Scripts

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "esbuild src/extension.js --bundle --outfile=dist/bundle.js --format=iife",
    "dev": "esbuild src/extension.js --bundle --outfile=dist/bundle.js --format=iife --watch",
    "clean": "rm -rf dist/*"
  },
  "dependencies": {
    "anouk": "^1.0.0"
  },
  "devDependencies": {
    "esbuild": "^0.19.0"
  }
}
```

#### Step 5: Create Extension Code

Create `src/extension.js`:

```javascript
import { AIService, createSettingsPanel, toggleSettingsPanel } from 'anouk';

class MyExtension {
  constructor() {
    // Initialize AI service
    this.aiService = new AIService({
      provider: 'together',
      apiKey: '',
      model: 'meta-llama/Llama-3-70b-chat-hf',
      maxTokens: 2000,
      temperature: 0.7
    });

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('MyExtension initialized');
    this.createUI();
    this.attachEventListeners();
  }

  createUI() {
    // Create floating button
    this.button = document.createElement('button');
    this.button.id = 'my-extension-btn';
    this.button.innerHTML = '🤖';
    this.button.style.cssText = `
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
      transition: transform 0.2s, box-shadow 0.2s;
    `;
    document.body.appendChild(this.button);

    // Create settings panel
    this.settingsPanel = createSettingsPanel(this.aiService);
    document.body.appendChild(this.settingsPanel);
  }

  attachEventListeners() {
    // Main button click
    this.button.addEventListener('click', () => this.handleClick());

    // Hover effects
    this.button.addEventListener('mouseenter', () => {
      this.button.style.transform = 'scale(1.1)';
      this.button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
    });

    this.button.addEventListener('mouseleave', () => {
      this.button.style.transform = 'scale(1)';
      this.button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    // Right-click for settings
    this.button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      toggleSettingsPanel(this.settingsPanel);
    });
  }

  async handleClick() {
    try {
      const pageContent = document.body.innerText.substring(0, 5000);

      const result = await this.aiService.call(
        'Briefly summarize the main points of this webpage in 3 bullet points.',
        pageContent,
        window.location.href,
        'summary'
      );

      alert(result);
    } catch (error) {
      console.error('Extension error:', error);
      if (error.message.includes('API') || error.message.includes('key')) {
        toggleSettingsPanel(this.settingsPanel);
      }
    }
  }
}

// Initialize extension
new MyExtension();
```

#### Step 6: Add Icons

Create placeholder icons or download from a source:

```bash
# Create placeholder icons (replace with real icons)
for size in 16 32 48 128; do
  convert -size ${size}x${size} xc:blue icons/icon${size}.png 2>/dev/null || \
  echo "Create icons/icon${size}.png manually"
done
```

#### Step 7: Build and Test

```bash
# Build the extension
npm run build

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select your project folder
```

---

## Build Configuration

### esbuild (Recommended)

**package.json:**

```json
{
  "scripts": {
    "build": "esbuild src/extension.js --bundle --outfile=dist/bundle.js --format=iife",
    "build:minify": "esbuild src/extension.js --bundle --outfile=dist/bundle.js --format=iife --minify",
    "dev": "esbuild src/extension.js --bundle --outfile=dist/bundle.js --format=iife --watch --sourcemap"
  }
}
```

**esbuild.config.js (Advanced):**

```javascript
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/extension.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'iife',
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  target: ['chrome88'],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
```

### webpack (Alternative)

**webpack.config.js:**

```javascript
const path = require('path');

module.exports = {
  entry: './src/extension.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: process.env.NODE_ENV || 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

**package.json:**

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "webpack-cli": "^5.0.0",
    "babel-loader": "^9.0.0",
    "@babel/core": "^7.0.0",
    "@babel/preset-env": "^7.0.0"
  }
}
```

### Rollup (Alternative)

**rollup.config.js:**

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/extension.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    process.env.NODE_ENV === 'production' && terser()
  ]
};
```

---

## Browser-Specific Setup

### Google Chrome

```bash
# Navigate to extensions
chrome://extensions/

# Enable Developer mode (top right toggle)
# Click "Load unpacked"
# Select your project folder
```

### Microsoft Edge

```bash
# Navigate to extensions
edge://extensions/

# Enable Developer mode (left sidebar)
# Click "Load unpacked"
# Select your project folder
```

### Firefox

Firefox uses Manifest V2 by default. Create a modified manifest:

**manifest.firefox.json:**

```json
{
  "manifest_version": 2,
  "name": "My AI Extension",
  "version": "1.0.0",
  "description": "An AI-powered browser extension",
  "permissions": [
    "storage",
    "activeTab",
    "<all_urls>"
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["dist/bundle.js"]
    }
  ],
  "browser_action": {
    "default_icon": "icons/icon32.png",
    "default_title": "My AI Extension"
  }
}
```

**Loading in Firefox:**

```bash
# Navigate to debugging page
about:debugging#/runtime/this-firefox

# Click "Load Temporary Add-on"
# Select manifest.json
```

---

## Verification

### Check Installation

```bash
# Verify Anouk is installed
npm list anouk

# Check global CLI
anouk --version

# Verify build
ls -la dist/
```

### Test Import

Create a test file:

```javascript
// test-import.js
import { AIService, ConfigManager } from 'anouk';

console.log('AIService:', typeof AIService);
console.log('ConfigManager:', typeof ConfigManager);
console.log('Installation verified!');
```

```bash
node --experimental-modules test-import.js
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `Module not found: anouk` | Not installed | Run `npm install anouk` |
| `anouk: command not found` | CLI not in PATH | Check npm global path |
| Build fails | Missing dependencies | Run `npm install` |
| Extension not loading | Invalid manifest | Check manifest.json syntax |
| No UI visible | Content script not running | Check matches pattern |

### Getting Help

1. **Check Console**: Open DevTools (F12) → Console tab
2. **Check Extension Errors**: `chrome://extensions/` → Click "Errors"
3. **Debug Output**: Add `console.log` statements
4. **GitHub Issues**: [Report bugs](https://github.com/your-org/anouk/issues)

---

## Next Steps

- [Quick Start Guide](quickstart.md) - Get running in 5 minutes
- [Your First Extension](first-extension.md) - Build a complete extension
- [Configuration Guide](../guides/configuration.md) - Configure providers and options
