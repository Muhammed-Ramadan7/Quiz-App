// https://opentdb.com/api.php?amount=10&category=24&difficulty=easy&type=multiple
let form = document.querySelector("#quizOptions");
let categoryMenu = document.querySelector("#categoryMenu");
let difficultyOptions = document.querySelector("#difficultyOptions");
let questionsNumber = document.querySelector("#questionsNumber");
let mainBTn = document.querySelector("#startQuiz");
let myRow = document.querySelector("#row");

let questions;
let myQuiz;

mainBTn.addEventListener("click", async function () {
    let category = categoryMenu.value;
    let difficulty = difficultyOptions.value;
    let numbers = questionsNumber.value;

    myQuiz = new Quiz(category, difficulty, numbers);
    questions = await myQuiz.getAllQuestion();

    let myQuestions = new AllQuestions(0);
    form.classList.replace("d-flex", "d-none");
    myQuestions.display();
});

class Quiz {
constructor(category, difficulty, numbers) {
    this.category = category;
    this.difficulty = difficulty;
    this.numbers = numbers;
    this.score = 0;
}

getApi() {
    return `https://opentdb.com/api.php?amount=${this.numbers}&category=${this.category}&difficulty=${this.difficulty}`;
}

async getAllQuestion() {
    let responce = await fetch(this.getApi());
    let data = await responce.json();
    return data.results;
}
showResult() {
    return `
    <div
        class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
    >
        <h2 class="mb-0">
        ${
        this.score == this.numbers
            ? `Congratulations 🎉`
            : `Your score is ${this.score}`
        }      
        </h2>
        <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
    </div>
    `;
}
}

class AllQuestions {
    constructor(index) {
    this.index = index;
    this.question = questions[index].question;
    this.difficulty = questions[index].difficulty;
    this.correct_answer = questions[index].correct_answer;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.category = questions[index].category;
    this.myAllAnswers = this.geetAllQuestion();
    this.isAnswer= false;
}

    geetAllQuestion() {
    let AllAnswers = [...this.incorrect_answers, this.correct_answer];
    AllAnswers.sort();
    return AllAnswers;
}
checkAnswer(choice){
    if(!this.isAnswer){
        this.isAnswer=true;
        if (choice.innerHTML.trim() === this.correct_answer) {
            choice.classList.add('correct', 'animate__animated', 'animate__pulse')
            myQuiz.score++;
        }else{
            choice.classList.add('wrong', 'animate__animated', 'animate__shakeX')
        }
    }
}


nextQustion(){
    this.index++;
    setTimeout( ()=> {
        if (this.index < questions.length) {
            let myNewQuestion = new AllQuestions(this.index);
        myNewQuestion.display()
        }else{
            let result = myQuiz.showResult();
            myRow.innerHTML = result; 

            document.querySelector('.again').addEventListener('click', ()=>{
                window.location.reload();
            })
        }
    }, 1500  )
}


display() {
    const questionMarkUp = `
        <div
            class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
        >
            <div class="w-100 d-flex justify-content-between">
            <span class="btn btn-category">${this.category}</span>
            <span class="fs-6 btn btn-questions">${this.index + 1} of ${questions.length} Questions</span>
            </div>
            <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
            <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
            ${this.myAllAnswers
            .map((answer) => `<li>${answer}</li>`)
            .toString()
            .replaceAll(",", "")}
            </ul>
            <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${myQuiz.score}</h2>        
        </div>
        `;

        myRow.innerHTML = questionMarkUp;

        const choicesElements = document.querySelectorAll("ul li");
        for (let i = 0; i < choicesElements.length; i++) {
        choicesElements[i].addEventListener("click", () => {
            this.checkAnswer(choicesElements[i]);
            this.nextQustion()
            // this.animateQuestion(choicesElements[i], 1000);
    
        });
        }
}


}
