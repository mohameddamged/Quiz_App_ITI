class Question{
    constructor(text,correctAnswer,grade,type = "text"){
        this.text = text;
        this.correctAnswer = correctAnswer;
        this.grade = grade;
        this.type = type;
        this.userAnswer = "";
    }
    setUserAnswer(answer){
        this.userAnswer = answer.toLowerCase().trim();
    }
    isCorrect(){
        return this.userAnswer === this.correctAnswer.toLowerCase().trim()
    }
}

class Quiz{
    constructor(questions){
        this.questions = questions;
        this.currentIndex = 0;
    }
    getCurrentQuestion(){
        return this.questions[this.currentIndex];
    }
    next(){
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
        }
    }
    prev(){
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }
    answerCurrentQuestion(answer) {
        this.getCurrentQuestion().setUserAnswer(answer);
    }
    calculateScore(){
        let score = 0;
        this.questions.forEach(question => {
            if(question.isCorrect()){
                score += question.grade;
            }
        });
        return score;
    }
    reset() {
        this.currentIndex = 0;
        this.questions.forEach(q => q.userAnswer = "");
    }
    isFinished() {
        return this.currentIndex === this.questions.length - 1;
    }
}

class UI {
    constructor(quiz){
        this.quiz = quiz;
        //elements
        this.container = document.querySelector(".container");
        this.questionContainer = document.querySelector(".Question-container");
        this.questionText = document.querySelector(".question");
        this.counter = document.querySelector(".question-counter");
        this.input = document.getElementById("answer-input");
        this.nextBtn = document.getElementById("next-btn");
        this.prevBtn = document.getElementById("prev-btn");
        this.finishBtn = document.querySelector(".finish-btn");
        this.restartBtn = document.getElementById("restart-btn");
        this.resultSection = document.getElementById("result-section");
        this.resultText = document.getElementById("result");

        this.addEvents();
        this.render();
    }
    addEvents() {
        this.nextBtn.addEventListener("click", () => {
            this.saveAnswer();
            this.quiz.next();
            this.render();
        });

        this.prevBtn.addEventListener("click", () => {
            this.saveAnswer();
            this.quiz.prev();
            this.render();
        });

        this.finishBtn.addEventListener("click", () => {
            this.saveAnswer();
            this.showResult();
        });

        this.restartBtn.addEventListener("click", () => {
            this.quiz.reset();
            this.resultSection.style.display = "none";
            this.restartBtn.style.display = "none";
            this.questionContainer.style.display = "block";
            document.querySelector(".btns").style.display = "block";
            this.finishBtn.style.display = "inline-block";
             this.container.style.height = "300px";
            this.render();
        });
    }

    saveAnswer() {
        const answer = this.input.value;
        this.quiz.answerCurrentQuestion(answer);
    }

    render() {
        const q = this.quiz.getCurrentQuestion();

        this.questionText.textContent = `${q.text} (${q.type}) (Grade: ${q.grade})`;
        this.counter.textContent = `Question ${this.quiz.currentIndex + 1} of ${this.quiz.questions.length}`;

        //this.input.style.display = "inline-block";
        this.input.value = q.userAnswer || "";

        this.toggleButtons();
    }

    toggleButtons() {
        this.prevBtn.style.visibility = this.quiz.currentIndex === 0 ? "hidden" : "visible";
        this.nextBtn.style.visibility = this.quiz.currentIndex === this.quiz.questions.length - 1 ? "hidden" : "visible";
    }

    showResult() {
        const score = this.quiz.calculateScore();
        let total = this.quiz.questions.reduce((sum, q) => sum + q.grade, 0);

        this.questionContainer.style.display = "none";
        document.querySelector(".btns").style.display = "none";
        this.finishBtn.style.display = "none";

        this.resultSection.style.display = "block";
        this.restartBtn.style.display = "inline-block";
        this.container.style.height = "490px";

        this.resultText.innerHTML = `
            ${this.quiz.questions.map((q, i) => `
                <p class="${q.isCorrect() ? "correct-text" : "wrong-text"}">
                    Q${i + 1}: ${q.text} 
                    Your Answer: ${q.userAnswer || "No Answer"} 
                    Correct Answer: ${q.correctAnswer} 
                    <span">
                        ${q.isCorrect() ? "Correct✅" : "Wrong❎"}
                    </span>
                </p>
            `).join("")}
            <div class="final-grade">Final Score: ${score} / ${total}</div>
        `;
    }
}


const questions = [
    new Question("Is JavaScript Fun? ", "true", 5, "truefalse"),
    new Question("Write the output of 2 + 2", "4", 5, "text"),
    new Question("Is HTML a programming language? ", "false", 10, "truefalse"),
    new Question("What is the keyword to declare a variable in JS?", "let", 5, "text"),
    new Question("Modules use what keyword?", "import", 15, "text"),
];

const quiz = new Quiz(questions);
const app = new UI(quiz);