/*
 * Create a list that holds all of your cards
 */
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const doc = this.document; //access to the document
let deck = doc.getElementsByClassName("deck"); //acess to the element identified by the class deck
let scorePanel = document.getElementsByClassName("score-panel")[0]; //acess to the element identified by the class score-panel
let winningModal = document.getElementsByClassName("winning-modal")[0]; //acess to the element identified by the class winning-modal
let cardDeck = doc.getElementsByClassName("card"); //acess to the element identified by the class card
let deckOfCards = []; //an array that holds all the cards
let restartButton = doc.getElementsByClassName("fa-repeat")[0]; //acess to the element identified by the class fa-repeat for the refresh button
let openCards = []; //empty list of the opened cards
let movesElement = doc.getElementsByClassName("moves")[0]; //element for the number of moves
let stars = doc.getElementsByClassName("fa-star"); //element for the number of stars
let emptiedStars = []; //array that holds the stars obtained during the game
let timer = 0; //timer for the time spent in the game
let score = 0; //final score, this means number of moves
let interval = undefined; //interval , value returned by the set interval
let winningScore = doc.getElementsByClassName("winning-score")[0]; //element for showing the winning score
let replayButton = doc.getElementsByClassName("play-again")[0]; //replay button from the winning modal
let starsWon = 3; //number of stars you still have , 3 at the beginning

/* function used for incrementing the score in case of a correct move */
function incrementMoveCounter() {
    score++;
}

/* this function is used to start the timer in the game and sets the update time of the timer , to 500 miliseconds */
function starTimer() {
    interval = this.setInterval(function() {
            ++timer;
            movesElement.innerHTML = "Time since start: " + this.toHHMMSS(timer / 2) + " | " + score;
        },
        500);
}

/* function to reset the game */
function resetGame() {
	//remove the classes which have the cards opened
    for (card of deckOfCards) {
        card.classList.remove("open");
        card.classList.remove("match");
        card.classList.remove("show");
        card.classList.remove("no-match");
    }

	//remove all the cards from the deck . This means from the deck element
    while (cardDeck.length > 0) {
        cardDeck[0].remove();
    }
	
	//shuffle the cards
    deckOfCards = shuffle(deckOfCards);
	
	//re-add the cards in the deck element
    for (card of deckOfCards) {
        deck[0].appendChild(card);
    }

	//empty the cards array
    openCards = [];
	//reset score
    score = 0;
	//reset the timer
    timer = 0;

	//re-add the "full" body stars and remove the empty stars
    for (star of emptiedStars) {
        star.classList.add("fa-star");
        star.classList.remove("fa-star-o");
    }
	
	//re-start the timer
    starTimer();

	//set the opacity for showing or hidding the elements , and set the index to make the elements go front or in the back.
    winningModal.style.opacity = 0;
    deck[0].style.opacity = 1;
    winningModal.style.zIndex = -1;
    deck[0].style.zIndex = 1;
    scorePanel.style.opacity = 1;
    scorePanel.style.zIndex = -1;
	
	//reset the stars
	starsWon = 3;
}

function matchCards(card1, card2) {
	//if the cards match, then remove all the other classes and add only the match class
    card1.classList.remove("show", "before-match", "before-match2");
    card2.classList.remove("show", "before-match", "before-match2");
    card1.classList.add("match");
    card2.classList.add("match");
}

function lockCards(card1, card2) {
	//if the cards do not match, then remove all the other classes and allow the user to see the transition by setting a delay
    setTimeout(function() {

        card1.classList.remove("open", "show", "before-no-match1", "before-no-match2", "before-no-match3", "before-no-match4", "no-match");
        card2.classList.remove("open", "show", "before-no-match1", "before-no-match2", "before-no-match3", "before-no-match4", "no-match");
    }, 500);
}

function displayWinningMessage() {
	//set the opacity for showing or hidding the elements , and set the index to make the elements go front or in the back.
    winningModal.style.opacity = 1;
    deck[0].style.opacity = 0;
    winningModal.style.zIndex = 1;
    deck[0].style.zIndex = -1;
    scorePanel.style.opacity = 0;
    scorePanel.style.zIndex = -1;

	//show the winning modal , by using a fade transition
    winningModal.classList.add("winning-modal-transition");
	//display a message
    winningScore.innerText = "Yippppeeee! You won with " + score + " moves and you won " + starsWon + " stars!\nYou finished the game in " + this.toHHMMSS(timer) + " hours";

	//stop the timer
    clearInterval(interval);
}

