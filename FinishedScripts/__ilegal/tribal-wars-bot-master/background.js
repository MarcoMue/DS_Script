chrome.extension.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.hasOwnProperty("open")) {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                chrome.tabs.executeScript(tabs[0].id, { file: "content.js" });
            });
        }
    }
)