const input = {
    // queries: ['How are you feeling today?', 'What is captial of China?'],
    queries: [],
    responses: [
        'I live in Haifa, in Bat Galim where the beach is just 100 meter away. 🏖',
        "I hold a BSc. from the Technion and an MBA for Kellogg Business School.",
        "My previous company was Quali.fit which I founded 4 years ago, before that I worked at Microsoft as a team leader."
    ]
};
let spinner = document.getElementById("spinner");
let answer = document.getElementById("answer");


spinner.style.display = 'inline'
var USEmodel;
// Load the model.
use.loadQnA().then(model => {
    USEmodel = model
    spinner.style.display = 'none'
});

// Calculate the dot product of two vector arrays.
const dotProduct = (xs, ys) => {
    const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;

    return xs.length === ys.length ?
        sum(zipWith((a, b) => a * b, xs, ys))
        : undefined;
}

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith =
    (f, xs, ys) => {
        const ny = ys.length;
        return (xs.length <= ny ? xs : xs.slice(0, ny))
            .map((x, i) => f(x, ys[i]));
    }

const askQuestion = (question) => {
    input.queries = [question]
    var scores = [];
    var embeddings = USEmodel.embed(input)

    const embed_query = embeddings['queryEmbedding'].arraySync();
    const embed_responses = embeddings['responseEmbedding'].arraySync();
    // compute the dotProduct of each query and response pair.
    let highestScoreIndex = -1;
    let highestScore = -1;
    for (let i = 0; i < input['queries'].length; i++) {
        for (let j = 0; j < input['responses'].length; j++) {
            var score = dotProduct(embed_query[i], embed_responses[j])
            if (score > highestScore) {
                highestScore = score
                highestScoreIndex = j
            }
            console.log(score, " ; ", input['queries'][i], " ; ", input['responses'][j])
            scores.push(score);
            answer.textContent = input.responses[highestScoreIndex];
            console.log(input.responses[highestScoreIndex])

        }
    }
    console.log(scores)
    spinner.style.display = 'none'

}

// Get the input field
let questionBox = document.getElementById("question_box");

// Execute a function when the user releases a key on the keyboard
questionBox.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    console.log("Key UP")
    if (event.keyCode === 13) {
        spinner.style.display = 'inline'
        setTimeout(()=>{},500)
        // Cancel the default action, if needed
        askQuestion(questionBox.value)
    }
});