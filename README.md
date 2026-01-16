# Architecture Flow

```bash
# Scrape
timetable.js
    ↓ 1. chrome.runtime.sendMessage({ type: 'SCRAPE' })
    ↑ 4. chrome.runtime.sendMessage({ type: 'SCRAPED_DATA' })
background.js
    ↓ 2. chrome.tabs.sendMessage(tabs[0].id, { type: 'SCRAPE' })
    ↑ 3. chrome.runtime.sendMessage({ type: 'SCRAPED_DATA' })
scrape.js

# Select
timetable.js
    ↓ chrome.runtime.sendMessage({ type: 'SELECT' })
background.js
    ↓ chrome.tabs.sendMessage(tabs[0].id, { type: 'SELECT' })
scrape.js
```
