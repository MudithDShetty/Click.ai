# Click.ai

Data Structure Implementation
Type of Data Structure
Modularized storage 
Easy to extract and manipulate
Dynamic management
Possible storage of different data type storage
Functionality
The "Better Copy" Chrome extension is an enhanced clipboard tool that lets users save and access multiple selected text snippets from any webpage. When a user highlights text and selects "Add Selected Text to Better Copy" from the right-click menu, the text is saved in a linked list structure and stored locally. Opening the extension’s popup shows each saved snippet as a button, and clicking a button copies that snippet to the clipboard for easy use. The extension also includes a "Clear" button to delete all stored snippets, providing a simple way to manage copied content directly within the browser.
Problem-solving Approach
Algorithm
Inserting 
Start
User selects block of text on the webpage and opens context menu.
IF user selects "Add Selected Text to Better Copy" THEN 
SET text = highlighted text // Capture the user's selected text 
CALL addNewText(text) // Call the main function to handle insertion
Check if there is an existing linked list in local storage
True:
linkedList ← LinkedList.fromArray(data["linkedList"]) // Convert saved array to linked list
False:
linkedList ← NEW LinkedList() // Initialize a new linked list if none exists
CREATE newNode AS Node:
newNode.value ← text // Assign the input text to the new node’s value
newNode.next ← linkedList.head // Link new node’s next to the current head
linkedList.head ← newNode // Update head of the linked list to the new node
INCREMENT linkedList.size by 1
linkedListArray ← linkedList.toArray() // Convert linked list to array format for local storage
CALL chrome.storage.local.set({ "linkedList": linkedListArray } //Save the Updated Array Back to Chrome Storage
CALL addButtonToPopup(text) // Function to create and add the button
End

Clear
Start
User opens the extension popup and clicks the "Clear" button.
CALL clearLinkedList() // Main function to handle clearing the list and updating the UI
CALL chrome.storage.local.set({ "linkedList": [] }) // Set linked list in storage to an empty array
SET buttonContainer.innerHTML to an empty string // Remove all buttons from the popup UI
End
Efficiency
Insertion Efficiency
Every time the user saves a new text snippet through the context menu, the extension adds the snippet as the head node of the linked list. This operation is efficient because adding a new node to the beginning of a linked list is an O(1) operation,
Storage and Retrieval Efficiency
Using a linked list allows each saved item to occupy minimal storage space without needing a contiguous memory block, making it more memory-efficient when adding many entries sequentially. The extension converts the linked list to an array only when saving to Chrome’s local storage, which slightly impacts efficiency during this step. However, this conversion is straightforward and manageable because Chrome storage handles array structures well.
Access Efficiency
When displaying the saved snippets in the popup, the extension quickly iterates over the list, converting it to an array format, which is then used to render buttons. This approach allows recent items to appear at the top of the list consistently, matching the user’s expected order of access. Linked lists naturally support Last-In-First-Out (LIFO) ordering for new items, aligning with clipboard usage patterns where recently copied items are the most relevant.
Code
Organization
There are five files that make up this extension. 
Manifest.json: This file is used to describe the extension’s details to the Chrome browser. It contains the basic details of the extension like properties, permissions, and background scripts. For our project we use the “contextMenus” and “Storage” permission.

Index.html: In this file the display of the pop-up window is handled. It is a basic “.html” file that is used to link the “.css” and “.js” files together. Only the positioning of the buttons and the title is described in this file.

Style.css: This file gives the visible UI details for the pop-up window to the “index.html” file.

Script.js: This script is specific to the pop-up window and manages how the stored data is displayed to the user. On opening the pop-up window this file fetches the stored list, converts it to a linked list, and generates buttons for each entry. Any operations on the linked list within the popup, like clearing the list, are handled here.

Background.js: This file runs in the background of the Chrome extension and handles actions such as creating context menus and managing events. When a user selects text and clicks "Add Selected Text to Better Copy" in the context menu, background.js creates a new linked list or updates an existing one to store the selected text. Since this operation happens outside the popup interface, this file needs its own linked list implementation. 

User Interface
Input/Output
The input of the extension has two parts to it:
Text Selection and Context Menu: When a user highlights text on a webpage and right-clicks, a context menu option titled “Add Selected Text to Better Copy” becomes available.
Popup Interaction: On opening the pop-up window the user selects the text block they want in their clipboard.
Similarly to the input to the input there are three outputs for the extension:
Display of Saved Text: The popup interface lists all previously saved snippets, displaying each as a button.
Copying a Snippet to the Clipboard: When the user clicks any button representing a text snippet in the popup, script.js uses the navigator.clipboard.writeText() function to copy the snippet’s content to the clipboard.
Clearing the Saved List: The "Clear" button at the bottom of the popup allows users to delete all saved snippets.
