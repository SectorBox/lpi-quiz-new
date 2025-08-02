let questions = [];
let currentQuestion = 0;
let score = 0;

fetch('lpi_questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data.sort(() => Math.random() - 0.5);
    showQuestion();
    updateScore();
  });

function updateScore() {
  const percentage = ((score / questions.length) * 100).toFixed(1);
  document.getElementById("score").textContent = `Score: ${percentage}%`;
}

function showQuestion() {
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = "";

  if (currentQuestion >= questions.length) {
    quizDiv.innerHTML = `<h2>Quiz Complete!</h2>
                         <p>Your final score: <strong>${((score / questions.length) * 100).toFixed(1)}%</strong></p>
                         <button onclick="restartQuiz()">Restart Quiz</button>`;
    return;
  }

  const q = questions[currentQuestion];
  const qDiv = document.createElement("div");
  qDiv.classList.add("question");

  const progress = document.createElement("p");
  progress.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  qDiv.appendChild(progress);

  qDiv.innerHTML += `<h3>${q.question}</h3>`;

  q.options.forEach((opt, i) => {
    const optLabel = document.createElement("label");
    optLabel.classList.add("option");
    optLabel.innerHTML = `<input type="checkbox" name="option" value="${opt}"> ${opt}`;
    qDiv.appendChild(optLabel);
  });

  const feedback = document.createElement("div");
  feedback.id = "feedback";
  feedback.style.marginTop = "10px";
  feedback.style.fontWeight = "bold";
  qDiv.appendChild(feedback);

  const btn = document.createElement("button");
  btn.textContent = "Submit";
  btn.onclick = () => checkAnswer(feedback);
  qDiv.appendChild(btn);

  quizDiv.appendChild(qDiv);
}

function checkAnswer(feedback) {
  const selected = Array.from(document.querySelectorAll('input[name="option"]:checked')).map(e => e.value);
  const correct = questions[currentQuestion].answer;

  if (arraysEqual(selected.sort(), correct.sort())) {
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";
    score++;
    updateScore();
  } else {
    feedback.textContent = `❌ Incorrect. Correct answer(s): ${correct.join(", ")}`;
    feedback.style.color = "red";
  }

  currentQuestion++;
  setTimeout(showQuestion, 800);
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
