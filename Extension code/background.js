class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    addNode(value) {
        const node = new Node(value);
        if (!this.head) {
            this.head = node;
        } else {
            node.next = this.head;
            this.head = node;
        }
        this.size++;
    }

    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }

    static fromArray(array) {
        const list = new LinkedList();
        if (Array.isArray(array)) {
            array.forEach(value => list.addNode(value));
        }
        return list;
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addNode",
        title: "Add Selected Text to Better Copy",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "addNode") {
        const selectedText = info.selectionText;
        if (selectedText) {
            chrome.storage.local.get("linkedList", (data) => {
                const list = LinkedList.fromArray(data.linkedList || []);
                list.addNode(selectedText);
                chrome.storage.local.set({ linkedList: list.toArray() }); 
            });
        }
    }
});