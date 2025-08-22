# Anouk - AI Browser Extension Framework

## Overview

Anouk is a framework for creating browser extensions with AI capabilities. It provides a flexible foundation for developers to build extensions that work with any OpenAI-compatible provider, including OpenAI, Together.xyz, Anthropic, and local models like Ollama.

The framework includes the Gmail Assistant as a reference implementation showing how to build a powerful email productivity tool.

## Features

- **Multi-Provider Support**: Works with any OpenAI-compatible API provider
- **Configurable UI Components**: Reusable sidebar, floating buttons, and settings panels
- **Caching System**: Built-in caching to reduce API calls
- **Rate Limiting**: Queue management for API calls
- **Easy Configuration**: In-extension settings panel for runtime configuration
- **Modular Design**: Extensible architecture for custom functionality
- **CLI Tool**: Command-line interface for generating projects and templates

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/anouk.git
   cd anouk
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the extension:
   ```
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the project directory

## CLI Usage

Anouk provides a command-line interface for generating projects and templates:

```
anouk <command> [options]

Commands:
  init <project-name>        Initialize a new Anouk project
  generate <template> <name> Generate a template file
  help                       Show help message

Templates:
  extension                  Generate a basic extension template
  service                    Generate an AI service template
  config                     Generate a configuration template

Examples:
  anouk init my-extension
  anouk generate extension email-analyzer
  anouk generate service custom-ai-service
```

## Configuration

The extension now supports any OpenAI-compatible provider. You can configure the AI service through the settings panel in the extension UI or programmatically.

### Using the Settings Panel

1. Click the green settings button in the bottom-right corner of Gmail
2. Enter your provider URL, API key, model name, and system prompt
3. Click "Save Settings"

### Programmatic Configuration

You can also configure the AI service programmatically by modifying the `src/aiConfig.js` file or by passing configuration to the AIService constructor.

### Supported Providers

The extension has predefined configurations for:
- Together.xyz (default)
- OpenAI
- Anthropic Claude
- Ollama (local models)
- Hugging Face

Example configuration for OpenAI:
```javascript
{
    providerUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'your-openai-api-key',
    model: 'gpt-4',
    systemPrompt: 'You are a helpful assistant that analyzes emails.'
}
```

## Usage as a Library

Developers can use this project as a library to create their own AI-powered browser extensions:

```javascript
import { AIService } from 'anouk';

// Create an AI service instance
const aiService = new AIService({
    providerUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'your-api-key',
    model: 'gpt-4'
});

// Make AI calls
const response = await aiService.call(
    'Summarize this text:', 
    'Your content here', 
    'unique-id', 
    'cache-key'
);
```

## Development

- Run the development build with watch mode:
  ```
  npm run dev
  ```
- The extension will automatically rebuild when you make changes to the source files.

## Project Structure

- `src/`: Source files
  - `aiService.js`: Configurable AI service for any OpenAI-compatible provider
  - `configManager.js`: Configuration management
  - `settingsPanel.js`: UI component for in-extension settings
  - `extension.js`: Main extension logic (Gmail Assistant reference implementation)
  - `api.js`: API interaction and caching logic
  - `gmailJsLoader.js`: Gmail.js initialization
- `dist/`: Built files (generated after running `npm run build`)
- `manifest.json`: Chrome extension manifest file
- `bin/`: CLI tools
- `templates/`: Template files for CLI

## Dependencies

- [gmail.js](https://github.com/KartikTalwar/gmail.js/): Library for interacting with Gmail
- [esbuild](https://esbuild.github.io/): Fast JavaScript bundler

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This extension is not affiliated with or endorsed by Google. Use at your own risk and ensure compliance with Gmail's terms of service.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/gmail-assistant.git
   cd gmail-assistant
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the extension:
   ```
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` directory in the project folder

## Configuration

The extension now supports any OpenAI-compatible provider. You can configure the AI service through the settings panel in the extension UI or programmatically.

### Using the Settings Panel

1. Click the green settings button in the bottom-right corner of Gmail
2. Enter your provider URL, API key, model name, and system prompt
3. Click "Save Settings"

### Programmatic Configuration

You can also configure the AI service programmatically by modifying the `src/aiConfig.js` file or by passing configuration to the AIService constructor.

### Supported Providers

The extension has predefined configurations for:
- Together.xyz (default)
- OpenAI
- Anthropic Claude
- Ollama (local models)
- Hugging Face

Example configuration for OpenAI:
```javascript
{
    providerUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'your-openai-api-key',
    model: 'gpt-4',
    systemPrompt: 'You are a helpful assistant that analyzes emails.'
}
```

## Usage

1. Open Gmail in Chrome.
2. The Gmail Assistant sidebar will appear on the right side of the screen.
3. As you view emails, the assistant will automatically analyze them and provide summaries, structured data, and potential replies.
4. Use the "Send Automatic Reply" button to trigger automatic replies based on predefined rules.

## Development

- Run the development build with watch mode:
  ```
  npm run dev
  ```
- The extension will automatically rebuild when you make changes to the source files.

## Project Structure

- `src/`: Source files
  - `extension.js`: Main extension logic
  - `api.js`: API interaction and caching logic
  - `gmailJsLoader.js`: Gmail.js initialization
- `dist/`: Built files (generated after running `npm run build`)
- `manifest.json`: Chrome extension manifest file

## Dependencies

- [gmail.js](https://github.com/KartikTalwar/gmail.js/): Library for interacting with Gmail
- [sqlite3](https://github.com/mapbox/node-sqlite3): SQLite database for caching
- [esbuild](https://esbuild.github.io/): Fast JavaScript bundler

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This extension is not affiliated with or endorsed by Google. Use at your own risk and ensure compliance with Gmail's terms of service.