/**
 * Asteroid Alert!
 * a retro-inspired video game
 * 
 * created by Gary Crosby
 * 
 * Asteroid Attack! is a simple retro-inspired space shooter game
 * where you defend your spaceship from incoming asteroids.
 *
 * The game aesthetics were loosely inspired by some of the early video games
 * which had simple, vector-based graphics and a limited colour palette.
 * 
 * I created this project for my post-sceondary students who, in one course,
 * use p5.js to create a game, puzzle, etc. So, the project is intended to be
 * an example of a simple game that can be created using p5.js.
 * 
 * It was a quick build so it contains some sloppy or inefficient code.
 * And it could also use a few additional gameplay elements to make it more fun.
 * But it works well enough for the intended purpose of a demo.
 * 
 * Credits:
 * Audio assets except success.mp3 from www.kenney.nl
 * Audio asset success.mp3 from Leszek_Szary @ pixabay.com
 * Music by Eric Matyas at www.soundimage.org 
*/

/**
 * Initialize ALL global constants and variables
 */

// UI colors. Only a few of these are actually used.
const BLACK = [0, 0, 0];
const RED = [204, 143, 92];
const GREEN = [0, 255, 0];
const BLUE = [0, 154, 238];
const ORANGE = [253, 177, 48];
const YELLOW = [255, 234, 0];
const LIGHT_GREEN = [0, 128, 0];
const WHITE = [255, 255, 255];

// Canvas size
const C_WIDTH = 750; // canvas width
const C_HEIGHT = 1000; // canvas height

// Game states
const STATE_INTRO = "intro"; // Introduction gameState
const STATE_PLAY = "play"; // Play gameState
const STATE_GAMEOVER = "gameover"; // Game Over gameState
const STATE_WIN = "win"; // Win gameState
let gameState = STATE_INTRO; // values STATE_INTRO, STATE_PLAY, STATE_GAMEOVER, STATE_CREDITS
let introLevel = 0; // INTRO level 
let playLevel = 1; // PLAY level 
let score = 0; // score

// Projectiles and asteroids
const projectiles = []; // array to hold all active projectile instances
const asteroids = []; // array to hold all active asteroid instances
let astCreated = 0; // Running total of # of asteroids created in a level

// PLAY levels
// JavaScript object literal to hold play level data where:
//   astMax == total number of asteroids to create in the level
//   astInterval == # of pixels moved per loop (larger number == faster)
//   astSpawnFreq == odds of creating asteroid per loop are 1/astSpawnFreq
const PLAY_LEVELS = {
  1: { astMax: 30, astInterval: 0.5, astSpawnFreq: 60 },
  2: { astMax: 40, astInterval: 0.75, astSpawnFreq: 50  },
  3: { astMax: 75, astInterval: 1.0, astSpawnFreq: 40 }
  // ... Could add as more levels, if needed
};
const levelCount = Object.keys(PLAY_LEVELS).length; // Store # of PLAY levels (excludes Intro, Win, Gameover)

// Weapons
const WEAPON_REGEN = 15; // # of frames between consecutive weapons fire
let frameN = 0; // # of frames since app start
let weaponFrame = 0; // frame count last time weapon was fired

// Sounds and music
let musicPlaying = false; // false to stop or true to play
let weaponFireSnd; // weapon sound 
let astDestroySnd; // asteroid destroyed sound
let shieldSnd; // sheild activated sound
let shipDestroySnd; // ship destroy sound
let thrusterSnd; //  thruster sound
let winSnd; // WIN sound
let winSndPlayed = false;

/**
 * Preload audio into sound instances.
 * 
 * Runs once before setup()
 */
function preload() {
  weaponFireSnd = loadSound('/assets/laserSmall_004.ogg');
  astDestroySnd = loadSound('/assets/explosionCrunch_000.ogg');
  shieldSnd = loadSound('/assets/forceField_000.ogg');
  shipDestroySnd = loadSound('/assets/explosionCrunch_002.ogg');
  thrusterSnd = loadSound('/assets/thrusterFire_004.ogg');
  winSnd = loadSound('/assets/success.mp3');
  musicTrack = loadSound('/assets/Light-Years_V001_Looping.mp3');
}

