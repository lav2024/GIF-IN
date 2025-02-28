function injectGif(gifUrl) {
    let existingGif = document.getElementById("signLanguageGif");
    if (existingGif) {
        existingGif.remove();
    }

    let gifContainer = document.createElement("div");
    gifContainer.id = "gifContainer";
    gifContainer.style.position = "fixed";
    gifContainer.style.bottom = "10px";
    gifContainer.style.right = "10px";
    gifContainer.style.width = "150px";
    gifContainer.style.height = "150px";
    gifContainer.style.cursor = "grab";
    gifContainer.style.zIndex = "9999";

    let gifElement = document.createElement("img");
    gifElement.id = "signLanguageGif";
    gifElement.src = gifUrl;
    gifElement.style.width = "100%";
    gifElement.style.height = "100%";
    gifElement.style.borderRadius = "10px";

    gifContainer.appendChild(gifElement);
    document.body.appendChild(gifContainer);

    makeDraggable(gifContainer);
}

function makeDraggable(element) {
    let offsetX, offsetY, isDragging = false;

    element.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        element.style.left = `${e.clientX - offsetX}px`;
        element.style.top = `${e.clientY - offsetY}px`;
        element.style.right = "auto";
        element.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        element.style.cursor = "grab";
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "inject_gif") {
        injectGif(request.gifUrl);
        chrome.storage.local.set({ "selectedGif": request.gifUrl });
        sendResponse({ status: "GIF Injected!" });
    }

    if (request.action === "remove_gif") {
        let existingGif = document.getElementById("gifContainer");
        if (existingGif) {
            existingGif.remove();
        }
        chrome.storage.local.remove("selectedGif");
        sendResponse({ status: "GIF Removed!" });
    }
});

chrome.storage.local.get("selectedGif", (data) => {
    if (data.selectedGif) {
        console.log("Reinjecting stored GIF:", data.selectedGif);
        injectGif(data.selectedGif);
    }
});
