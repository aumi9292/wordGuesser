/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
class Game {
  constructor() {
    this.word = this.chooseWord();

    this.spaces = document.querySelector("#spaces");
    this.guessesEl = document.querySelector("#guesses");
    this.message = document.querySelector("#message");
    this.apples = document.querySelector("#apples");

    this.setUpWord();

    this.win = new Event("win");
    this.spaces.addEventListener("win", e => {
      this.message.innerHTML = "You Won! <a href='#'>Play again?</a>";
      document.body.classList.add("win");
    });

    this.lose = new Event("lose");
    this.spaces.addEventListener("lose", e => {
      this.message.innerHTML = "Sorry, you've run out of guesses! <a href='#'>Play again?</a>";
      document.body.classList.add("lose");
    });
  }

  wordHasLetter(letter) {
    let regex = new RegExp(`${letter}`);
    return regex.test(this.word);
  }

  invalidGuess(guess) {
    return Game.pauseGuessing ||
      guess.length > 1 ||
      /[^a-z]/i.test(guess) ||
      this.guesses.includes(guess);
  }

  displayWord() {
    this.guessedLetters.forEach(letter => {
      let span = document.createElement('SPAN');
      span.textContent = letter;
      document.querySelector("#spaces").appendChild(span);
    });
  }

  adjustSpaces(letter) {
    this.word.split("").map(char => char === letter).forEach((boolean, idx) => {
      if (boolean) {
        this.spaces.children[idx + 1].textContent = letter;
        this.guessedLetters[idx] = letter;
      }
    });
  }

  wasWon() {
    return this.guessedLetters.join('') === this.word.toUpperCase();
  }

  wasLost() {
    return this.amountOfIncorrectGuesses === Game.maxGuesses;
  }

  addIncorrectGuess() {
    this.amountOfIncorrectGuesses += 1;
    this.apples.className = `guess_${this.amountOfIncorrectGuesses}`;
  }

  guessRight(guess) {
    this.adjustSpaces(guess);
    if (this.wasWon()) this.endSequence(this.win);
  }

  guessWrong() {
    this.addIncorrectGuess();
    if (this.wasLost()) this.endSequence(this.lose);
  }

  endSequence(event) {
    this.spaces.dispatchEvent(event);
    Game.pauseGuessing = true;
    this.determineIfGameIsOver();
  }

  gameOver() {
    this.message.textContent = "Those are all the words. Thanks for playing!";
  }

  determineIfGameIsOver() {
    this.word = this.chooseWord();
    if (this.word === undefined) this.gameOver();
  }

  setUpWord() {
    this.guessedLetters = [..." ".repeat(this.word.length)];
    this.amountOfIncorrectGuesses = 0;
    this.guesses = [];
    this.resetDisplay();
    this.displayWord();
  }

  resetDisplay() {
    document.body.className = "";
    this.apples.className = "guess_0";
    this.message.textContent = null;
    Game.pauseGuessing = false;
  }

  clearDisplay() {
    [...this.spaces.children].slice(1).forEach(letter => letter.remove());
    [...this.guessesEl.children].slice(1).forEach(letter => letter.remove());
  }

  addGuess(guess) {
    this.guesses.push(guess);
    let span = document.createElement('SPAN');
    span.textContent = guess;
    this.guessesEl.appendChild(span);
  }

  playNextWord() {
    this.clearDisplay();
    this.setUpWord();
  }

  static maxGuesses = 6
  static pauseGuessing = false;
}

Game.prototype.chooseWord = (function chooseWord() {
  const WORDS = [
    "fifteen",
    "gold",
    "pillow",
    "computer",
    "desk",
    "cartridge",
    "dangerous",
    "cryogenic",
    "inept",
    "dowager",
  ].map(word => word.toUpperCase());

  function generateRandomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  return function() {
    let idx = generateRandomIndex(WORDS.length);
    let chosenWord = WORDS.splice([idx], 1)[0];
    return chosenWord;
  };
})();

document.addEventListener("DOMContentLoaded", () => {

  let game = new Game();

  document.addEventListener("keyup", e => {
    let guess = e.key.toUpperCase();
    if (game.invalidGuess(guess)) return;

    game.addGuess(guess);
    game.wordHasLetter(guess) ? game.guessRight(guess) : game.guessWrong();
  });

  this.message.addEventListener("click", e => {
    if (e.target.nodeName !== 'A') return;
    e.preventDefault();
    game.playNextWord();
  });
});