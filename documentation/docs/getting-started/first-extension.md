# Build Your First Extension

A comprehensive step-by-step tutorial to create a complete AI-powered Page Summarizer extension with professional UI, error handling, and all the features you'd expect in a production extension.

---

## What We'll Build

In this tutorial, you'll create a **Smart Page Summarizer** extension that includes:

| Feature | Description |
|---------|-------------|
| **Floating Button** | A sleek action button that appears on every page |
| **Slide-out Sidebar** | A professional sidebar panel for displaying results |
| **AI Summarization** | One-click page content summarization |
| **Key Points Extraction** | Automatically extracts the main takeaways |
| **Reading Time Estimate** | Shows estimated reading time for the page |
| **Settings Panel** | Runtime configuration for AI providers |
| **Copy to Clipboard** | Easy sharing of generated summaries |
| **Loading States** | Professional loading indicators |
| **Error Handling** | Graceful error messages and recovery |
| **Keyboard Shortcuts** | Power user shortcuts for quick access |

**Estimated completion time**: 30-45 minutes

---

## Prerequisites

Before starting, ensure you have:

- [x] Completed the [Quick Start Guide](quickstart.md)
- [x] Node.js 16+ installed
- [x] A code editor (VS Code recommended)
- [x] An API key from any supported provider

---

## Step 1: Create the Project

### 1.1 Initialize with CLI

```bash
anouk init page-summarizer
cd page-summarizer
npm install
```

### 1.2 Verify Project Structure

```
page-summarizer/
├── src/
│   └── extension.js      # We'll replace this entirely
├── dist/
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── manifest.json
├── package.json
└── README.md
```

---

## Step 2: Configure the Manifest

Update `manifest.json` with proper metadata and permissions:

```json
{
  "manifest_version": 3,
  "name": "Smart Page Summarizer",
  "version": "1.0.0",
  "description": "AI-powered page summarization with key points extraction and reading time estimates",
  "author": "Your Name",
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
    "default_title": "Smart Page Summarizer"
  }
}
```

### Understanding Manifest Options

| Field | Purpose |
|-------|---------|
| `manifest_version: 3` | Uses latest Chrome extension API |
| `permissions: ["storage"]` | Allows saving settings to browser storage |
| `permissions: ["activeTab"]` | Allows interaction with current tab |
| `host_permissions: ["<all_urls>"]` | Allows running on all websites |
| `run_at: "document_idle"` | Loads after page is fully rendered |

---

## Step 3: Create the Extension Core

Replace `src/extension.js` with the following complete implementation:

### 3.1 Imports and Configuration

```javascript
import { AIService, createSettingsPanel, toggleSettingsPanel } from 'anouk';

/**
 * Smart Page Summarizer Extension
 *
 * A complete AI-powered browser extension that summarizes web pages,
 * extracts key points, and estimates reading time.
 */
class PageSummarizer {
  constructor() {
    // Initialize AI service with default provider
    this.aiService = new AIService({
      provider: 'together',
      apiKey: '',
      model: 'meta-llama/Llama-3-70b-chat-hf',
      maxTokens: 2000,
      temperature: 0.7,
      systemPrompt: `You are a helpful assistant that summarizes web content.
        Always be concise, accurate, and focus on the most important information.
        Format your responses clearly with proper structure.`
    });

    // State management
    this.state = {
      isOpen: false,
      isLoading: false,
      currentUrl: null,
      summary: null,
      error: null
    };

    // DOM element references
    this.elements = {};

    // Initialize the extension
    this.init();
  }
```

### 3.2 Initialization

```javascript
  /**
   * Initialize the extension
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Set up the extension after DOM is ready
   */
  setup() {
    // Don't run on browser internal pages
    if (this.shouldSkipPage()) {
      console.log('PageSummarizer: Skipping internal page');
      return;
    }

    console.log('PageSummarizer: Initializing...');

    this.injectStyles();
    this.createUI();
    this.attachEventListeners();
    this.setupKeyboardShortcuts();

    console.log('PageSummarizer: Ready');
  }

  /**
   * Check if we should skip this page
   */
  shouldSkipPage() {
    const skipPatterns = [
      /^chrome:\/\//,
      /^chrome-extension:\/\//,
      /^about:/,
      /^edge:\/\//,
      /^brave:\/\//
    ];

    return skipPatterns.some(pattern => pattern.test(window.location.href));
  }
```

