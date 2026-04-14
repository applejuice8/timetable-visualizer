# iZone Timetable Visualizer Chrome Extension

A chrome extension used to visualize different combinations of classes on iZone (Sunway Student Portal).

![Screenshot](screenshot.png)

---

## Ranking Algorithm

1. Hard filter — days with no valid lunch window removed entirely
2. Fewest big gaps (>3 hours)
3. Fewest school days
4. Latest day in week as early as possible (eg. Thursday > Friday)
5. Least total gap minutes (tiebreaker)
6. Schedule key grouping (keeps timing-identical combos adjacent)

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/applejuice8/timetable-visualizer.git
```
2. Open chome extensions page on Google Chrome (`chrome://extensions/`).
3. Toggle **Developer mode** ON in the top-right corner.
4. Click **Load unpacked** and select the project root folder (`timetable-extension/`).

---

## Usage

1. In `popup/timetable.js`, edit the `mySubjects` list to your subjects. You do not need the full subject name, just a unique substring such as "operating system" instead of "Operating System Fundamentals" (Not case sensitive).
2. Navigate to iZone timetable selection page `https://izone.sunway.edu.my/...`
3. If it is not during the timetable selection period, use `mock_izone.html` to test the extension:
    1. Open `mock_izone.html` in your code editor.
    2. Right-click the file and select **Open with Live Server**.
    3. Navigate to the served URL (likely `http://127.0.0.1:5500/mock_izone.html`).
4. Click the extension icon in the top-right corner of the browser and select **Timetable Visualizer**.
5. Use the **Refresh**, **Select**, **Prev** and **Next** buttons accordingly.

---

## Architecture Flow

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
