function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if (guess < 1 || guess > 100 || typeof guess !== 'number') {
        throw "That is an invalid guess.";
    }
    else {
        this.playersGuess = guess;
        return this.checkGuess(this.playersGuess);
    }
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess == this.winningNumber) {
        return "You Win!";
    }
    else if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
        return "You've already guessed that number.";
    }    
    this.pastGuesses.push(this.playersGuess);
    if (this.pastGuesses.length >= 5) {
        return "Game Over";
    }    
    var difference = this.difference();
    switch (true) {
        case difference < 10:
            return "You're burning up!";
        case difference < 25:
            return "You're getting warmer.";
        case difference < 50:
            return "You're getting colder.";
        case difference < 100:
            return "You're ice cold!" 
    }
}

Game.prototype.provideHint = function() {
    var hintArr = [this.winningNumber];
    var numHints = 3;
    for (var i = 1; i < numHints; ++i) {
        hintArr.push(generateWinningNumber());
    }
    return shuffle(hintArr);
}

function newGame() {
    return new Game();
}

function generateWinningNumber() {
    return Math.floor(Math.random() * (101-1) + 1);
}

function shuffle(cards) {
    var cardsLeft = cards.length;
    var temp, swap;
    while (cardsLeft) {
        swap = Math.floor(Math.random() * cardsLeft--);
        temp = cards[cardsLeft];
        cards[cardsLeft] = cards[swap];
        cards[swap] = temp;
    }
    return cards;
}

$(document).ready( function() {
    var game = newGame();

    var submitGuess = function() {
        var guess = +$("#player-input").val();
        $("#player-input").val('');
        if (!Number.isNaN(guess)) {
            result = game.playersGuessSubmission(guess);
            $(".title").text(result);
            if (result !== "You've already guessed that number.") {
                addToList(guess);
            }
            if (result == "You Win!") {
                disableButtons(true);
                $(".subtitle").text("Click Reset to play again!");
                $("#player-input").prop('placeholder', game.winningNumber);
            }
            else if (result == "Game Over") {
                disableButtons(true);
                $(".subtitle").text("The winning number was: " + game.winningNumber);
                $(".subtitle").append("<br><br>Click Reset to play again!");
                $("#player-input").prop('placeholder', 'X');  
            } 
            else {
                game.isLower() ? $(".subtitle").text("Guess Higher!") : $(".subtitle").text("Guess Lower!");
            }  
        }
    }

    var addToList = function(value) {
        var guesses = $("#guess-list").children();
        var guessesLeft = jQuery.grep(guesses, function(guess,index) {
            return $(guess).text() === '-';
        });
        $(guessesLeft[0]).text(value);    
    }

    var disableButtons = function(w) {
        $("#submit").prop("disabled", w);
        $("#hint").prop("disabled", w);
        $("#player-input").prop("disabled", w);
    }  

    $('#reset').on('click', function() {
        game = newGame();
        $(".title").text("Guessing Game");
        $(".subtitle").text("Guess a number from 1 to 100!");
        $("#player-input").prop('placeholder', '?')        
        disableButtons(false);
        $("#guess-list").children().map(function() {
            $(this).text('-');
        });
        $("#player-input").focus();
    });

    $("#hint").on('click', function() {
        var hints = game.provideHint();
        $(".subtitle").text("The winning number is " + hints[0] + ", " + hints[1] + ", " + "or " + hints[2]);
        $("#hint").prop("disabled", true);
        $("#player-input").focus();
    });

    $('#submit').on('click', function(event) {
        event.preventDefault();
        $("#player-input").focus();
        submitGuess();
    });

    $(this).on('keydown', function(event) {
        if (event.which == '13') {
            submitGuess();
            $("#player-input").focus();
        } 
    })
});