### 3.3 Inject Styles

```javascript
  /**
   * Inject CSS styles into the page
   */
  injectStyles() {
    const styles = document.createElement('style');
    styles.id = 'page-summarizer-styles';
    styles.textContent = `
      /* Floating Action Button */
      #ps-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        z-index: 2147483646;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #ps-fab:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }

      #ps-fab:active {
        transform: scale(0.95);
      }

      #ps-fab.loading {
        pointer-events: none;
        opacity: 0.8;
      }

      /* Settings Button */
      #ps-settings-btn {
        position: fixed;
        bottom: 90px;
        right: 32px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f0f0f0;
        color: #666;
        border: none;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 2147483645;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #ps-settings-btn:hover {
        background: #e0e0e0;
        transform: scale(1.1);
      }

      /* Sidebar */
      #ps-sidebar {
        position: fixed;
        top: 0;
        right: -420px;
        width: 400px;
        height: 100vh;
        background: #ffffff;
        box-shadow: -4px 0 30px rgba(0,0,0,0.15);
        z-index: 2147483647;
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      #ps-sidebar.open {
        right: 0;
      }

      /* Sidebar Header */
      .ps-header {
        padding: 20px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }

      .ps-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ps-close-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      .ps-close-btn:hover {
        background: rgba(255,255,255,0.3);
      }

      /* Sidebar Content */
      .ps-content {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
      }

      /* Page Info Card */
      .ps-page-info {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
      }

      .ps-page-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .ps-page-meta {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: #666;
      }

      .ps-meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* Summary Section */
      .ps-section {
        margin-bottom: 24px;
      }

      .ps-section-title {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #888;
        margin: 0 0 12px 0;
        font-weight: 600;
      }

      .ps-summary-text {
        font-size: 15px;
        line-height: 1.7;
        color: #333;
        white-space: pre-wrap;
      }

      /* Key Points */
      .ps-key-points {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .ps-key-points li {
        padding: 12px 16px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 1.5;
        color: #444;
        display: flex;
        gap: 12px;
      }

      .ps-key-points li::before {
        content: '→';
        color: #667eea;
        font-weight: bold;
        flex-shrink: 0;
      }

      /* Actions */
      .ps-actions {
        display: flex;
        gap: 12px;
        padding: 16px 24px;
        background: #f8f9fa;
        border-top: 1px solid #eee;
        flex-shrink: 0;
      }

      .ps-btn {
        flex: 1;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .ps-btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
      }

      .ps-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .ps-btn-secondary {
        background: white;
        color: #667eea;
        border: 1px solid #667eea;
      }

      .ps-btn-secondary:hover {
        background: #667eea;
        color: white;
      }

      .ps-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
      }

      /* Loading State */
      .ps-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;
      }

      .ps-spinner {
        width: 48px;
        height: 48px;
        border: 3px solid #f0f0f0;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: ps-spin 1s linear infinite;
        margin-bottom: 16px;
      }

      @keyframes ps-spin {
        to { transform: rotate(360deg); }
      }

      .ps-loading-text {
        color: #666;
        font-size: 14px;
      }

      /* Error State */
      .ps-error {
        background: #fff5f5;
        border: 1px solid #fed7d7;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }

      .ps-error-icon {
        font-size: 32px;
        margin-bottom: 12px;
      }

      .ps-error-message {
        color: #c53030;
        font-size: 14px;
        margin: 0 0 16px 0;
      }

      .ps-error-action {
        color: #667eea;
        font-size: 13px;
        cursor: pointer;
        text-decoration: underline;
      }

      /* Empty State */
      .ps-empty {
        text-align: center;
        padding: 60px 20px;
        color: #888;
      }

      .ps-empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .ps-empty-text {
        font-size: 14px;
        margin: 0 0 8px 0;
      }

      .ps-empty-hint {
        font-size: 12px;
        color: #aaa;
      }

      /* Toast Notification */
      .ps-toast {
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 2147483648;
        opacity: 0;
        transition: all 0.3s ease;
      }

      .ps-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }

      /* Keyboard shortcut hint */
      .ps-shortcut {
        position: fixed;
        bottom: 140px;
        right: 24px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 11px;
        z-index: 2147483644;
        opacity: 0;
        transition: opacity 0.2s;
      }

      #ps-fab:hover + .ps-shortcut,
      .ps-shortcut:hover {
        opacity: 1;
      }
    `;
    document.head.appendChild(styles);
  }
```

