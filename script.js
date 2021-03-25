// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence


var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var wrongGuesses = 0;

//generate random clues
function genRandomPattern(n) {
    var pattern = []
    for (let i=0;i<n;i++){
      pattern.push(Math.floor(1 + 6*Math.random()))
    }
    return pattern;
}

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    wrongGuesses = 0;
    //10 clues to win
    pattern = genRandomPattern(10);
  
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
  
    playClueSequence()
}


function stopGame(){
    //initialize game variables
    gamePlaying = false;
  
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}



//audio cues
const freqMap = {
  1: 231.6,
  2: 295.6,
  3: 352,
  4: 389.2,
  5: 420.6,
  6: 463.5
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


//playing for the computer
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
    // speeding up eaach subsequent clue by 10%
    clueHoldTime *= 0.9
  }
}

function playClueSequence(){
  guessCounter = 0;
  clueHoldTime = 1000
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}


//respond to user input
function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won, hurrah!!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if (btn != pattern[guessCounter]){
    if (wrongGuesses < 2){
      wrongGuesses++;
      alert("Wrong tile! You got " + (3-wrongGuesses) + " guesses left!");
    } else {
      loseGame();
    }
  } else if (guessCounter < progress){
    guessCounter++;
  } else if (progress < pattern.length - 1) {
    progress++;
    playClueSequence();
  } else {
    winGame();
  }

}