function updateStars() {
	//update the stars , the empty stars show how you managed in the game
    if (12 < score && score < 16) {
        emptiedStars[0].classList.add("fa-star-o");
        emptiedStars[0].classList.remove("fa-star");
		starsWon = 2;
    } else if (16 <= score && score < 20) {
        emptiedStars[1].classList.add("fa-star-o");
        emptiedStars[1].classList.remove("fa-star");
		starsWon = 1;
    } else if (20 <= score) {
        emptiedStars[2].classList.add("fa-star-o");
        emptiedStars[2].classList.remove("fa-star");
		starsWon = 0;
    }
}

function updateOpenCards(card) {
	//push the opened card in the array
    openCards.push(card);
    if ((openCards.length > 1) && (openCards.length % 2 === 0)) {
		// if you have at least two cards and if you have an even number, increment the moves
        incrementMoveCounter();
		
		//if two adiacent cards match, then do something with them !! I add them in an array. Add the classes to display them nicely
        if (openCards[openCards.length - 2].childNodes[1].classList.value === openCards[openCards.length - 1].childNodes[1].classList.value) {
            openCards[openCards.length - 1].classList.add("before-match", "before-match2");
            openCards[openCards.length - 2].classList.add("before-match", "before-match2");
			
			//set a timeout for the user to be able to see the transitions , and then call the match cards
            setTimeout(function() {
                matchCards(openCards[openCards.length - 1], openCards[openCards.length - 2]);
            }, 200);
			
			//if you turned over all the cards, then the game is yours !! But I let a delay
            if (openCards.length == 16) {
                setTimeout(function() {
                    displayWinningMessage();
                }, 500);
            }
        } else {
			//if the cards do not match, change the classes and set timeouts for the user to be able to see the transitions
            updateStars();
            openCards[openCards.length - 1].classList.add("no-match", "before-no-match1");
            openCards[openCards.length - 2].classList.add("no-match", "before-no-match1");
            setTimeout(function() {
                openCards[openCards.length - 1].classList.add("before-no-match2");
                openCards[openCards.length - 2].classList.add("before-no-match2");
            }, 100);
            setTimeout(function() {
                openCards[openCards.length - 1].classList.add("before-no-match3");
                openCards[openCards.length - 2].classList.add("before-no-match3");
            }, 100);
            setTimeout(function() {
                openCards[openCards.length - 1].classList.add("before-no-match4");
                openCards[openCards.length - 2].classList.add("before-no-match4");
            }, 200);
            setTimeout(function() {
                lockCards(openCards[openCards.length - 1], openCards[openCards.length - 2]);
                openCards.pop();
                openCards.pop();
            }, 200);
        }
    }
}

/* add listener to the restart button */
restartButton.onclick = function() {
    resetGame();
}

/* add listener to the re-play button */
replayButton.onclick = function() {
    resetGame();
}

/* function for the listener of the click event on a card */
function changeCardAppearance(card) {
    if (card.classList.contains("show") || card.classList.contains("match")) {
        // do nothing in case the cards are not opened
    } else {
		//add at least an open and a show so that the player can see them
        card.classList.add("open", "show");
        updateOpenCards(card);
    }
}

/* create the deck from the static version*/
function makeDeck() {
    //reset the table
    for (card of cardDeck) {
        card.classList.remove("open");
        card.classList.remove("match");
        card.classList.remove("show");
        card.onclick = function(item) {
            changeCardAppearance(this);
        };
        deckOfCards.push(card);
    }

	//remove the cards from the deck 
    while (cardDeck.length > 0) {
        cardDeck[0].remove();
    }

	//shuffle them
    deckOfCards = shuffle(deckOfCards);
	
	//re-apend them to the deck
    for (card of deckOfCards) {
        deck[0].appendChild(card);
    }

	//reset the timer
    movesElement.innerHTML = "Time since start: " + this.toHHMMSS(timer) + " | " + score;

	//add the stars elements in an array
    emptiedStars.push(stars[2]);
    emptiedStars.push(stars[1]);
    emptiedStars.push(stars[0]);
	//start the timer
    starTimer();
}

/* function taken from Internet to format the time since start */
function toHHMMSS(plainString) {
    var sec_num = parseInt(plainString, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

makeDeck();