### 3.4 Create UI Elements

```javascript
  /**
   * Create all UI elements
   */
  createUI() {
    // Create container to avoid conflicts with page styles
    const container = document.createElement('div');
    container.id = 'page-summarizer-container';

    // Floating Action Button
    const fab = document.createElement('button');
    fab.id = 'ps-fab';
    fab.innerHTML = '📝';
    fab.title = 'Summarize this page (Ctrl+Shift+S)';
    this.elements.fab = fab;

    // Settings Button
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'ps-settings-btn';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = 'Settings';
    this.elements.settingsBtn = settingsBtn;

    // Keyboard shortcut hint
    const shortcutHint = document.createElement('div');
    shortcutHint.className = 'ps-shortcut';
    shortcutHint.textContent = 'Ctrl+Shift+S';
    this.elements.shortcutHint = shortcutHint;

    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'ps-sidebar';
    sidebar.innerHTML = this.renderSidebarContent();
    this.elements.sidebar = sidebar;

    // Settings Panel (from Anouk)
    this.elements.settingsPanel = createSettingsPanel(this.aiService);

    // Toast notification
    const toast = document.createElement('div');
    toast.className = 'ps-toast';
    this.elements.toast = toast;

    // Append all elements
    container.appendChild(fab);
    container.appendChild(settingsBtn);
    container.appendChild(shortcutHint);
    container.appendChild(sidebar);
    container.appendChild(this.elements.settingsPanel);
    container.appendChild(toast);
    document.body.appendChild(container);
  }

  /**
   * Render sidebar HTML content
   */
  renderSidebarContent() {
    return `
      <div class="ps-header">
        <h2>📝 Page Summary</h2>
        <button class="ps-close-btn" id="ps-close">×</button>
      </div>
      <div class="ps-content" id="ps-content">
        <div class="ps-empty">
          <div class="ps-empty-icon">📄</div>
          <p class="ps-empty-text">Click "Summarize" to analyze this page</p>
          <p class="ps-empty-hint">Or press Ctrl+Shift+S</p>
        </div>
      </div>
      <div class="ps-actions">
        <button class="ps-btn ps-btn-primary" id="ps-summarize">
          ✨ Summarize Page
        </button>
        <button class="ps-btn ps-btn-secondary" id="ps-copy" disabled>
          📋 Copy
        </button>
      </div>
    `;
  }
```

### 3.5 Event Listeners and Keyboard Shortcuts

