var canvas;
//holds background drops
var drops = [];

//initial color of background drops
var r = 255,
    g = 255,
    b = 255;

var lowAlpha = 125,
    highAlpha = 255;

//variables for the button object
var green,
    red,
    yellow,
    blue;

//initial fill colors of the start screen
var onFill = 255,
    offFill = 150,
    startFill = 255;

//hold comp and user moves for comparison
var comp = [],
    user = [];

//holds note values for sound synthesis
var notes = [50, 54, 57, 61];

//various flags for control flow
var gameStarted = false,
    turnFlag = true,
    strictMode = false,
    wrongFlag = false,
    winFlag = false;

var counter = 1;

var index = 0,
    trigger = 0,
    greenCount = 0,
    redCount = 0,
    yellowCount = 0,
    blueCount = 0;

// for initial setup
function setup() {

  canvas = createCanvas(900, 600);
  canvas.class("game");

  textFont('Helvetica');

  //fills comp array with 20 values for game
  for (var i = 0; i < 20; i++) {
    comp.push(floor(random(4)));
  }

  console.log(comp);

  //creates osc for sound
  osc = new p5.TriOsc();

  //initiates osc at a volume of zero
  osc.start();
  osc.amp(0);

  //creates 500 drops for background effect
  for (var i = 0; i <= 500; i++) {
    drops[i] = new Drop(r, g, b, 2);
  }

  //creates buttons for gameplay
  green = new Button(225, 150, 93, 210, 216, lowAlpha); //medium turqouise
  red = new Button(575, 150, 171, 252, 237, lowAlpha); //pale blue
  yellow = new Button(225, 350, 194, 132, 204, lowAlpha); //african violet
  blue = new Button(575, 350, 113, 86, 135, lowAlpha); //dark lavender

}

// draws each frame to the canvas
function draw() {
  background(31,9,51);

  //draw drops
  for (var i = 0; i < drops.length; i++) {
    drops[i].fall();
    drops[i].show();
  }

  //draw buttons to canvas
  noStroke();

  green.show();
  red.show();
  yellow.show();
  blue.show();

  if (gameStarted === false) {

    //if game isn't already started, display start screen
    startScreen('SIMON!', 'START');

  } else if (gameStarted === true && turnFlag === true && wrongFlag === false) {

    // Computer goes first, plays through notes up to comp[index] each turn
    compTurn();
  }

  if (gameStarted === true) {
    //step count
    textSize(24);
    fill(200);
    text("You're on step: " + counter, width/2-90, height/2+10);
    startOver();
  }

  if (wrongFlag === true) {
    // displays wrong answer message and resets to computer turn
    wrongAnswer();
  }

  if (winFlag === true) {
    // displays winning message and provides option to restart game
    startScreen('Winner!', 'AGAIN?');
  }

}

// sets pitch and volume for oscillator on computer turn, takes note from notes[]
// used in compTurn below
function playComp(note) {
  osc.freq(midiToFreq(note));
  osc.fade(0.5, 0.2);

  setTimeout(function() {
    osc.fade(0, 0.5);
  }, 100);

}

// plays notes from comp[] in sequence up to counter. changes color of appropriate button
// to indicate sequence to user
function compTurn() {
  setTimeout(function() {
    if (index < counter && millis() > trigger) {
      playComp(notes[comp[index]]);
      trigger = millis() + 1000;

      if (comp[index] === 0) {
        green.a = highAlpha;
        setTimeout(function() {
          green.a = lowAlpha;
        }, 900);
      } else if (comp[index] === 1) {
        red.a = highAlpha;
        setTimeout(function() {
          red.a = lowAlpha;
        }, 900);
      } else if (comp[index] === 2) {
        yellow.a = highAlpha;
        setTimeout(function() {
          yellow.a = lowAlpha;
        }, 900);
      } else if (comp[index] === 3) {
        blue.a = highAlpha;
        setTimeout(function() {
          blue.a = lowAlpha;
        }, 800);
      }
      // Move to the next note
      index++;

    } else if (index === counter) {
      turnFlag = false;
    }
  }, 2000);
}

// if the user answer is wrong, sets message to display
function wrongAnswer() {
  fill(255);
  textSize(72);
  text('Oops, try again!', width/2-250, 75);

  // If strict mode is on, reset from beginning, else reset at current turn.
  if (strictMode === true) {
    counter = 1;
    reset();
  } else {
    reset();
  }
}

// resets to user turn at end of wrongAnswer()
function reset() {
  setTimeout(function() {
    wrongFlag = false;
    turnFlag = true;
    index = 0;
  }, 2000);
}

// code for the game's start screen
function startScreen(message, button) {
  push();
  fill(255);
  translate(width / 2, height / 2);
  rect(-165, -100, 330, 200);
  fill(66);
  textSize(72);
  text(message, -130, -5);
  fill(startFill);
  rect(10, 25, 100, 40);
  fill(0);
  textSize(18);
  text(button, 30, 50);
  textSize(14);
  text('Strict Mode', -95, 38);
  textSize(12);
  fill(onFill);
  ellipse(-80, 53, 21, 21);
  fill(offFill);
  ellipse(-45, 53, 21, 21);
  fill(0);
  text('on', -87, 57);
  text('off', -52, 57);
  pop();
}

