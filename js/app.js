/* Array of card labels (each icon included twice) */
let cards = ["card fa fa-diamond", "card fa fa-diamond", "card fa fa-paper-plane-o", "card fa fa-paper-plane-o", "card fa fa-anchor", "card fa fa-anchor", "card fa fa-bolt", "card fa fa-bolt", "card fa fa-cube", "card fa fa-cube", "card fa fa-leaf", "card fa fa-leaf", "card fa fa-bicycle", "card fa fa-bicycle", "card fa fa-bomb", "card fa fa-bomb"];

/* Global Variables */
let clicks=0;
let rating=undefined;
let score=0;
let moves=0;
let found=0;
let open=[];

/* Shuffle function from http://stackoverflow.com/a/2450976 */
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

/*  
    Funtion that waits for either the reset button to be clicked
    or for the play again button to be clicked                
 */
function reset() {
    $(".restart").on("click", function() {
        location.reload()
    });
    $("#play-button").on("click", function() {
        location.reload()
    });
}

/*
    Function that generates the randomized deck once the page is 
    loaded. Uses the above shuffle function.
*/
function genDeck() {
    let shuffled = shuffle(cards);
    shuffled.forEach(element => {
        /* creates a list item in the deck class for each card */
        $(".deck").append('<li><i class="'+element+'"></i></li>');
    })
}

/*
    Function to wait for a card to be clicked to either flip the card
    or check if the two previous cards match each other and act according
*/
function showCard() {
    /* Listen for a card to be clicked */
    $(".card").click(function() {
        /*
            First check if the card isn't already flipped or that two cards
            aren't already flipped
        */
        if($(this).hasClass("open show") || open.length==2) { return; }

        /* toggle the classes that show the card icon and change the background */
        $(this).toggleClass("open show");

        /* add cards to the open array until it has two items */
        if(open.length<2) {
            open.push($(this));
        }

        /*
            Once there are two cards flipped, check if the two cards have the 
            same icon (same class attribute) and acts accordingly
        */
        if(open.length==2) {
            /* 
                If the cards match, add the match class, incrememt the score,
                and empty the open array (after some delay)
            */
            if(open[0][0].classList[2]==open[1][0].classList[2]) {
                $(open[0]).addClass("match");
                $(open[1]).addClass("match");
                score++;
                setTimeout(emptyOpen, 500);
            }
            /*
                IF the cards don't match, add the wrong class to change the 
                background then reset the classes and empty the open array
                (after some delay)
            */
            else {
                $(open[0]).addClass("wrong");
                $(open[1]).addClass("wrong");
                setTimeout(resetClasses, 500);
                setTimeout(emptyOpen, 500);
            }
            /* Update the guess counter once two cards are clicked */
            updateMoves();
        }
    });
}

/* 
    Function to reset the classes of cards that are 
    incorrect matches
*/
function resetClasses() {
    open.forEach(element => {
        $(element).toggleClass("open show wrong");
    });
}

/* Function to empty the open array */
function emptyOpen() {
    open = [];
}

/*
    Function to update the guess counter (and the call the 
    function to update the rating)
*/
function updateMoves() {
    moves++;
    /* Update the text for the guess-counter element with the new count */
    document.getElementById("guess-counter").innerHTML = `Guesses: ${moves}`;
    updateRating();
}

/*
    Function to update the star rating
    -- Each star corresponds to 10 moves
*/
function updateRating() {
    /*
        First hide each star then show each star for the current number 
        of moves
    */
    $(".fa-star").hide();
    rating=0;
    if(moves<30) {
        $(".fa-star.1").show();
        rating=1;      
    }
    if(moves<25) {
        $(".fa-star.2").show();
        rating=2;
    }
    if(moves<15) {
        $(".fa-star.3").show();
        rating=3;
    }
}

/*
    Function to control the timer that starts once the first card
    is flipped (uses setInterval to update the timer each second)
*/
function updateTimer() {
    $(".card").click(function() {
        if(clicks==0) {
            clicks++;
            let sec=0;
            let interval = setInterval(function() {
                /*
                    check if the player has found all the matches. If so,
                    stop the timer and show the endscreen
                */
                if(score==8) { clearInterval(interval); endscreen(); }
                sec++;
                let sec_str=Math.trunc(sec%60)
                $("#sec").text((sec_str>9) ? sec_str : "0"+sec_str);
                let min_str=Math.trunc(sec/60);
                $("#min").text((min_str>9) ? min_str : "0"+min_str);
            }, 1000);
        }
    });
}

/*
    Function to show the modal (endscreen popup) and show the final 
    rating, number of guesses, and make the final time flash
*/
function endscreen() {
    $("#rating-recap").text(`Rating: ${rating} out of 3`);
    $("#guess-recap").text(`Guesses: ${moves}`);
    $(".modal").toggle(250);
    setInterval(function() {
        $(".timer").toggle();
    }, 250);
}

/* Calling each of the functions that listen for actions */
genDeck();
showCard();
updateTimer();
reset();
