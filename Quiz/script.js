// ---------- Firebase SDK ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

// ---------- Firebase Config ----------
const firebaseConfig = {
  apiKey: "AIzaSyB3N-YewiI45dTa5bpl7Jqcu4enLYzIm5k",
  authDomain: "quiz-app-4ac5f.firebaseapp.com",
  databaseURL: "https://quiz-app-4ac5f-default-rtdb.firebaseio.com",
  projectId: "quiz-app-4ac5f",
  storageBucket: "quiz-app-4ac5f.firebasestorage.app",
  messagingSenderId: "293974315855",
  appId: "1:293974315855:web:3f3ab9c08df8b8fff5eb3a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ---------- Quiz Questions ----------
const questions = [
  {
    question: "Q1.What causes an EarthQuake?",
    answers: [
      { text: "Volcanic Erruptions", correct: false },
      { text: "Shifting of tectonic plates", correct: true },
      { text: "loud noises underground", correct: false },
      { text: "heavy raimnfall", correct: false }
    ]
  },
  {
    question: "Q2. Earthquakes are measured using which scale?",
    answers: [
      { text: "Richter scale", correct: false },
      { text: "Celsius scale", correct: true },
      { text: " Barometer", correct: false },
      { text: "Mercalli meter", correct: false }
    ]
  },
  {
    question: "Q3. Which of the following should be in an earthquake emergency kit?",
    answers: [
      { text: "Candles ", correct: false },
      { text: "First aid kit ", correct: true },
      { text: "Empty bottle ", correct: false },
      { text: "pencil ", correct: false }
    ]
  },
  {
    question: "Q4. True or False: You should run outside during an earthquake.",
    answers: [
      { text: "True", correct:false },
      { text: "False", correct:true }
    ]
  },
    {
    question: "Q5. When preparing for an earthquake, where should you store your emergency kit? ",
    answers: [
      { text: "In the attic ", correct: false },
      { text: "In a hard-to-reach cabinet ", correct: false },
      { text: "In an easily accessible spot near an exit ", correct: true },
      { text: "In the garage under boxes ", correct: false }
    ]
  },
  {
    question: "Q6. During an earthquake, what is the safest immediate action? ",
    answers: [
      { text: "Run outside quickly", correct: false },
      { text: "Stand in a doorway", correct: false },
      { text: "Drop, Cover, and Hold On", correct: true },
      { text: "Call emergency services immediately", correct: false }
    ]
  },
  {
   question: "Q7. During an earthquake, what is the safest immediate action? ",
    answers: [
      { text: "Run outside quickly", correct: false },
      { text: "Stand in a doorway", correct: false },
      { text: "Drop, Cover, and Hold On", correct: true },
      { text: "Call emergency services immediately", correct: false }
    ]
  },
  {
    question: "Q8. After the shaking stops, what should you do first if you’re indoors? You’ve been under a sturdy table during the quake. The shaking stops. What do you do next?",
    answers: [
      { text: "Immediately turn on the gas to check appliances", correct: false },
      { text: "Exit the building carefully, watching for falling debris", correct: true },
      { text: "Start cleaning up broken glass", correct: false },
      { text: "Use elevators to leave the building quickly", correct: false }
    ]
  },
  {
    question: "Q9. You find someone injured and unconscious after an earthquake. What is your first action?  ",
    answers: [
      { text: "Move them immediately", correct: false },
      { text: "Check surroundings for safety", correct: true },
      { text: "Give them water", correct: false },
      { text: "Leave them to get help", correct: false }
    ]
  },
   {
    question: "Q10. After evacuating a building post-earthquake, what is the safest place to gather?  ",
    answers: [
      { text: "Near the building entrance", correct: false },
      { text: "In an open area away from buildings, trees, and power lines", correct: true },
      { text: "Under a large tree for shade", correct: false },
      { text: "Inside your car in the parking lot", correct: false }
    ]
  },
  {
   question: "Q5. Match the items to their preparedness use.\n1. Flashlight           →   A. Prevents injury from falling objects. \n 2. Whistle              →   B. Signal for help if trapped.\n 3. Furniture anchors    →   C. Light source during blackout",
    
      answers: [
        { text: "1 → C , 2 → B , 3 → A", correct: true },
        { text: "1 → A , 2 → B , 3 → C", correct: false },
        { text: "1 → B , 2 → A , 3 → C", correct: false },
        { text: "1 → C , 2 → A , 3 → B", correct: false }
      ]
    },
];

// ---------- DOM Elements ----------
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const quizBox = document.getElementById("quiz-box");
const scoreText = document.getElementById("score");
const saveBtn = document.getElementById("save-score");
const leaderboardList = document.getElementById("leaderboard");
const restartBtn = document.getElementById("restart-btn");
const playerNameInput = document.getElementById("player-name");

// ---------- State ----------
let currentQuestionIndex = 0;
let score = 0;

// ---------- Quiz Functions ----------
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next ➡";
  quizBox.classList.remove("hidden");
  resultBox.classList.add("hidden");
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer.text;
    btn.classList.add("answer-btn");
    if (answer.correct) btn.dataset.correct = "true";
    btn.addEventListener("click", selectAnswer);

    const li = document.createElement("li");
    li.appendChild(btn);
    answerButtons.appendChild(li);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("wrong");
  }

  Array.from(answerButtons.children).forEach(li => {
    const btn = li.firstChild;
    if (btn.dataset.correct === "true") btn.classList.add("correct");
    btn.disabled = true;
  });

  nextButton.style.display = "block";
}

function showScore() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreText.textContent = `You scored ${score} out of ${questions.length} ✨`;
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

// ---------- Button Events ----------
nextButton.addEventListener("click", () => {
  if (nextButton.innerText === "Next ➡") {
    handleNextButton();
  } else {
    startQuiz();
  }
});

restartBtn.addEventListener("click", startQuiz);

// ---------- Leaderboard ----------
saveBtn.addEventListener("click", async () => {
  const name = (playerNameInput.value || "Anonymous").trim();
  if (name.length === 0) {
    alert("Enter a name or leave blank for Anonymous");
    return;
  }

  const playerRef = ref(db, "leaderboard");
  await push(playerRef, { name, score });
  playerNameInput.value = "";
});

// Realtime leaderboard
function loadLeaderboard() {
  const playerRef = ref(db, "leaderboard");
  onValue(playerRef, (snapshot) => {
    const data = snapshot.val();
    leaderboardList.innerHTML = "";
    if (!data) return;

    const players = Object.values(data);
    players.sort((a, b) => b.score - a.score);

    players.slice(0, 10).forEach((p, idx) => {
      const li = document.createElement("li");
      li.textContent = `${idx + 1}. ${p.name}: ${p.score}`;
      leaderboardList.appendChild(li);
    });
  });
}

// ---------- Start Quiz ----------
startQuiz();
loadLeaderboard();
