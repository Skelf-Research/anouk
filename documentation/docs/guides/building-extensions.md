# Building Extensions

Learn how to build robust AI-powered browser extensions with Anouk.

---

## Architecture Overview

A typical Anouk extension consists of:

```
extension/
├── manifest.json       # Extension configuration
├── src/
│   ├── extension.js    # Main entry point
│   ├── services/       # AI and business logic
│   └── ui/             # UI components
├── dist/               # Built files
└── icons/              # Extension icons
```

---

## Extension Lifecycle

### 1. Initialization

```javascript
class MyExtension {
  constructor() {
    this.aiService = new AIService(config);
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
    this.observePageChanges();
  }
}
```

### 2. UI Creation

```javascript
createUI() {
  // Create container
  this.container = document.createElement('div');
  this.container.id = 'my-extension';

  // Add styles
  this.container.style.cssText = `
    position: fixed;
    z-index: 10000;
  `;

  // Append to page
  document.body.appendChild(this.container);
}
```

### 3. Event Handling

```javascript
attachEventListeners() {
  // User interactions
  this.button.addEventListener('click', () => this.handleClick());

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      this.togglePanel();
    }
  });
}
```

---

## Working with AIService

### Basic Calls

```javascript
// Simple call with caching
const response = await this.aiService.call(
  'Summarize this text',     // Instruction
  textContent,                // Content to process
  uniqueId,                   // ID for caching
  'summary'                   // Cache key suffix
);
```

### Structured Data Extraction

```javascript
const instruction = `
Extract the following information as YAML:
- name: sender name
- date: email date
- action_items: list of action items
`;

const structured = await this.aiService.call(
  instruction,
  emailContent,
  emailId,
  'structured'
);
```

### Custom System Prompts

```javascript
this.aiService.updateConfig({
  systemPrompt: `You are a helpful assistant that specializes in
analyzing emails. Always be concise and professional.`
});
```

---

## UI Components

### Floating Action Button

```javascript
createFloatingButton() {
  const button = document.createElement('button');
  button.innerHTML = '&#x2728;';
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
    transition: transform 0.2s, box-shadow 0.2s;
    z-index: 10000;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });

  return button;
}
```

### Sidebar Panel

```javascript
createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: -400px;
    width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 20px rgba(0,0,0,0.1);
    z-index: 10001;
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
  `;

  return sidebar;
}

toggleSidebar(sidebar) {
  const isOpen = sidebar.style.right === '0px';
  sidebar.style.right = isOpen ? '-400px' : '0px';
}
```

### Settings Panel Integration

```javascript
import { createSettingsPanel, toggleSettingsPanel } from 'anouk';

// Create and add to DOM
const settingsPanel = createSettingsPanel(this.aiService);
document.body.appendChild(settingsPanel);

// Toggle on button click
settingsButton.onclick = () => toggleSettingsPanel(settingsPanel);
```

---

## Page Observation

### MutationObserver

Watch for page changes:

```javascript
observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        this.handleDOMChange(mutation);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

handleDOMChange(mutation) {
  // Check for specific elements
  const newEmail = mutation.target.querySelector('.email-content');
  if (newEmail) {
    this.analyzeEmail(newEmail);
  }
}
```

### URL Change Detection

```javascript
observeURLChanges() {
  let lastUrl = location.href;

  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      this.handleURLChange(lastUrl);
    }
  }).observe(document, { subtree: true, childList: true });
}
```

---

## Caching Strategies

### Automatic Caching

```javascript
// Uses built-in caching
const response = await aiService.call(
  instruction,
  content,
  emailId,    // Unique identifier
  'analysis'  // Cache key type
);
```

### Manual Cache Control

```javascript
// Check cache first
const cached = aiService.getCachedResponse(id, 'summary');
if (cached) {
  return cached;
}

// Make request and cache
const response = await aiService.makeRequest(instruction, content);
aiService.setCachedResponse(id, 'summary', response);
```

### Cache Invalidation

```javascript
// Clear specific cache
delete localStorage[`anouk_${id}_summary`];

// Clear all caches
Object.keys(localStorage)
  .filter(key => key.startsWith('anouk_'))
  .forEach(key => localStorage.removeItem(key));
```

---

## Error Handling

### API Errors

```javascript
try {
  const response = await aiService.call(instruction, content, id, key);
  this.displayResult(response);
} catch (error) {
  if (error.message.includes('401')) {
    this.showError('Invalid API key. Please check your settings.');
  } else if (error.message.includes('429')) {
    this.showError('Rate limited. Please wait a moment.');
  } else {
    this.showError(`Error: ${error.message}`);
  }
}
```

### Graceful Degradation

```javascript
async analyzeWithFallback(content) {
  try {
    return await this.aiService.call('Analyze', content, id, 'analysis');
  } catch (error) {
    console.warn('AI analysis failed, using fallback');
    return this.basicAnalysis(content);
  }
}
```

---

## Performance Optimization

### Debouncing

```javascript
debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
this.analyzeDebounced = this.debounce(this.analyze.bind(this), 500);
```

### Lazy Loading

```javascript
async loadAIService() {
  if (!this.aiService) {
    const { AIService } = await import('anouk');
    this.aiService = new AIService(this.config);
  }
  return this.aiService;
}
```

---

## Testing

### Manual Testing

1. Load extension in Chrome
2. Open browser DevTools (F12)
3. Check Console for errors
4. Test all user interactions

### Automated Testing

```javascript
// test/extension.test.js
import { AIService } from 'anouk';

describe('AIService', () => {
  let service;

  beforeEach(() => {
    service = new AIService({
      provider: 'test',
      apiKey: 'test-key'
    });
  });

  test('should initialize with config', () => {
    expect(service.getConfig().provider).toBe('test');
  });
});
```

---

## Deployment

### Build for Production

```bash
npm run build
```

### Chrome Web Store

1. Create a ZIP of your extension files
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload your ZIP file
4. Fill in store listing details
5. Submit for review

### Distribution

For private distribution:
- Host the extension files
- Provide installation instructions
- Consider using enterprise policies for organization deployment
