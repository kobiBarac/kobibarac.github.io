// Add something to given element placeholder
function addToPlaceholder(toAdd, el) {
    el.setAttribute('placeholder', el.getAttribute('placeholder') + toAdd);
    // Delay between symbols "typing"
    return new Promise(resolve => setTimeout(resolve, 100));
}

// Cleare placeholder attribute in given element
function clearPlaceholder(el) {
    el.setAttribute("placeholder", "");
}

// Print one phrase
function printPhrase(phrase, el) {
    return new Promise(resolve => {
        // Clear placeholder before typing next phrase
        clearPlaceholder(el);
        let letters = phrase.split('');
        // For each letter in phrase
        letters.reduce(
            (promise, letter, index) => promise.then(_ => {
                // Resolve promise when all letters are typed
                if (index === letters.length - 1) {
                    // Delay before start next phrase "typing"
                    setTimeout(resolve, 1000);
                }
                return addToPlaceholder(letter, el);
            }),
            Promise.resolve()
        );
    });
}

// Print given phrases to element
function printPhrases(phrases, el) {
    // For each phrase
    // wait for phrase to be typed
    // before start typing next

    phrases.reduce(
        (promise, phrase) => promise.then(_ => printPhrase(phrase, el)),
        Promise.resolve()
    ).then(()=>{
        run()});
}

// Start typing
function run() {
    let phrases = [
        "Where do you live?",
        "What are your hobbies?",
        "Can you share your resume?",
        "What was your role at Quali.fit?",
        "Where do you currently work?",
        "Where do you volunteer?",
    ];

    printPhrases(phrases, document.getElementById("question_box"));
}

run()