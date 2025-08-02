let questions = [];
let currentQuestion = 0;
let score = 0;

fetch('lpi_questions.json')
  .then(res => res.json())
  .then(data => {
    // Shuffle questions
    questions = data.sort(() => Math.random() - 0.5);
    showQuestion();
    updateScore();
  });

function updateScore() {
  document.getElementById("score").textContent = `Score: ${score} / ${questions.length}`;
}

function showQuestion() {
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = "";

  if (currentQuestion >= questions.length) {
    quizDiv.innerHTML = `<h2>Quiz Complete!</h2>
                         <p>Your final score: <strong>${score}</strong> / ${questions.length}</p>
                         <button onclick="restartQuiz()">Restart Quiz</button>`;
    return;
  }

  const q = questions[currentQuestion];
  const qDiv = document.createElement("div");
  qDiv.classList.add("question");

  // Progress
  const progress = document.createElement("p");
  progress.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  qDiv.appendChild(progress);

  // Question text
  qDiv.innerHTML += `<h3>${q.question}</h3>`;

  // Answer options
  q.options.forEach((opt, i) => {
    const optLabel = document.createElement("label");
    optLabel.classList.add("option");
    optLabel.innerHTML = `<input type="checkbox" name="option" value="${opt}"> ${opt}`;
    qDiv.appendChild(optLabel);
  });

  // Submit button
  const btn = document.createElement("button");
  btn.textContent = "Submit";
  btn.onclick = checkAnswer;
  qDiv.appendChild(btn);

  quizDiv.appendChild(qDiv);
}

function checkAnswer() {
  const selected = Array.from(document.querySelectorAll('input[name="option"]:checked')).map(e => e.value);
  const correct = questions[currentQuestion].answer;

  if (arraysEqual(selected.sort(), correct.sort())) {
    alert("✅ Correct!");
    score++;
    updateScore();
  } else {
    alert(`❌ Incorrect.\nCorrect answer(s): ${correct.join(", ")}`);
  }

  currentQuestion++;
  setTimeout(showQuestion, 300); // short delay before next question
}

function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function restartQuiz() {
  score = 0;
  currentQuestion = 0;
  questions = questions.sort(() => Math.random() - 0.5);
  updateScore();
  showQuestion();
}
