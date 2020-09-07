importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs")
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder")
console.log("Worker is running!")

var USEmodel;
// Load the model.
use.loadQnA().then(model => {
    USEmodel = model
    console.log("Model is Loaded")
    self.postMessage("MODEL_LOADED");
});


self.addEventListener('message', function(e) {
    var question = e.data;
    console.log("Worker: ", question)
    let answer = askQuestion(question)
    self.postMessage(answer);
})

const input = {
    // queries: ['How are you feeling today?', 'What is captial of China?'],
    queries: [],
    responses: [
        'I live in Haifa, in Bat Galim where the beach is just 100 meter away. 🏖',
        "Full-Stack Web Developer: NodeJS, JS, HTML, CSS, Angular, React. DB: NoSQL (MongoDB), SQL (PostgreSQL, PostgreGIS).",
        "<b>My employment history:</b><br/>" +
        "<b>CTO & Co-Founder at Quali.fit</b>, a SaaS startup I founded 4.5 years ago. <br/>" +
        "<b>Software Team Lead at Microsoft</b>, where I worked for 3 years since 2013, working on Excel integration to PowerBI.<br/>" +
        "<b>Executive Director at BizTec</b>, while a student at the Technion I led BizTEC, The National Student Entrepreneurship Competition.<br/>" +
        "Before that I served as Naval Officer for 6.5 years.",
        "Quali.fit is a revolutionary SaaS startup that transforms recruiting firms, increases their productivity and client satisfaction by automating manual processes and providing exceptional candidate experience. Among its customers are some of the world’s leading recruiting firms.",
        "I hold a " +
        "BSc in Computer Engineering from the Technion-Israel Institute of Technology, Electrical Engineering Faculty.<br/>" +
        "an MBA from Northwestern University – Kellogg School of Management,<br/>" +
        "and recently I completed  Data Science Training in Yandex School of Data Science, Y-DATA Program.",
        "<b>Some achievements which I'm super proud of are:</b><br/>" +
        "In 2017, my team and I won 1st place and the SmartPort prize for most innovative idea at the World Port Hackathon 2017, Rotterdam, The Netherlands <br/>" +
        "In 2007, I received Commendation of Excellence from the Commander-in-Chief of the Israeli Navy.",
        "<b>Volunteering Experience</b> <br/>" +
        "<b>Mentor and Advisor | Migdalor Alumni Association</b><br/>" +
        "• Mentored and helped ultra-orthodox Jews integrate into the hi-tech ecosystem.<br/>" +
        "• Consulted and took part in a task force that was created to support Naval Academy alumni during the Covid19 pandemic.<br/>" +
        "<b>Mentor and Judge | Unistream</b><br/>" +
        "• Taught workshops on various topics such as out-of-the-box thinking and lean startup methodology.\n" +
        "• Participated in multiple judging and mentoring events, helped teams formalize their pitch and startup ideas.",
        "Skiing, diving, running, listening to podcasts, audiobooks, and taking online classes",
        "Would love to share my full resume. Just send me an email to kobibarac @ gmail . com, and I'll get back to you."
    ]
};


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
            console.log(score, " ; ", input['queries'][i], " ; ", input['responses'][j])

            if (score > highestScore) {
                highestScore = score
                highestScoreIndex = j
            }
            console.log(score, " ; ", input['queries'][i], " ; ", input['responses'][j])
            scores.push(score);
        }
    }
    return input.responses[highestScoreIndex];
}
