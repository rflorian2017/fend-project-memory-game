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
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const doc = this.document;
let deck = doc.getElementsByClassName("deck");
let cardDeck = doc.getElementsByClassName("card");
let deckOfCards = [];
let restartButton = doc.getElementsByClassName("fa-repeat")[0];
let openCards = [];
let movesElement = doc.getElementsByClassName("moves")[0];
let stars = doc.getElementsByClassName("fa-star");
let emptiedStars = [];
let timer = 0;
let score = 0;
let interval = undefined;

function incrementMoveCounter() {
	score++;
}

function starTimer() {
	interval = this.setInterval(function(){ 
		++timer;
		movesElement.innerHTML = "Time since start: " + this.toHHMMSS(timer/2) + " | " + score; 
	}, 
	500);
}

function resetGame() {
	for(card of deckOfCards) {
		card.classList.remove("open");
		card.classList.remove("match");
		card.classList.remove("show");	
	}
	
	while(cardDeck.length > 0){
        cardDeck[0].remove();
    }
	
	deckOfCards = shuffle(deckOfCards);
	for(card of deckOfCards) {
		deck[0].appendChild(card);
	}
	
	openCards = [];
	score = 0;
	timer = 0;
	
	for(star of emptiedStars) {
		star.classList.add("fa-star");
	}
	starTimer();
}

function matchCards(card1, card2) {
	card1.classList.remove("show");
	card2.classList.remove("show");
	card1.classList.add("match");
	card2.classList.add("match");
}

function lockCards(card1, card2) {
	setTimeout(function() {
		
	card1.classList.remove("open","show");
	card2.classList.remove("open","show");
	}, 500);
}

function displayWinningMessage() {
	if (confirm("Yippppeeee! You won with " + score + " moves!\nDo you want to play a new round?") == true) {
		resetGame();
	}
	clearInterval(interval);
}

function updateStars() {
	if(12 < score && score < 16) {
		if(stars.length === 3) 
		stars[2].classList.remove("fa-star");
	}
	else if(16 <= score && score < 20) {
		if(stars.length === 2)
		stars[1].classList.remove("fa-star");
	}
	else if(20 <= score){
		if(stars.length === 1)
		stars[0].classList.remove("fa-star");
	}
}
	
function updateOpenCards(card) {
	openCards.push(card);
	if((openCards.length > 1) && (openCards.length % 2 === 0)) {
		incrementMoveCounter();
		
		if(openCards[openCards.length-2].childNodes[1].classList.value === openCards[openCards.length-1].childNodes[1].classList.value) {
			matchCards(openCards[openCards.length-1], openCards[openCards.length-2]);
			if(openCards.length == 16) {
				setTimeout(function() {displayWinningMessage();}, 500);
			}
		}
		
		else {
			updateStars();
			lockCards(openCards[openCards.length-1], openCards[openCards.length-2]);
			openCards.pop();
			openCards.pop();
		}
	}
}

restartButton.onclick = function() {
	resetGame();
}



function changeCardAppearance(card) {
	if(card.classList.contains("show") || card.classList.contains("match")) 
	{
		// do nothing
	}
	else{ 
		card.classList.add("open","show");
		updateOpenCards(card);
	}
}

function makeDock() {
	//reset the table
	for(card of cardDeck) {
		card.classList.remove("open");
		card.classList.remove("match");
		card.classList.remove("show");
		card.onclick = function(item) {
			changeCardAppearance(this);
		};
		deckOfCards.push(card);		
	}
	
	while(cardDeck.length > 0){
        cardDeck[0].remove();
    }
	
	deckOfCards = shuffle(deckOfCards);
	for(card of deckOfCards) {
		deck[0].appendChild(card);
	}
	
	movesElement.innerHTML = "Time since start: " + this.toHHMMSS(timer) + " | " + score;
	
	emptiedStars.push(stars[2]);
	emptiedStars.push(stars[1]);
	emptiedStars.push(stars[0]);
	starTimer();
}

function toHHMMSS(plainString) {
    var sec_num = parseInt(plainString, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
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
 
 makeDock();
