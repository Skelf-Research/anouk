# Anouk : Email productivity

## Overview

Gmail Assistant is a Chrome extension that enhances your Gmail experience by providing AI-powered email analysis and automation features. Using the power of GPT-3, this extension offers email summarization, structured data extraction, automatic reply generation, and inbox summary capabilities.

## Features

- **Email Summarization**: Get quick summaries of your emails to save time.
- **Structured Data Extraction**: Automatically extract key information from emails in a structured format.
- **Reply Generation**: Generate potential replies to emails based on their content.
- **Inbox Summary**: Get an overview of your inbox state based on recent emails.
- **Automatic Replies**: Set up rules for automatic replies to specific types of emails.

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

1. Obtain an API key from [Together.xyz](https://www.together.xyz/).
2. Create a `.env` file in the project root and add your API key:
   ```
   OPENAI_API_KEY=your_api_key_here
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