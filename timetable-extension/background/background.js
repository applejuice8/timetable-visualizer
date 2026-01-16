function sendToActiveTab(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, msg);
        }
    });
}

chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.type) {
        // Send to timetable.html
        case 'SCRAPE':
        case 'SELECT':
            sendToActiveTab(msg);
            break;

        // Send to timetable.js
        case 'SCRAPED_DATA':
        case 'POPUP':
            chrome.runtime.sendMessage(msg);
            break;
    }
});
