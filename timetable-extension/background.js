function sendToActiveTab(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, msg);
        }
    });
}

chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.type) {
        case 'SCRAPE':
            sendToActiveTab({
                type: 'SCRAPE',
                payload: msg.payload
            });
            break;

        case 'SCRAPED_DATA':
            chrome.runtime.sendMessage(msg);
            break;

        case 'SELECT':
            sendToActiveTab({ 
                type: 'SELECT', 
                payload: msg.payload
            });
    }
});
