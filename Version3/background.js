let linkedList = [];

// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy",
    title: "Copy Selected Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "paste",
    title: "Paste Last Copied Item",
    contexts: ["editable", "selection"]  
  });
});

// Handle context menu actions
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyText
    });
  } else if (info.menuItemId === "paste") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: pasteText,
      args: [linkedList]
    });
  }
});

// Add command listeners for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === "copy_item") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: copyText
      });
    });
  } else if (command === "paste_item") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: pasteText,
        args: [linkedList]
      });
    });
  }
});

// Copy text function
function copyText() {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    chrome.storage.local.get("linkedList", (data) => {
      const list = data.linkedList || [];
      list.push(selectedText);
      chrome.storage.local.set({ linkedList: list });
    });
  }
}

// Paste text function
function pasteText(linkedList) {
  const input = document.activeElement; 
  const lastItem = linkedList.pop();
  if (lastItem && input.tagName === "TEXTAREA") {
    input.value += lastItem; 
  } else if (lastItem && input.isContentEditable) {
    input.innerHTML += lastItem; 
  }
}


//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