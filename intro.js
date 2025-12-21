/**
 * Runs the Intro levels.
 * 
 * Moved here to clean up draw();
 * 
 * params: none
 * returns: nothing
 * 
 */

function runIntro() {
  // INTRO -> Splash screen 
  if (introLevel === 0) {
    resetBackground();
    stroke(GREEN);
    strokeWeight(0)
    fill(GREEN);
    strokeWeight(1);
    textAlign(CENTER, TOP);
    textSize(60);
    text("ASTEROID ALERT!", C_WIDTH / 2, C_HEIGHT / 5);
    strokeWeight(0);
    fill(GREEN);
    textSize(20);
    text("a retro-inspired video game", C_WIDTH / 2, C_HEIGHT / 3.9);
    textSize(12);
    text("Created by:\nGary Crosby", C_WIDTH / 2, C_HEIGHT / 3.1);
    text("Credits:\nSound effects from www.kenney.nl and leszek_szary at www.pixabay.com\nMusic by Eric Matyas at www.soundimage.org", C_WIDTH / 2, C_HEIGHT / 2.6);
    fill(LIGHT_GREEN);
    textSize(20);
    text("[Press Enter to continue]", C_WIDTH / 2, C_HEIGHT / 1.1); // keypress detection in function keyPressed()
  }

  // INTRO -> Mission Plan
  else if (introLevel === 1) {
    resetBackground();
    fill(GREEN); // green text
    strokeWeight(0);
    textAlign(LEFT, CENTER);
    textSize(36);
    text("Greetings Captain", C_WIDTH / 5, C_HEIGHT / 5);
    textAlign(LEFT, TOP);
    textSize(24);
    text("You have been given command of the interplanetary cargo ship, ESV-217. The ship is carrying a load of unobtanium from Spaceport Beta 72 to Spaceport Gamma 3.\n\nBetween Beta 72 and Gamma 1 are asteroid fields. ESV-217 has an automated defense shield and a manual-activated, forward-facing plasma weapon. However, ESV-217 also has limited fuel for maneuvering, and limited individual power stores for the shield and the weapon.\n\nYour mission is to reach Gamma 3. Your pay will be based on how many asteroids you destroy.", C_WIDTH / 5, C_HEIGHT / 3.6, C_WIDTH / 1.5);
    textAlign(CENTER, TOP);
    fill(LIGHT_GREEN); // light green text
    textSize(20);
    text("[Press Enter to continue]", C_WIDTH / 2, C_HEIGHT / 1.1); // keypress detection in function keyPressed()
  }

  // INTRO -> Flight Manual
  else if (introLevel === 2) {
    resetBackground();
    fill(GREEN); // green text
    strokeWeight(0);
    textSize(36);
    textAlign(LEFT, CENTER);
    text("ESV-217 Flight Manual", C_WIDTH / 5, C_HEIGHT / 5);
    textAlign(LEFT, TOP);
    textSize(24);
    text("Launch, forward velocity, and docking (at Gamma 1) are controlled by the ship's flight computer. You must maneuver the ship laterally and fire the weapon.\n\nManeuver left: A or LEFT ARROW\n\nManeuver right: D or RIGHT ARROW\n\nFire weapon: SPACEBAR\n\n The ships's status display console will appear along the top of the screen.", C_WIDTH / 5, C_HEIGHT / 3.6, C_WIDTH / 1.5);
    textAlign(CENTER, TOP);
    fill(LIGHT_GREEN); // light green text
    textSize(20);
    text("[Press Enter to start your mission]", C_WIDTH / 2, C_HEIGHT / 1.1); // keypress detection in function keyPressed()
  }
}