```javascript
  /**
   * Attach event listeners to UI elements
   */
  attachEventListeners() {
    // FAB click - toggle sidebar
    this.elements.fab.addEventListener('click', () => this.toggleSidebar());

    // Settings button
    this.elements.settingsBtn.addEventListener('click', () => {
      toggleSettingsPanel(this.elements.settingsPanel);
    });

    // Close button
    this.elements.sidebar.querySelector('#ps-close').addEventListener('click', () => {
      this.closeSidebar();
    });

    // Summarize button
    this.elements.sidebar.querySelector('#ps-summarize').addEventListener('click', () => {
      this.summarizePage();
    });

    // Copy button
    this.elements.sidebar.querySelector('#ps-copy').addEventListener('click', () => {
      this.copySummary();
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (this.state.isOpen &&
          !this.elements.sidebar.contains(e.target) &&
          !this.elements.fab.contains(e.target) &&
          !this.elements.settingsBtn.contains(e.target) &&
          !this.elements.settingsPanel.contains(e.target)) {
        this.closeSidebar();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isOpen) {
        this.closeSidebar();
      }
    });
  }

  /**
   * Set up keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+S - Toggle sidebar and summarize
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        this.toggleSidebar();
        if (!this.state.summary && !this.state.isLoading) {
          this.summarizePage();
        }
      }

      // Ctrl+Shift+C - Copy summary (when sidebar open)
      if (e.ctrlKey && e.shiftKey && e.key === 'C' && this.state.isOpen && this.state.summary) {
        e.preventDefault();
        this.copySummary();
      }
    });
  }
```

### 3.6 Sidebar Controls

```javascript
  /**
   * Toggle sidebar open/closed
   */
  toggleSidebar() {
    if (this.state.isOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  /**
   * Open the sidebar
   */
  openSidebar() {
    this.state.isOpen = true;
    this.elements.sidebar.classList.add('open');
    this.elements.fab.innerHTML = '✕';
  }

  /**
   * Close the sidebar
   */
  closeSidebar() {
    this.state.isOpen = false;
    this.elements.sidebar.classList.remove('open');
    this.elements.fab.innerHTML = '📝';
  }
```

### 3.7 Page Content Extraction

```javascript
  /**
   * Extract meaningful content from the page
   */
  extractPageContent() {
    // Clone the body to avoid modifying the actual page
    const clone = document.body.cloneNode(true);

    // Remove unwanted elements
    const removeSelectors = [
      'script', 'style', 'noscript', 'iframe', 'svg',
      'nav', 'header', 'footer', 'aside',
      '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
      '.ad', '.ads', '.advertisement', '.social-share',
      '#page-summarizer-container'
    ];

    removeSelectors.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Get text content
    let text = clone.innerText || clone.textContent || '';

    // Clean up whitespace
    text = text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    // Limit length to avoid token limits (roughly 4 chars per token)
    const maxLength = 12000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }

    return text;
  }

  /**
   * Get page metadata
   */
  getPageMetadata() {
    const title = document.title || 'Untitled Page';
    const url = window.location.href;

    // Calculate reading time (average 200 words per minute)
    const text = this.extractPageContent();
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return { title, url, wordCount, readingTime };
  }
```

### 3.8 AI Summarization

```javascript
  /**
   * Summarize the current page
   */
  async summarizePage() {
    // Check if already loading
    if (this.state.isLoading) return;

    // Check API key
    const config = this.aiService.getConfig();
    if (!config.apiKey) {
      this.showError('API key required', 'Please configure your API key in settings.');
      return;
    }

    // Set loading state
    this.state.isLoading = true;
    this.state.error = null;
    this.renderLoading();

    try {
      // Extract content and metadata
      const content = this.extractPageContent();
      const metadata = this.getPageMetadata();

      // Check if content is too short
      if (content.length < 100) {
        throw new Error('This page doesn\'t have enough text content to summarize.');
      }

      // Generate summary with AI
      const prompt = `Analyze this webpage content and provide:

1. A concise summary (2-3 sentences) that captures the main point
2. 3-5 key takeaways as bullet points
3. The primary topic/category of this content

Format your response exactly as:
SUMMARY:
[Your summary here]

KEY POINTS:
- [Point 1]
- [Point 2]
- [Point 3]

