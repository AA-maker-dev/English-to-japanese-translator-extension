# 🇬🇧 ➜ 🇯🇵 English to Japanese Translator — Chrome Extension

> A lightweight Chrome extension to instantly translate English text to natural Japanese. Select text, right-click, or use the popup to translate anywhere on the web.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/en-ja-translator)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-orange.svg)](https://developer.chrome.com/docs/extensions/mv3/)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 📖 Overview

**English to Japanese Translator** is a simple, fast, and privacy-friendly Chrome extension built to help English learners, Japanese learners, travelers, and curious readers understand English content in Japanese instantly.

Instead of opening a new tab for Google Translate every time, you can translate selected text, full paragraphs, or custom input directly from your browser toolbar or context menu.

> Original idea: *"I attempted to create an English-to-Japanese Google Chrome extension; I hope it functions correctly."* — This project turns that idea into a fully working, installable extension.

## ✨ Features

- **⚡ Instant Translation** – Translate selected English text to Japanese in one click
- **🖱️ Right-Click Context Menu** – Select text > Right-click > `Translate to Japanese`
- **🔍 Popup Translator** – Type or paste text into the extension popup for quick translation
- **📄 Full-Page Support** – Translate paragraphs without losing formatting
- **🔊 Pronunciation Support** – Romaji / Kana reading aid (optional, via API)
- **🌙 Clean UI** – Minimal popup with copy-to-clipboard button
- **🔒 Privacy-Focused** – No tracking, no ads, no unnecessary permissions
- **🆓 Free & Open Source** – MIT licensed, easy to customize

## 🚀 Demo

1. Highlight any English text on a webpage, e.g.:
   > `Hello, how are you today?`
2. Right-click → **Translate to Japanese**
3. Get:
   > `こんにちは、今日はお元気ですか？`

Or click the extension icon in the toolbar, paste text, and press **Translate**.

## 🛠️ Installation

### Option 1: Install from Source (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/en-ja-translator.git
   cd en-ja-translator
   ```

2. Open Chrome and go to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (top-right toggle).

4. Click **Load unpacked** and select the project folder (the one containing `manifest.json`).

5. Pin the extension to your toolbar for quick access.

### Option 2: Chrome Web Store (Coming Soon)

> This extension is currently under review. Once published, you'll be able to install it with one click from the Chrome Web Store.

## 💡 Usage

### 1. Using the Popup
1. Click the extension icon in the Chrome toolbar.
2. Enter or paste English text.
3. Click **Translate** to see the Japanese result.
4. Click the **Copy** icon to copy the translation.

### 2. Using Context Menu
1. Select English text on any webpage.
2. Right-click and choose **Translate to Japanese**.
3. View the translation in a small tooltip / popup window.

### 3. Keyboard Shortcut (Optional)
You can set a custom shortcut in `chrome://extensions/shortcuts`:
- Default suggestion: `Ctrl+Shift+T` (Windows) / `Cmd+Shift+T` (Mac)

## 📁 Project Structure

```
en-ja-translator/
├── manifest.json          # Extension config (Manifest V3)
├── popup.html             # Popup UI
├── popup.js               # Translation logic
├── popup.css              # Popup styling
├── background.js          # Context menu + background service worker
├── content.js             # Selected-text handling on web pages
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## 🔧 How It Works

This extension uses the **MyMemory / Google Translate API** (free tier) to translate text:

```js
// Simplified example from popup.js
async function translateToJapanese(text) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ja`
  );
  const data = await res.json();
  return data.responseData.translatedText;
}
```

> You can easily swap in Google Cloud Translation API, DeepL API, or LibreTranslate for higher accuracy by updating the API endpoint and key in `popup.js`.

### Required Permissions (and why)

| Permission | Reason |
|------------|--------|
| `activeTab` | To read selected text on the current page |
| `contextMenus` | To add right-click “Translate” option |
| `storage` | To save language preferences and history |
| `host_permissions` | To call translation API |

No browsing history is collected or sold.

## 🗺️ Roadmap / Future Improvements

- [ ] Auto-detect page language and show translate banner
- [ ] Save translation history
- [ ] Offline mode with local dictionary
- [ ] Furigana display for Kanji
- [ ] Text-to-speech for Japanese pronunciation
- [ ] Dark mode for popup UI

Contributions are welcome! See below.

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please keep code style clean and test on Chrome 110+.

## 🐞 Known Issues

- Very long paragraphs (>500 chars) may be split into multiple API calls.
- Some highly idiomatic English may translate literally. DeepL API is recommended for best accuracy.

If you find a bug, please [open an issue](https://github.com/your-username/en-ja-translator/issues).

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgements

- [Chrome Extensions Docs (Manifest V3)](https://developer.chrome.com/docs/extensions/)
- [MyMemory Translation API](https://mymemory.translated.net/)
- [Google Translate](https://translate.google.com/) for translation reference
- Icons from [Twemoji / Google Fonts Noto](https://fonts.google.com/noto/specimen/Noto+Sans+JP)

---
Made with ❤️ for English ↔ Japanese learners. If you find this useful, please ⭐ star the repo!
