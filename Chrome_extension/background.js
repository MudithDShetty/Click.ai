chrome.contextMenus.create({
    id: "customOption",
    title: "Click.ai",
    contexts: ["selection"]  // This ensures the context menu appears only when text is selected
  });
chrome.contextMenus.create({
    id: "Copy",
    title: "Copy",
    parentId: "customOption",
    contexts: ["all"]
  });
  
  // Create another sub-option under the parent
chrome.contextMenus.create({
    id: "Paste",
    title: "Paste",
    parentId: "customOption",
    contexts: ["all"]
  });
  



clipboardpro=[];
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "Copy") {
      // The selected text will be available in info.selectionText
      var selectedText = info.selectionText;
      clipboardpro.push(selectedText);
      alert(clipboardpro)

    }
  });
  
  
 