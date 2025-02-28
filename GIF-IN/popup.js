document.addEventListener("DOMContentLoaded", function () {
    let gifSelection = document.getElementById("gifSelect");
    let injectButton = document.getElementById("injectGifButton");
    let removeButton = document.getElementById("removeGifButton");

    injectButton.addEventListener("click", function () {
        let selectedGif = gifSelection.value; 
        console.log("Inject GIF button clicked! Selected GIF:", selectedGif);

        chrome.storage.local.set({ "selectedGif": selectedGif }, () => {
            console.log("GIF URL saved in storage:", selectedGif);
        });

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length === 0) {
                console.error("No active tab found.");
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, { action: "inject_gif", gifUrl: selectedGif });
        });
    });

    removeButton.addEventListener("click", function () {
        chrome.storage.local.remove("selectedGif", () => {
            console.log("GIF URL removed from storage.");
        });

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "remove_gif" });
        });
    });
    
});
