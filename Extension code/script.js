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

const buttonContainer = document.getElementById('buttonContainer');
const clearButton = document.getElementById('clearButton');

chrome.storage.local.get("linkedList", (data) => {
    const list = LinkedList.fromArray(data.linkedList || []);
    const nodesArray = list.toArray();
    nodesArray.forEach((value) => {
        const button = document.createElement('button');
        button.textContent = value;

        button.onclick = () => {
            navigator.clipboard.writeText(value).then(() => {
                alert('Copied to clipboard: ' + value);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        };

        buttonContainer.appendChild(button);
    });
});

clearButton.onclick = () => {
    chrome.storage.local.set({ linkedList: [] }, () => {
        buttonContainer.innerHTML = ''; // Clear buttons from the container
        alert('List cleared!');
    });
};