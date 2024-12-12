// Quiz domains with background images
const domains = [
  { id: "science", name: "Science", description: "Test your science knowledge", image: "Images/science.jpg" },
  { id: "math", name: "Mathematics", description: "Challenge your math skills", image: "Images/maths.jpg" },
  { id: "history", name: "History", description: "Explore historical events", image: "Images/history.jpg" },
  { id: "tech", name: "Technology", description: "Discover the tech world", image: "Images/tech.webp" },
  { id: "sports", name: "Sports", description: "Test your Sports knowledge", image: "Images/sports.jpg" },
  { id: "current affairs", name: "Current Affairs", description: "Challenge your knowledge of current news", image: "Images/current_affairs.jpg" }
];

// Quiz questions for each domain
const quizzes = {
  science: [
    { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "HO"], answer: "H2O" },
    { question: "What planet is known as the Red Planet?", options: ["Earth", "Mars", "Venus", "Jupiter"], answer: "Mars" }
  ],
  math: [
    { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
    { question: "What is the square root of 16?", options: ["2", "3", "4", "5"], answer: "4" }
  ]
};

// Dynamically load cards with background images
function loadDomainCards() {
  const container = document.getElementById("domain-cards");
  domains.forEach(domain => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.backgroundImage = `url('${domain.image}')`;

    // Add text content to the card
    card.innerHTML = `
      <h3>${domain.name}</h3>
      <p>${domain.description}</p>
    `;

    card.addEventListener("click", () => selectDomain(domain.id));
    container.appendChild(card);
  });
}

// Handle domain selection
function selectDomain(domainId) {
  localStorage.setItem("selectedDomain", domainId);
  window.location.href = "quiz.html";
}

// Load cards on page load (index page)
if (window.location.pathname.includes("index.html")) {
  loadDomainCards();
}

// Quiz page logic
if (window.location.pathname.includes("quiz.html")) {
  const selectedDomain = localStorage.getItem("selectedDomain");
  const domainName = domains.find(domain => domain.id === selectedDomain)?.name || "Unknown Domain";
  document.getElementById("quiz-domain").innerText = `Quiz Domain: ${domainName}`;

  const quiz = quizzes[selectedDomain] || [];
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedAnswers = [];

  // Function to load a question
  function loadQuestion() {
    if (currentQuestionIndex < quiz.length) {
      const question = quiz[currentQuestionIndex];
      const isLastQuestion = currentQuestionIndex === quiz.length - 1;

      document.getElementById("quiz-container").innerHTML = `
        <h3>${question.question}</h3>
        <div class="options">
          ${question.options.map(option => `
            <button class="option" onclick="selectOption(this, '${option}')">${option}</button>
          `).join('')}
        </div>
      `;

      const navButtons = document.querySelector('.nav-buttons');
      if (isLastQuestion) {
        navButtons.innerHTML = `<button id="submit-btn" class="btn" onclick="submitQuiz()">Submit</button>`;
      } else {
        navButtons.innerHTML = `<button id="next-btn" class="btn" onclick="nextQuestion()" disabled>Next</button>`;
      }
    }
  }

  // Function to handle option selection
  window.selectOption = function(button, option) {
    selectedAnswers[currentQuestionIndex] = option;
    const buttons = document.querySelectorAll('.option');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) {
      nextBtn.disabled = false; // Enable Next button after selection
    }
  };

  // Move to the next question
  window.nextQuestion = function() {
    const correctAnswer = quiz[currentQuestionIndex].answer;
    const selectedAnswer = selectedAnswers[currentQuestionIndex];

    if (selectedAnswer === correctAnswer) {
      score++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.length) {
      loadQuestion(); // Load next question
    }
  };

  // Submit the quiz and display score
  window.submitQuiz = function() {
    const correctAnswer = quiz[currentQuestionIndex].answer;
    const selectedAnswer = selectedAnswers[currentQuestionIndex];

    if (selectedAnswer === correctAnswer) {
      score++;
    }

    alert(`Your final score is: ${score}/${quiz.length}`);
    window.location.href = "index.html";
  };

  // Initial question load
  loadQuestion();
}
