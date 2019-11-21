class TrieNode {
    constructor() {
        this.parent = null;
        this.children = {};
        this.end = false;
        this.word = [[], 0, 0];
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word, score, index) {
        let currentNode = this.root;

        for (let i = 0; i < word.length; i++) {
            if (!currentNode.children[word[i]]) {
                currentNode.children[word[i]] = new TrieNode();
                currentNode.children[word[i]].parent = currentNode;
                currentNode.children[word[i]].word[0] = currentNode.word[0].concat(word[i]);
            }

            currentNode = currentNode.children[word[i]]

            if (i === word.length - 1) {
                currentNode.end = true;
                currentNode.word[1] = score;
                currentNode.word[2] = index;
            }
        }
    }

    commonPrefixSearch(symbols) {
        let output = [];

        let currentNode = this.root.children[symbols[0]];

        for (let i = 0; i < symbols.length && currentNode; i++) {
            if (currentNode.end) {
                output.push(currentNode.word);
            }
            
            currentNode = currentNode.children[symbols[i + 1]];
        }

        if (!output.length) {
            output.push([[ss[0]], 0, 0]);
        }

        return output;
    }
}