// code for the startOver button
function startOver() {
  push();
  fill(200);
  rect(width-115, height-50, 100, 40);
  fill(0);
  textSize(14);
  text('Start Over?', width-100, height-25);
  pop();
}

// code called each time mouse is clicked
function mousePressed() {

  // These variables store the distances between mouse position and bounds of buttons
  var distanceG = dist(mouseX, mouseY, 275, 200);
  var distanceR = dist(mouseX, mouseY, 625, 200);
  var distanceY = dist(mouseX, mouseY, 275, height - 200);
  var distanceB = dist(mouseX, mouseY, 625, height - 200);
  var distanceOn = dist(mouseX, mouseY, 370, 353);
  var distanceOff = dist(mouseX, mouseY, 405, 353);


  // If start screen is visible, controls colors of button presses
  if (gameStarted === false) {
    if (distanceOn < 10.5) {
      onFill = 150;
      offFill = 255;
      strictMode = true;
    } else if (distanceOff < 10.5) {
      offFill = 150;
      onFill = 255;
      strictMode = false;
    } else if (mouseX > 460 && mouseX < 560 && mouseY > 325 && mouseY < 385) {
      startFill = 150;
      gameStarted = true;
    }
  }

  // start over button press
  if (mouseX > 785 && mouseX < 885 && mouseY > 550 && mouseY < 590) {
    counter = 1;
    reset();
  }

  // Green button press
  if (distanceG < 50) {

    // changes color of some background drops
    colorDrops(109, 247, 255);

    // highlights green button
    green.a = 255;

    // plays sound
    osc.freq(midiToFreq(50));
    osc.fade(0.9, 0.2);

    // pushes button index to user answer array
    user.push(0);

    greenCount++;

    // calls the checkAnswer function
    checkAnswer();

  } else if (distanceR < 50) {

    // same functionality as above

    colorDrops(89, 249, 220);

    red.a = 255;

    osc.freq(midiToFreq(54));
    osc.fade(0.9, 0.2);

    user.push(1);

    redCount++;

    checkAnswer();

  } else if (distanceY < 50) {

    // same functionality as above

    colorDrops(243, 165, 255);

    yellow.a = 255;

    osc.freq(midiToFreq(57));
    osc.fade(0.9, 0.2);

    user.push(2);

    yellowCount++;

      checkAnswer();


  } else if (distanceB < 50) {

    // same functionality as above

    colorDrops(213, 163, 255);

    blue.a = 255;

    osc.freq(midiToFreq(61));
    osc.fade(0.9, 0.2);

    user.push(3);

    blueCount++;

    checkAnswer();

  } else if (gameStarted) {

    // if the game is started and a click occurs outside the buttons, bounce the drops
    for (var k = 0; k < drops.length; k += floor(random(1, 7))) {
      drops[k].yspeed *= -0.5;
    }
  }

}

function checkAnswer() {
  // holds a slice of comp[] to compare to user[]
  var holder = comp.slice(0,counter);
  console.log(holder,user);

  // at 20 turns and you've won!
  if (user.length === counter && counter === 20 && user[counter-1] === holder[counter-1]) {
    winFlag = true;
    //
  } else if (user.length === counter) {
    if (user[counter-1] == holder[counter-1]) {
      turnFlag = true;
      counter++;
      index = 0;
      console.log(user, 'right');
      user = [];
    } else {
      wrongFlag = true;
      console.log(user, 'wrong');
      user = [];
    }
  } else if (user.length < counter) {
    console.log(holder[user.length-1]);
    if (user[user.length-1] != holder[user.length-1]) {
      wrongFlag = true;
      console.log(user, 'wrong');
      user = [];
    }
  }
}

// resets color of buttons back to normal
function mouseReleased() {

    green.a = lowAlpha;
    red.a = lowAlpha;
    yellow.a = lowAlpha;
    blue.a = lowAlpha;

  osc.fade(0, 0.5);
}

// colors some drops on each button press
function colorDrops(r, g, b) {
  for (var j = 0; j < drops.length; j += floor(random(1, 7))) {
    drops[j].r = r;
    drops[j].g = g;
    drops[j].b = b;
    drops[j].yspeed *= -0.5;
    drops[j].sw = floor(random(1,3));
  }
}

// constructor function for drops
function Drop(r, g, b, sw) {
  this.x = random(width);
  this.y = random(-500, -50);
  this.z = random(0, 15);
  this.yspeed = map(this.z, 0, 15, 10, 20);

  this.sw = sw;

  this.r = r;
  this.g = g;
  this.b = b;

  this.fall = function() {
    this.y = this.y + this.yspeed;
    var gravity = map(this.z, 0, 15, 0, 0.05);
    this.yspeed = this.yspeed + gravity;

    if (this.y > height) {
      this.y = random(-200, -50);
      this.yspeed = map(this.z, 0, 15, 4, 10);
    }
  }

  this.show = function() {
    strokeWeight(this.sw);
    stroke(this.r, this.g, this.b);
    line(this.x, this.y, this.x, this.y + 5);
  }

}

// constructor function for buttons
function Button(x, y, r, g, b, a) {

  this.x = x;
  this.y = y;

  this.w = 100;
  this.h = 100;

  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;

  this.show = function() {
    fill(this.r, this.g, this.b, this.a);
    rect(this.x, this.y, this.w, this.h);
  }

}
