// ==============================
// EduBoost Quiz System
// ==============================

const quiz = [
    {
        question: "How many roots does a quadratic equation have?",
        answers: [
            "One",
            "Two",
            "Three",
            "Four"
        ],
        correct: 1
    },
    {
        question: "What is the value of π (pi) approximately?",
        answers: [
            "2.14",
            "3.14",
            "4.13",
            "5.14"
        ],
        correct: 1
    },
    {
        question: "Which of these is a prime number?",
        answers: [
            "9",
            "12",
            "17",
            "21"
        ],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const questionCounter = document.getElementById("questionCounter");

function loadQuestion() {

    const q = quiz[currentQuestion];

    questionCounter.textContent =
        `Question ${currentQuestion + 1} of ${quiz.length}`;

    questionText.textContent = q.question;

    answersContainer.innerHTML = "";

    q.answers.forEach((answer, index) => {

        answersContainer.innerHTML += `
            <button class="answer-btn" data-index="${index}">
                ${answer}
            </button>
        `;

    });

    document.querySelectorAll(".answer-btn").forEach(button => {

        button.addEventListener("click", checkAnswer);

    });

}

function checkAnswer(e){

    const selected = Number(e.target.dataset.index);

    if(selected === quiz[currentQuestion].correct){

        score++;

        e.target.classList.add("correct");

    }else{

        e.target.classList.add("wrong");

    }

    document.querySelectorAll(".answer-btn").forEach(btn=>{

        btn.disabled = true;

    });

}

document.getElementById("nextQuestion").addEventListener("click",()=>{

    currentQuestion++;

    if(currentQuestion < quiz.length){

        loadQuestion();

    }else{

        showResult();

    }

});

function showResult(){

    document.querySelector(".quiz-card").innerHTML = `

        <h1>🎉 Quiz Completed</h1>

        <h2>Your Score</h2>

        <h1>${score} / ${quiz.length}</h1>

        <button onclick="window.location.href='student-dashboard.html'">

            Back to Dashboard

        </button>

    `;

    document.querySelector(".quiz-navigation").style.display = "none";

}

loadQuestion();