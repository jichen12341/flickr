const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

const STATE_IDLE = 0;
const STATE_HINT1 = 1;
const STATE_HINT2 = 2;
const STATE_HINT3 = 3;
const POINTS = [0, 3, 2, 1];
const TIMER = 30000;

var gSocket = io();
var gPlayerNo = -1;
//var gAnswer;
var gQuestionNo;
var gScore = [0, 0];
var gState;
var gTimer = [0, 0, 0];

function init()
{
    gState = STATE_IDLE;
    const nextq = document.getElementById('nextq');
    nextq.style.display = "none";

    //init_layout();
    //join_game();
    //start_game();
    heartbeat();
}

function new_game()
{
    gSocket.emit('new game');
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
    gPlayerNo = 0;
}

function join_game()
{
    const code = gameCodeInput.value;
    console.log('join gmae', code);

    gSocket.emit('join game', code);
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
    gPlayerNo = 1;
}

gSocket.on('game code', function(gameCode) {
    gameCodeDisplay.innerText = gameCode;

    //goto_hint1(photos);
    //console.log(photos);
    //var photo = document.getElementById('photo');
    //photo.src="http://farm66.static.flickr.com/65535/51134388636_89b17876a0_b.jpg";
    //display_hint1("學堂");
    //setTimeout(display_hint2, 1000, "ㄒㄊ");
    //setTimeout(display_hint3, 1000, "<span class='punct'><a href='./快捷'>快捷</a>、</span><span class='punct'><a href='./迅速'>迅速</a>。</span>");
});

gSocket.on('unknown code', function() {
    reset();
    alert('密碼錯誤');
});

gSocket.on('too many players', function() {
    reset();
    alert('遊戲已經開始');
});

gSocket.on('verify', function(playerNo, guess, isCorrect) {
    console.log('verify', playerNo, guess, isCorrect);

    display_guess(playerNo, guess, isCorrect);

    if (isCorrect)
    {
        handle_end_turn(playerNo);
    }
});

gSocket.on('start turn', function(answer, photos) {
    //console.log('next turn', answer);
    handle_start_turn(answer, photos);
});

function handle_start_turn(answer, photos)
{
    //console.log(answer);

    var hint = document.getElementById('hint1');
    hint.textContent = '';

    var hint = document.getElementById('hint2');
    hint.textContent = '';

    var hint = document.getElementById('hint3');
    hint.textContent = '';

    const nextq = document.getElementById('nextq');
    nextq.style.display = "none";

    goto_hint1(photos);
    let timer = setTimeout(goto_hint2, TIMER, answer[1]);
    gTimer[0] = timer;
    timer = setTimeout(goto_hint3, TIMER * 2, answer[2]);
    gTimer[1] = timer;
    timer = setTimeout(goto_hint4, TIMER * 3, answer[0]);
    gTimer[2] = timer;
}

function handle_end_turn(playerNo)
{
    gScore[playerNo] += POINTS[gState];
    display_score(gScore);

    console.log(gTimer.length);
    for (i = 0; i < gTimer.length; i++)
        clearTimeout(gTimer[i]);

    const nextq = document.getElementById('nextq');
    nextq.style.display = "block";

    gState = STATE_IDLE;
}

function nextq_onclick()
{
    gSocket.emit('ready');

    var hint = document.getElementById('hint1');
    hint.textContent = '等待對方';

    var hint = document.getElementById('hint2');
    hint.textContent = '';

    var hint = document.getElementById('hint3');
    hint.textContent = '';

    const nextq = document.getElementById('nextq');
    nextq.style.display = "none";
}

function goto_hint1(answer)
{
    gState = STATE_HINT1;
    display_hint1(answer);
}

function goto_hint2(answer)
{
    gState = STATE_HINT2;
    display_hint2(answer);
}

function goto_hint3(answer)
{
    gState = STATE_HINT3;
    display_hint3(answer);
}

function goto_hint4(answer)
{
    gState = STATE_IDLE;
    display_answer(answer);
    handle_end_turn(0);
}

function guess_keypress(e)
{
    if (gState == STATE_IDLE)
        return;

    if(e.keyCode === 13)
    {
        e.preventDefault(); // Ensure it is only this code that runs

        var guess = document.getElementById('guess');
        value = guess.value.trim();

        if (value.length)
        {
            console.log("guess", value);
            guess.value = "";
            gSocket.emit('guess', value);
        }
    }
}

function heartbeat()
{
    setInterval(function(){ gSocket.emit('heartbeat');  }, 30000);
}