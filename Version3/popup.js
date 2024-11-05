document.addEventListener('DOMContentLoaded', function () {
  const itemList = document.getElementById('item-list');
  const searchBar = document.getElementById('search-bar');
  const clearAllButton = document.getElementById('clear-all');

  // Load items from storage
  chrome.storage.local.get('linkedList', (data) => {
    const linkedList = data.linkedList || [];
    linkedList.forEach((item, index) => {
      createItemButton(item, index, itemList, linkedList);
    });
  });

  // Search bar event listener
  searchBar.addEventListener('input', function () {
    const filterText = searchBar.value.toLowerCase();
    const items = itemList.querySelectorAll('.item');
    items.forEach(item => {
      const text = item.querySelector('button').textContent.toLowerCase();
      item.style.display = text.includes(filterText) ? '' : 'none';
    });
  });

  // Clear all items
  clearAllButton.onclick = () => {
    chrome.storage.local.set({ linkedList: [] }); // Clear storage
    itemList.innerHTML = ''; // Clear displayed items
  };

  // Handle the custom input for ChatGPT
  const sendButton = document.getElementById('send-btn');
  sendButton.onclick = async () => {
    const inputText = document.getElementById('custom-input').value;
    if (inputText.trim()) {
      const response = await fetchChatGPT(inputText);
      if (response) {
        createItemButton(response, itemList.children.length, itemList);
        document.getElementById('custom-input').value = ''; // Clear the input field
        saveToStorage(response);
      }
    }
  };

  // Save selected snippet
  const saveSnippetButton = document.getElementById('save-snippet');
  saveSnippetButton.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getSelectedText,
      }, (results) => {
        if (results && results[0]) {
          const selectedText = results[0];
          createItemButton(selectedText, itemList.children.length, itemList);
          saveToStorage(selectedText);
        }
      });
    });
  };

  // Take screenshot
  const takeScreenshotButton = document.getElementById('take-screenshot');
  takeScreenshotButton.onclick = () => {
    chrome.tabs.captureVisibleTab(null, {}, (image) => {
      createScreenshotButton(image, itemList);
    });
  };
});

// Function to create a button for an item
function createItemButton(item, index, itemList, linkedList = null) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item'; // Use a class for styling

  const button = document.createElement('button');
  button.textContent = item.length > 30 ? item.substring(0, 30) + '...' : item; // Limit button text length
  button.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: insertText,
        args: [item]
      });
    });
  };

  if (linkedList) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = () => {
      linkedList.splice(index, 1); // Remove item from linked list
      chrome.storage.local.set({ linkedList }); // Update storage
      itemDiv.remove(); // Remove the item from the popup
    };
    itemDiv.appendChild(deleteButton);
  }

  itemDiv.appendChild(button);
  itemList.appendChild(itemDiv);
}

// Function to create a button for a screenshot
function createScreenshotButton(imageUrl, itemList) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'item'; // Use a class for styling

  const button = document.createElement('button');
  button.textContent = 'Screenshot'; // Display a generic button text
  button.onclick = () => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = '100%'; // Make the image fit within the popup
    document.body.appendChild(img);
  };

  itemDiv.appendChild(button);
  itemList.appendChild(itemDiv);
}

// Function to get selected text from the page
function getSelectedText() {
  return window.getSelection().toString(); // Return the selected text
}

// Function to send the input to the ChatGPT API
async function fetchChatGPT(inputText) {
  const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // Use the desired model
      messages: [{ role: "user", content: inputText }]
    })
  });

  if (!response.ok) {
    console.error('Error fetching from ChatGPT:', response.statusText);
    return null; // Handle errors gracefully
  }

  const data = await response.json();
  return data.choices[0].message.content; // Return the generated response
}

function insertText(text) {
  const input = document.activeElement; // Get the currently focused element
  if (input.tagName === "TEXTAREA") {
    input.value += text; // Paste into a textarea
  } else if (input.isContentEditable) {
    input.innerHTML += text; // Paste into editable content
  }
}

function saveToStorage(item) {
  chrome.storage.local.get('linkedList', (data) => {
    const linkedList = data.linkedList || [];
    linkedList.push(item); // Add new item to linked list
    chrome.storage.local.set({ linkedList }); // Save updated linked list
  });
}
