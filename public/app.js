var cowsbulls = {};
var guessWords = [];
var isStatus = '';
const maxWordCount = 15;

var timer = null;
var sec = 0;
function startTimer() {
    if (timer !== null) return;
    timer = setInterval( function(){
        ++sec;
        let seconds = sec%60;
        let minutes = parseInt(sec/60,10);

        seconds = seconds > 9 ? seconds : "0" + seconds;
        minutes = minutes > 9 ? minutes : "0" + minutes;

        $('.timer').html(minutes+" : "+seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
    sec = 0;
}

function duplicateLetter(word) {
    let text = word.split("");
    return text.some(function(v,i,a) {
        return a.lastIndexOf(v)!=i;
    });
}

$(document).ready(function() {
    Swal.fire({
        imageUrl: 'images/logo.jpeg',
        title: 'Welcome to Cows & Bulls Games !',
        html: '<button id="how-to-play" class="btn btn-warning">How to Play</button>',
        confirmButtonText: 'Start The Game',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        animation: false
    }).then((result) => {
        if (result.value) {
            startGame();
        }
    })
})

 $(document).on('click', '#how-to-play', function(){
    Swal.fire({
        title: 'How to play',
        html:'<div><span>In this game of Bulls and Cows, the system chooses a 5-letter secret word, and you need to guess it. After each guess, the system tells you how many "bulls" and how many "cows" are in your guess, interpreted as:<br /><br />- Each bull indicates a letter in your guess that exactly matches the value and position of a letter in the system secret word.<br /><br />- Each cow indicates a letter in your guess that matches the value of a letter in the system secret word but is in the wrong position.<br /><br />So for example, if the system secret word is WORDS and you guess PLACE, your guess has 0 bulls and 0 cows. However, if you guess WORLD then your guess has 3 bulls and 1 cows.<br /><br />You will be given a series of guesses (max 15) along with the word of bulls and cows in each guess. Your job is to determine the system secret word based on the given information.</span></div>',
        confirmButtonText: 'Start The Game',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        animation: false
    }).then((result) => {
        if (result.value) {
            startGame();
        }
    })
})


function startGame() {
    cowsbulls = new CowsBulls();
    cowsbulls.guess(uniqueWords);
    isStatus = 'play';
    startTimer();
    $('.game-status').text('Playing');
    $('.guess-word').text('XXXXX');
    $('.restart-game').hide();
    $("#submit-word").focus();
    window.scrollTo(0,0);
}

$("#submit-word").on('keyup', function (e) {
    if (e.keyCode == 13) {
        if(isStatus != 'play') {
            Swal.fire({
              type: 'info',
              title: 'Oops...',
              text: 'Game is already completed!',
            });
            return;
        }

        let word = $(this).val();
        word = word.toUpperCase();

        if(word == "" || word.length != 5) {
            Swal.fire({
                type: 'error',
                title: 'Enter your 5 letter word',
                showConfirmButton: false,
                timer: 3000
            })
            return;
        }

        if(guessWords.includes(word)) {
            Swal.fire({
                type: 'info',
                title: 'Word already exits',
                showConfirmButton: false,
                timer: 3000
            })
            return;
        }

        if(duplicateLetter(word)) {
            Swal.fire({
                type: 'error',
                title: 'Some letter is duplicate in word',
                showConfirmButton: false,
                timer: 3000
            })
            return;
        }

        $(this).val('');

        const [cows, bulls] = cowsbulls.calc(word);
        guessWords.push(word);
        assignWordHtml(guessWords.length, word, cows, bulls);

        if(bulls == 5) {
            // wins
            isStatus = 'win';
            stopTimer();
            $('.game-status').text('Won');
            $('.restart-game').show();
            $('.guess-word').text(word);
            $("#submit-word").blur();

            window.scrollTo(0,document.body.scrollHeight);

            Swal.fire({
              title: 'Congrats You Win',
              showConfirmButton: false,
              timer: 3000,
              backdrop: `rgba(0,0,0,0.4) url("images/nyan-cat.gif") center top no-repeat `
            })
        } else {
            if(guessWords.length >= maxWordCount) {
                // lose
                isStatus = 'lose';
                stopTimer();
                $('.game-status').text('Lose');
                $('.restart-game').show();
                $('.guess-word').text(cowsbulls.guessWord);
                $("#submit-word").blur();
                window.scrollTo(0,document.body.scrollHeight);

                Swal.fire({
                  type: 'error',
                  title: 'Oops... You Lose',
                  text: 'Better luck next time',
                  showConfirmButton: false,
                  timer: 3000,
                });
            }
        }
    }
});

function assignWordHtml(count, word, cows, bulls) {

    var wordstring = '';
    for (var i = 0; i < word.length; i++) {
        let strike = '';
        if($(".alphabet-box[data-alphabet="+word[i]+"]").hasClass('strike')) {
            strike = ' strike';
        }

        wordstring += '<span class="alphabet-'+word[i]+strike+'">'+word[i]+' </span>';
    }

    $('.word-row.row-'+count+' .letter').html(wordstring);
    $('.word-row.row-'+count+' .cows').text(cows);
    $('.word-row.row-'+count+' .bulls').text(bulls);
}

$('.alphabet-box').click(function() {
    $(this).toggleClass('strike');
    $('.alphabet-'+$(this).data('alphabet')).toggleClass('strike');
});