/**
 * Setup initial states when programs starts.
 * 
 * Runs once before draw()
 * This is where you setup the game canvas, background, etc.
 */
function setup() {
  createCanvas(C_WIDTH, C_HEIGHT);
  resetBackground();
  soundFormats('ogg');
  musicTrack.loop = true;
  musicTrack.setVolume(0.25);
}

/**
 * Main game loop
 * 
 * This is where the game logic is placed and where the game is drawn
 */
function draw() {

  // Increment # of frames played
  frameN += 1;

  // Check gameState and run the state
  switch (gameState) {

    case STATE_INTRO:
      console.log("INTRO");
      displayIntro();
      break;

    case STATE_PLAY:
      console.log("PLAY");
      // Sets PLAY level state
      console.log('levelCount', levelCount);
      console.log('playLevel', playLevel);
      console.log('PLAY_LEVELS[playLevel].astMax', PLAY_LEVELS[playLevel].astMax)
      // If no active asteroids or projectiles AND all asteroids have been created then increment playLevel
      playLevel = (asteroids.length === 0 && projectiles.length === 0 && astCreated >= PLAY_LEVELS[playLevel].astMax) ? playLevel + 1 : playLevel;

      // Check for ALL levels completed -> WIN!
      if (playLevel > levelCount) {
        gameState = STATE_WIN;
      }
      else {
        // Clear the background and stop the music
        resetBackground();
        doMusic(false);
        // If ship does not exist then create it
        if (typeof myShip === 'undefined') {
          myShip = new Ship(C_WIDTH / 2, C_HEIGHT - 30);
        }
        // If status display console does not exist then create it
        if (typeof myDisplay === 'undefined') {
          myDisplay = new myConsole();
        }
        //  Player keyboard controls: <- or a, -> or d, or space bar
        //   
        //   keyIsPressed() detects if a key is held down and
        //   is most suitable for controlling an object like a ship.
        //
        //   keyPressed() detects a single key press and is most
        //   suitable for moving to the next screen, etc.
        //
        if (keyIsPressed) {
          // Move ship right using keys: -> or d or D
          if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') {
            if (myDisplay.fuel > 0) {
              myShip.moveRight();
              myDisplay.shipMoved();
              // Start the thruster sound if it's not playing
              if (!thrusterSnd.isPlaying()) {
                thrusterSnd.play();
              }
            }

          }
          // Move ship left using keys: <- or a or A
          else if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') {
            if (myDisplay.fuel > 0) {
              myShip.moveLeft();
              // Start the thruster sound if it's not playing
              if (!thrusterSnd.isPlaying()) {
                thrusterSnd.play();
              }
              myDisplay.shipMoved();
            }

          }
          // Fire weapon using key: space bar
          else if (keyCode === 32) {
            // Fire weapon only if enough time has passed since last firing
            if ((frameN - weaponFrame) > WEAPON_REGEN && myDisplay.weapon > 0) {
              controlProjectiles(true);
              // Play the weapon sound
              weaponFireSnd.play();
            }
          }
        }
        else {
          // Stop the thruster sound if it's playing
          if (thrusterSnd.isPlaying()) {
            thrusterSnd.stop()
          };
        }
        // Update player status display and projectile position
        myDisplay.display();

        controlProjectiles(false);

        // If max number of asteroids has not been created
        // then create a new asteroid at a random time interval
        if (astCreated < PLAY_LEVELS[playLevel].astMax) {
          let initAsteroid = getRandomInt(1, PLAY_LEVELS[playLevel].astSpawnFreq);
          if (initAsteroid === 1) {
            controlAsteroids(true);
          }
        }
        // Update all asteroids
        controlAsteroids(false);

        // The ship instance displays on new() and move() but must also
        // do it here in case move() was not called.
        myShip.display();
      }
      break;

    case STATE_WIN:
      console.log("WIN");
      displayWin();
      break;

    case STATE_GAMEOVER:
      console.log("GAMEOVER");
      displayGameOver()
      break;

  }

}
