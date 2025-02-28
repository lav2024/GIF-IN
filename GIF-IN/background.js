chrome.action.onClicked.addListener((tab) => {
    console.log("Browser action button clicked!");
    
    chrome.tabs.sendMessage(tab.id, { action: "inject_gif" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error sending message from background:", chrome.runtime.lastError.message);
        } else {
            console.log("Response from content script:", response);
        }
    });
});
