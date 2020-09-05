const input = {
    // queries: ['How are you feeling today?', 'What is captial of China?'],
    queries: [],
    responses: [
        'I live in Haifa, in Bat Galim where the beach is just 100 meter away. 🏖',
        "My previous company was Quali.fit which I founded 4 years ago, before that I worked at Microsoft as a team leader.",
        "Full-Stack Web Developer: NodeJS, JS, HTML, CSS, Angular, React. DB: NoSQL (MongoDB), SQL (PostgreSQL, PostgreGIS).",
        "<b>My employment history:</b><br/>" +
        "<b>CTO & Co-Founder at Quali.fit</b>, a SaaS startup I founded 4.5 years ago. <br/>" +
        "<b>Software Team Lead at Microsoft</b>, where I worked for 3 years since 2013, working on Excel integration to PowerBI.<br/>" +
        "<b>Executive Director at BizTec</b>, while a student at the Technion I led BizTEC, The National Student Entrepreneurship Competition.<br/>" +
        "Before that I served as Naval Officer for 6.5 years.",
        "Quali.fit is a revolutionary SaaS startup that transforms recruiting firms, increases their productivity and client satisfaction by automating manual processes and providing exceptional candidate experience. Among its customers are some of the world’s leading recruiting firms.",
        "I hold a " +
        "BSc in Computer Engineering from the Technion-Israel Institute of Technology, Electrical Engineering Faculty.<br/>" +
        "an MBA from Northwestern University – Kellogg School of Management<br/>" +
        "and recently I completed  Data Science Training in Yandex School of Data Science, Y-DATA Program",
        "<b>Some achievements which I'm super proud of are:</b><br/>" +
        "In 2017, my team and I won 1st place and the SmartPort prize for most innovative idea at the World Port Hackathon 2017, Rotterdam, The Netherlands <br/>" +
        "In 2007, I received Commendation of Excellence from the Commander-in-Chief of the Israeli Navy.",
        "<b>Volunteering Experience</b> <br/>" +
        "<b>Mentor and Advisor | Migdalor Alumni Association</b><br/>" +
        "• Mentored and helped ultra-orthodox Jews integrate into the hi-tech ecosystem.<br/>" +
        "• Consulted and took part in a task force that was created to support Naval Academy alumni during the Covid19 pandemic." +
        "<b>Mentor and Judge | Unistream</b><br/>" +
        "• Taught workshops on various topics such as out-of-the-box thinking and lean startup methodology.\n" +
        "• Participated in multiple judging and mentoring events, helped teams formalize their pitch and startup ideas.",
        "Skiing, running, listening to podcasts, audiobooks, and taking online classes"
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
            answer.innerHTML = input.responses[highestScoreIndex];
            console.log(input.responses[highestScoreIndex])

        }
    }
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