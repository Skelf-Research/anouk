# CLI Reference

Command-line interface documentation for Anouk.

---

## Installation

Install the CLI globally:

```bash
npm install -g anouk
```

Or use with npx:

```bash
npx anouk <command>
```

---

## Commands

### init

Create a new extension project.

```bash
anouk init <project-name>
```

**Arguments:**

| Name | Required | Description |
|------|----------|-------------|
| `project-name` | Yes | Name of the new project |

**Example:**

```bash
anouk init my-extension
```

**Creates:**

```
my-extension/
├── src/
│   └── extension.js      # Main extension file
├── dist/                  # Build output directory
├── icons/                 # Extension icons
├── manifest.json          # Chrome extension manifest
├── package.json           # npm package configuration
└── README.md              # Project documentation
```

**Generated package.json:**

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "scripts": {
    "build": "esbuild src/extension.js --bundle --outfile=dist/bundle.js",
    "dev": "esbuild src/extension.js --bundle --outfile=dist/bundle.js --watch"
  },
  "dependencies": {
    "anouk": "^1.0.0"
  },
  "devDependencies": {
    "esbuild": "^0.19.0"
  }
}
```

---

### generate

Generate specific files from templates.

```bash
anouk generate <template> <name>
```

**Arguments:**

| Name | Required | Description |
|------|----------|-------------|
| `template` | Yes | Template type to generate |
| `name` | Yes | Name for the generated file |

**Available Templates:**

| Template | Description | Output |
|----------|-------------|--------|
| `extension` | Extension boilerplate | `src/<name>.js` |
| `service` | AI service class | `src/services/<name>.js` |
| `config` | Configuration file | `src/<name>Config.js` |

**Examples:**

```bash
# Generate an extension file
anouk generate extension email-assistant

# Generate a service file
anouk generate service summarizer

# Generate a config file
anouk generate config providers
```

---

### help

Display help information.

```bash
anouk help
```

**Output:**

```
Anouk CLI - AI Browser Extension Framework

Usage:
  anouk <command> [options]

Commands:
  init <name>                Create a new extension project
  generate <template> <name> Generate files from templates
  help                       Show this help message

Examples:
  anouk init my-extension
  anouk generate extension email-helper
  anouk generate service analyzer

For more information, visit: https://github.com/your-org/anouk
```

---

## Template Details

### Extension Template

Generated with `anouk generate extension <name>`:

```javascript
import { AIService, createSettingsPanel, toggleSettingsPanel } from 'anouk';

class MyExtension {
  constructor() {
    this.aiService = new AIService({
      provider: 'together',
      apiKey: '',
      model: 'meta-llama/Llama-3-70b-chat-hf'
    });

    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.createUI();
    this.attachEventListeners();
  }

  createUI() {
    // Create your UI components here
  }

  attachEventListeners() {
    // Attach event listeners here
  }
}

new MyExtension();
```

---

### Service Template

Generated with `anouk generate service <name>`:

```javascript
import { AIService } from 'anouk';

export class MyService {
  constructor(config) {
    this.aiService = new AIService(config);
  }

  async analyze(content, id) {
    return await this.aiService.call(
      'Analyze the following content',
      content,
      id,
      'analysis'
    );
  }

  async summarize(content, id) {
    return await this.aiService.call(
      'Summarize the following content',
      content,
      id,
      'summary'
    );
  }
}
```

---

### Config Template

Generated with `anouk generate config <name>`:

```javascript
export const config = {
  provider: 'together',
  apiKey: process.env.API_KEY || '',
  model: 'meta-llama/Llama-3-70b-chat-hf',
  baseUrl: 'https://api.together.xyz/v1',
  maxTokens: 2000,
  temperature: 0.7
};

export const providers = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4'
  },
  together: {
    baseUrl: 'https://api.together.xyz/v1',
    model: 'meta-llama/Llama-3-70b-chat-hf'
  },
  ollama: {
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama2'
  }
};
```

---

## Workflow Examples

### Starting a New Project

```bash
# Create project
anouk init my-email-helper
cd my-email-helper

# Install dependencies
npm install

# Generate additional files
anouk generate service email-analyzer
anouk generate config api

# Build
npm run build

# Watch for changes during development
npm run dev
```

### Adding Features to Existing Project

```bash
# Generate a new service
anouk generate service reply-generator

# Generate a new extension component
anouk generate extension sidebar-widget
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |

---

## Troubleshooting

### Command Not Found

If `anouk` command is not found after installation:

```bash
# Check if npm global bin is in PATH
npm config get prefix

# Add to PATH (adjust for your shell)
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Permission Errors

On Linux/macOS, you may need sudo for global installation:

```bash
sudo npm install -g anouk
```

Or configure npm to use a different directory:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Template Generation Fails

Ensure you're in a valid Anouk project directory:

```bash
# Check for package.json with anouk dependency
cat package.json | grep anouk
```
