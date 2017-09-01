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
}

function matchCards(card1, card2) {
	card1.classList.remove("show");
	card2.classList.remove("show");
	card1.classList.add("match");
	card2.classList.add("match");
}

function unlockCards(card1, card2) {
	card1.classList.remove("open","show");
	card2.classList.remove("open","show");
}

function updateOpenCards(card) {
	openCards.push(card);
	if((openCards.length > 1) && (openCards.length % 2 === 0)) {
		if(openCards[openCards.length-2].childNodes[1].classList.value === openCards[openCards.length-1].childNodes[1].classList.value) {
			matchCards(openCards[openCards.length-1], openCards[openCards.length-2]);
		}
		
		else {
			unlockCards(openCards[openCards.length-1], openCards[openCards.length-2]);
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
		console.log("opened");
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
