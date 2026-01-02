# Gmail Assistant Example

A complete walkthrough of the Gmail Assistant reference implementation.

---

## Overview

The Gmail Assistant is a full-featured extension that demonstrates Anouk's capabilities:

- Email summarization
- Structured data extraction
- Reply generation
- Inbox summaries
- Auto-reply rules

---

## Features

### Email Analysis

When viewing an email, the assistant automatically:

1. Detects the email view event
2. Extracts email content
3. Generates a summary
4. Extracts structured data (sender, date, action items)
5. Suggests possible replies

### Sidebar Interface

The sidebar provides a tabbed interface:

| Tab | Function |
|-----|----------|
| Inbox | Overview and inbox summary |
| Email | Current email analysis |
| Actions | Reply generation, auto-reply rules |

### Auto-Reply System

Configure rules to automatically generate replies:

```javascript
const rules = [
  {
    condition: { from: '@company.com' },
    template: 'Professional response template'
  },
  {
    condition: { subject: 'urgent' },
    template: 'Priority response template'
  }
];
```

---

## Architecture

```
gmail-assistant/
├── src/
│   ├── extension.js      # Main entry, Gmail integration
│   ├── aiService.js      # AI interactions
│   ├── configManager.js  # Configuration
│   └── settingsPanel.js  # Settings UI
├── manifest.json
└── package.json
```

---

## Key Components

### Gmail.js Integration

The extension uses gmail.js to interact with Gmail:

```javascript
import Gmail from 'gmail-js';

const gmail = new Gmail();

// Detect email view
gmail.observe.on('view_email', (domEmail) => {
  const emailData = gmail.new.get.email_data(domEmail);
  this.analyzeEmail(emailData);
});

// Detect compose
gmail.observe.on('compose', (compose) => {
  this.handleCompose(compose);
});
```

### Email Analysis

```javascript
async analyzeEmail(emailData) {
  const content = emailData.content_html || emailData.content_plain;
  const emailId = emailData.id;

  // Generate summary
  const summary = await this.aiService.call(
    'Summarize this email in 2-3 sentences',
    content,
    emailId,
    'summary'
  );

  // Extract structured data
  const structured = await this.aiService.call(
    `Extract as YAML:
    - sender: name and email
    - date: when sent
    - subject: email subject
    - action_items: list of required actions
    - sentiment: positive/neutral/negative`,
    content,
    emailId,
    'structured'
  );

  this.displayAnalysis(summary, structured);
}
```

### Reply Generation

```javascript
async generateReply(emailContent, tone = 'professional') {
  const instruction = `Generate a ${tone} reply to this email.
Keep it concise and address all points raised.`;

  return await this.aiService.call(
    instruction,
    emailContent,
    emailId,
    `reply_${tone}`
  );
}
```

---

## Sidebar Implementation

### Structure

```javascript
createSidebar() {
  this.sidebar = document.createElement('div');
  this.sidebar.id = 'gmail-assistant-sidebar';
  this.sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2>Gmail Assistant</h2>
      <button class="close-btn">&times;</button>
    </div>

    <div class="sidebar-tabs">
      <button class="tab active" data-tab="inbox">Inbox</button>
      <button class="tab" data-tab="email">Email</button>
      <button class="tab" data-tab="actions">Actions</button>
    </div>

    <div class="sidebar-content">
      <div id="inbox-tab" class="tab-content active">
        <!-- Inbox content -->
      </div>
      <div id="email-tab" class="tab-content">
        <!-- Email analysis -->
      </div>
      <div id="actions-tab" class="tab-content">
        <!-- Actions and auto-reply -->
      </div>
    </div>
  `;

  document.body.appendChild(this.sidebar);
}
```

### Tab Switching

```javascript
initTabs() {
  const tabs = this.sidebar.querySelectorAll('.tab');
  const contents = this.sidebar.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Add active to clicked
      tab.classList.add('active');
      const tabId = tab.dataset.tab;
      this.sidebar.querySelector(`#${tabId}-tab`).classList.add('active');
    });
  });
}
```

---

## Auto-Reply Rules

### Rule Definition

```javascript
const autoReplyRules = [
  {
    name: 'VIP Clients',
    conditions: {
      from: ['@important-client.com', '@vip.com']
    },
    action: {
      generateReply: true,
      tone: 'formal',
      template: 'Thank you for your email. I will respond within 24 hours.'
    }
  },
  {
    name: 'Support Tickets',
    conditions: {
      subject: ['[TICKET]', 'Support Request']
    },
    action: {
      generateReply: true,
      tone: 'helpful',
      includeTicketNumber: true
    }
  }
];
```

### Rule Matching

```javascript
matchRules(emailData) {
  for (const rule of this.autoReplyRules) {
    if (this.matchesConditions(emailData, rule.conditions)) {
      return rule;
    }
  }
  return null;
}

matchesConditions(email, conditions) {
  if (conditions.from) {
    const fromMatch = conditions.from.some(pattern =>
      email.from.toLowerCase().includes(pattern.toLowerCase())
    );
    if (!fromMatch) return false;
  }

  if (conditions.subject) {
    const subjectMatch = conditions.subject.some(pattern =>
      email.subject.toLowerCase().includes(pattern.toLowerCase())
    );
    if (!subjectMatch) return false;
  }

  return true;
}
```

---

## Styling

### CSS Variables

```css
:root {
  --sidebar-width: 400px;
  --primary-color: #1a73e8;
  --background: #ffffff;
  --text-color: #202124;
  --border-color: #dadce0;
  --shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

### Sidebar Styles

```css
#gmail-assistant-sidebar {
  position: fixed;
  top: 0;
  right: calc(-1 * var(--sidebar-width));
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--background);
  box-shadow: var(--shadow);
  z-index: 10001;
  transition: right 0.3s ease;
  font-family: 'Google Sans', Roboto, sans-serif;
}

#gmail-assistant-sidebar.open {
  right: 0;
}
```

---

## Complete Code

The full Gmail Assistant source code is available in the repository:

```bash
git clone https://github.com/your-org/anouk.git
cd anouk/src
```

Key files:
- `extension.js` - Main extension logic
- `aiService.js` - AI service class
- `configManager.js` - Configuration management
- `settingsPanel.js` - Settings UI

---

## Installation

### From npm

```bash
npm install anouk
npm run build
```

### Load in Chrome

1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `dist/` folder

### Configure

1. Open Gmail
2. Click the settings button (green icon)
3. Enter your API key
4. Select your preferred provider

---

## Customization Ideas

### Add More Tabs

```javascript
// Add a "Contacts" tab
const contactsTab = {
  id: 'contacts',
  label: 'Contacts',
  content: this.renderContactsTab()
};
```

### Custom Analysis Prompts

```javascript
const customPrompts = {
  legalReview: 'Identify any legal implications or commitments in this email',
  actionItems: 'Extract all action items with deadlines',
  sentiment: 'Analyze the emotional tone and urgency level'
};
```

### Integration with Calendar

```javascript
async extractMeetingDetails(emailContent) {
  return await this.aiService.call(
    `Extract meeting details as JSON:
    { date, time, location, attendees, agenda }`,
    emailContent,
    emailId,
    'meeting'
  );
}
```