TOPIC: [Primary topic]`;

      const response = await this.aiService.call(
        prompt,
        content,
        metadata.url,
        'full_analysis'
      );

      // Parse and store the response
      this.state.summary = this.parseAIResponse(response, metadata);
      this.state.currentUrl = metadata.url;

      // Render the results
      this.renderSummary();

    } catch (error) {
      console.error('Summarization error:', error);
      this.state.error = error.message;
      this.renderError(error.message);
    } finally {
      this.state.isLoading = false;
    }
  }

  /**
   * Parse AI response into structured data
   */
  parseAIResponse(response, metadata) {
    const sections = {
      summary: '',
      keyPoints: [],
      topic: '',
      metadata: metadata
    };

    // Extract summary
    const summaryMatch = response.match(/SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|$)/i);
    if (summaryMatch) {
      sections.summary = summaryMatch[1].trim();
    }

    // Extract key points
    const keyPointsMatch = response.match(/KEY POINTS:\s*([\s\S]*?)(?=TOPIC:|$)/i);
    if (keyPointsMatch) {
      const points = keyPointsMatch[1].match(/[-•]\s*(.+)/g);
      if (points) {
        sections.keyPoints = points.map(p => p.replace(/^[-•]\s*/, '').trim());
      }
    }

    // Extract topic
    const topicMatch = response.match(/TOPIC:\s*(.+)/i);
    if (topicMatch) {
      sections.topic = topicMatch[1].trim();
    }

    // Fallback if parsing failed
    if (!sections.summary && !sections.keyPoints.length) {
      sections.summary = response;
    }

    return sections;
  }
```

### 3.9 Rendering Functions

