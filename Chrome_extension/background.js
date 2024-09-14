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
  
// Parent class is customOptions
chrome.contextMenus.create({
    id: "Paste",
    title: "Paste",
    parentId: "customOption",
    contexts: ["all"]
  });
  


clipboardpro=[];


//////////////////////////////////////
chrome.commands.onCommand.addListener(function(command) {
  if (command === "execute_Copy") {

    var selectedText = info.selectionText;
    clipboardpro.push(selectedText);
    alert(clipboardpro)
    
  } else if (command === "execute_Paste") {

    chrome.windows.create({
      url: "hover.html", // The content of the hover window
      type: "popup",
      width: 300,
      height: 200,
      left: Math.floor(window.screen.width / 2 - 150),
      top: Math.floor(window.screen.height / 2 - 100)
    });

  }
});
///////////////////////////////////////




chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "Copy") {
      // The selected text will be available in info.selectionText
      var selectedText = info.selectionText;
      clipboardpro.push(selectedText);
      alert(clipboardpro)
      //var n=document.createElement("button");
      //document.body.appendChild(n)

    }
  });
  

 // Add action for Sub Option 2 to open a popup/hover window
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "Paste") {
    chrome.windows.create({
      url: "hover.html", // The content of the hover window
      type: "popup",
      width: 300,
      height: 200,
      left: Math.floor(window.screen.width / 2 - 150),
      top: Math.floor(window.screen.height / 2 - 100)
    });
  }
});
