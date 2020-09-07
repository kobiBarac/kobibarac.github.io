let questionBox = document.getElementById("question_box");
let spinner = document.getElementById("spinner");
let answer = document.getElementById("answer");

spinner.style.display = 'inline'
questionBox.disabled = true
var worker = new Worker('assets/js/worker.js');


worker.addEventListener('message', function(e) {
    let response = e.data
    switch (response) {
        case "MODEL_LOADED":
            break
        default:
            answer.innerHTML = response;
            console.log("answer: ", response);
            break
    }
    spinner.style.display = 'none'
    questionBox.disabled = false
})

let firstQuestion = true;
// Execute a function when the user releases a key on the keyboard
questionBox.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    console.log("Key UP")
    if (event.keyCode === 13) {
        questionBox.disabled = true

        if (firstQuestion) {
            answer.innerHTML = "This will take just a few seconds...";
            firstQuestion = false
        }
        spinner.style.display = 'inline'
        // Cancel the default action, if needed
        worker.postMessage(questionBox.value)
    }
});