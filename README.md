# YouTube Filter Project

## Overview

This project filters YouTube videos based on their transcripts to ensure content is appropriate for Muslim children. It uses a Chrome extension to interact with YouTube, a Flask server to handle transcript extraction, and a machine learning model to classify the transcripts.

## Project Structure

youtube-filter-project/
│
├── chrome-extension/
│ ├── manifest.json
│ ├── background.js
│ ├── content.js
│ ├── popup.html
│ ├── popup.js
│ └── icon.png
│
├── server/
│ ├── server.py
│ └── requirements.txt
│
├── model/
│ ├── model.pkl
│ ├── vectorizer.pkl
│ ├── label_encoder.pkl
│ └── sentiment_model.pkl
│
├── README.md
└── .gitignore

## Setup

### Server

1. Navigate to the `server/` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python3 server.py
   ```

### Chrome Extension

1. Navigate to `chrome://extensions/` in Chrome.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `chrome-extension/` directory.

## Usage

1. Open YouTube in a Chrome browser.
2. Click on the extension icon.
3. Click "Analyze Page" to filter videos based on their transcripts.

## Notes

- Ensure the server is running before using the extension.
- Adjust selectors in `content.js` as needed based on YouTube’s current page structure.
