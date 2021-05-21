class CowsBulls {
    constructor() {
    }

    guess(uniqueWords) {
        let randomNo = Math.floor(Math.random() * (uniqueWords.length - 1));
        this._guessWord = (uniqueWords[randomNo]).toUpperCase();
    }

    get guessWord() {
        return this._guessWord;
    }

    calc(word) {
        let cows = 0;
        let bulls = 0;
        let wordlen = word.length;

        word = word.toUpperCase();

        if(this._guessWord === word) {
            bulls = wordlen;
        } else {
            for (var i = 0; i < wordlen; i++) {
                let wordletter = word.charAt(i);
                let guessletter = this._guessWord.charAt(i);

                if(guessletter === wordletter) {
                    bulls++;
                } else {
                    if(this._guessWord.indexOf(wordletter) !== -1) {
                        cows++;
                    }
                }
            }
        }

        return [cows, bulls];
    }
}