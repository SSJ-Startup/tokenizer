const formatInput = (input) => {
    let separator = '\u2581'

    let normalizedInput = input.normalize('NFKC')

    return separator + normalizedInput.replace(/ /g, separator)
}

/**
 * separates the characters of a string into an array
 * @param input string input to be separated
*/ 
const stringToChars = (input) => {
    return input.split('')
}

/**
 * first six entries in the vocabulary are reserved for special symbols
 * vocabulary: https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/vocab.json 
*/
const reservedSymbolsCount = 6

class Tokenizer {
    constructor(vocabulary) {
        this.vocabulary = vocabulary
        this.trie = new Trie()

        for (let i = reservedSymbolsCount; i < this.vocabulary.length; i++) {
            let word = this.vocabulary[i][0]
            let score = this.vocabulary[i][1]
            let index = i

            this.trie.insert(word, score, index)
        }
    }

    encode(input) {
        let processedInput = stringToChars(formatInput(input))

        // still need to figure out better, descriptive names for these arrays

        const nodes = [] // array of {number: array of scores}
        const words = [] // array of numbers
        const best = [] // array of numbers

        //  pushes placeholders into the "nodes", "words", and "best" arrays
        for (let i = 0; i <= processedInput.length; i++) {
            nodes.push({})
            words.push(0)
            best.push(0)
        }

        for (let i = 0; i < processedInput.length; i++) {
            let output = this.trie.commonPrefixSearch(processedInput.slice(i))

            for (let j = 0; j < output.length; j++) {
                let piece = output[j]
                let obj = {key: piece[0], score: piece[1], index: piece[2]}
                let endPosition = piece[0].length

                if (nodes[i + endPosition][i] == null) {
                    nodes[i + endPosition][i] = []
                }

                nodes[i + endPosition][i].push(obj)
            }
        }

        for (let end = 0; end <= processedInput.length; end++) {
            for (let start in nodes[end]) {
                let arr = nodes[end][start]

                for (let k = 0; k < arr.length; k++) {
                    let word = arr[k]
                    let score = word.score + best[end - word.key.length]

                    if (best[end] === 0 || score >= best[end]) {
                        best[end] = score;
                        words[end] = arr[k].index
                    }
                }
            }
        }

        let results = []

        let iter = words.length - 1;
        while (iter > 0) {
            results.push(words[iter])
            iter -= this.vocabulary[words[iter]][0].length
        }

        let merged = []
        let isPreviousUnk = false
        for (let i = 0; i < results.length; i++) {
            let id = results[i]
            if (!(isPreviousUnk && id === 0)) {
                merged.push(id)
            }

            isPreviousUnk = id === 0
        }

        return merged.reverse()

    }
}