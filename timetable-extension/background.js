// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SCRAPE') {
        // Get the active tab and send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'SCRAPE' });
        }
        });
    }
    
    if (message.type === 'SCRAPED_DATA') {
        // Forward scraped data to popup
        chrome.runtime.sendMessage(message);
    }
    
    if (message.type === 'SELECTED') {
        // Forward selection to content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { 
            type: 'SELECTED', 
            payload: message.payload 
            });
        }
        });
    }
});