```javascript
  /**
   * Render loading state
   */
  renderLoading() {
    const content = this.elements.sidebar.querySelector('#ps-content');
    content.innerHTML = `
      <div class="ps-loading">
        <div class="ps-spinner"></div>
        <p class="ps-loading-text">Analyzing page content...</p>
      </div>
    `;

    // Disable buttons
    this.elements.sidebar.querySelector('#ps-summarize').disabled = true;
    this.elements.fab.classList.add('loading');
  }

  /**
   * Render the summary
   */
  renderSummary() {
    const { summary, keyPoints, topic, metadata } = this.state.summary;
    const content = this.elements.sidebar.querySelector('#ps-content');

    content.innerHTML = `
      <div class="ps-page-info">
        <h3 class="ps-page-title">${this.escapeHtml(metadata.title)}</h3>
        <div class="ps-page-meta">
          <span class="ps-meta-item">📖 ${metadata.readingTime} min read</span>
          <span class="ps-meta-item">📝 ${metadata.wordCount.toLocaleString()} words</span>
          ${topic ? `<span class="ps-meta-item">🏷️ ${this.escapeHtml(topic)}</span>` : ''}
        </div>
      </div>

      <div class="ps-section">
        <h4 class="ps-section-title">Summary</h4>
        <p class="ps-summary-text">${this.escapeHtml(summary)}</p>
      </div>

      ${keyPoints.length > 0 ? `
        <div class="ps-section">
          <h4 class="ps-section-title">Key Points</h4>
          <ul class="ps-key-points">
            ${keyPoints.map(point => `<li>${this.escapeHtml(point)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;

    // Enable buttons
    this.elements.sidebar.querySelector('#ps-summarize').disabled = false;
    this.elements.sidebar.querySelector('#ps-summarize').innerHTML = '🔄 Re-summarize';
    this.elements.sidebar.querySelector('#ps-copy').disabled = false;
    this.elements.fab.classList.remove('loading');
  }

  /**
   * Render error state
   */
  renderError(message) {
    const content = this.elements.sidebar.querySelector('#ps-content');

    let actionText = 'Try again';
    let isKeyError = message.toLowerCase().includes('api') ||
                     message.toLowerCase().includes('key') ||
                     message.toLowerCase().includes('401');

    content.innerHTML = `
      <div class="ps-error">
        <div class="ps-error-icon">⚠️</div>
        <p class="ps-error-message">${this.escapeHtml(message)}</p>
        <span class="ps-error-action" id="ps-error-action">
          ${isKeyError ? 'Open Settings' : 'Try Again'}
        </span>
      </div>
    `;

    // Attach action handler
    content.querySelector('#ps-error-action').addEventListener('click', () => {
      if (isKeyError) {
        toggleSettingsPanel(this.elements.settingsPanel);
      } else {
        this.summarizePage();
      }
    });

    // Re-enable buttons
    this.elements.sidebar.querySelector('#ps-summarize').disabled = false;
    this.elements.fab.classList.remove('loading');
  }

  /**
   * Show error in sidebar
   */
  showError(title, message) {
    this.openSidebar();
    this.renderError(`${title}: ${message}`);
  }
```

### 3.10 Utility Functions

```javascript
  /**
   * Copy summary to clipboard
   */
  async copySummary() {
    if (!this.state.summary) return;

    const { summary, keyPoints, metadata } = this.state.summary;

    const text = `# ${metadata.title}

## Summary
${summary}

## Key Points
${keyPoints.map(p => `• ${p}`).join('\n')}

---
Summarized from: ${metadata.url}
Generated by Smart Page Summarizer`;

    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Summary copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      this.showToast('Failed to copy');
    }
  }

  /**
   * Show toast notification
   */
  showToast(message) {
    this.elements.toast.textContent = message;
    this.elements.toast.classList.add('show');

    setTimeout(() => {
      this.elements.toast.classList.remove('show');
    }, 2000);
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the extension
new PageSummarizer();
```

---

## Step 4: Build and Test

### 4.1 Build the Extension

```bash
npm run build
```

Expected output:

```
> esbuild src/extension.js --bundle --outfile=dist/bundle.js

  dist/bundle.js  45.2kb

Done in 28ms
```

### 4.2 Load in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select your `page-summarizer` folder

### 4.3 Test the Extension

1. Navigate to any article (e.g., Wikipedia, Medium, news site)
2. Look for the purple floating button (bottom-right)
3. Click the button to open the sidebar
4. Click the settings button (gear icon) and enter your API key
5. Click **Summarize Page**
6. View your AI-generated summary!

---

## Step 5: Enhancements (Optional)

### 5.1 Add More Summary Styles

```javascript
// Add to constructor
this.summaryStyles = {
  concise: 'Provide a very brief 1-2 sentence summary',
  detailed: 'Provide a detailed summary with all important points',
  bullets: 'Summarize as a bulleted list only',
  eli5: 'Explain this page like I\'m 5 years old'
};
```

### 5.2 Add History

```javascript
// Save summaries to localStorage
saveSummary(summary) {
  const history = JSON.parse(localStorage.getItem('ps_history') || '[]');
  history.unshift({
    ...summary,
    timestamp: Date.now()
  });
  // Keep last 50
  localStorage.setItem('ps_history', JSON.stringify(history.slice(0, 50)));
}
```

### 5.3 Add Export Options

```javascript
// Export as Markdown
exportMarkdown() {
  const { summary, keyPoints, metadata } = this.state.summary;
  const md = `# ${metadata.title}\n\n${summary}\n\n${keyPoints.map(p => `- ${p}`).join('\n')}`;
  this.downloadFile(md, 'summary.md', 'text/markdown');
}

downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

## Complete Source Code

The complete source code for this tutorial is available in the repository. You can copy the entire extension code from this page or clone it:

```bash
git clone https://github.com/your-org/anouk.git
cd anouk/examples/page-summarizer
npm install
npm run build
```

---

## Next Steps

Congratulations! You've built a complete, production-ready AI-powered browser extension.

### What You've Learned

- [x] Setting up an Anouk extension project
- [x] Creating professional UI components
- [x] Integrating AI for content analysis
- [x] Implementing error handling and loading states
- [x] Adding keyboard shortcuts
- [x] Caching AI responses
- [x] Extracting and parsing content

### Continue Your Journey

- **[Configuration Guide](../guides/configuration.md)** - Master all configuration options
- **[Providers Guide](../guides/providers.md)** - Optimize for different AI providers
- **[API Reference](../reference/api.md)** - Explore all Anouk APIs
- **[Gmail Assistant](../examples/gmail-assistant.md)** - See a more complex example
