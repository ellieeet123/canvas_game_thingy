// Main file that starts the entire game. 
// all functions are in different files, this one just starts everything up.

function startGame(seed, difficulty) {
    /*
        StartGame can be called whenever you want to. 
        It will completely reset all variables, effectively
        deleting any progress the player might have had, and 
        completely restart the game with a new seed.
    */
    // makes sure nothing happens when the canvas gets clicked
    document.getElementById('canvas').onclick = () => {};

    // preprocessing
    setVars(seed, difficulty);
    addKeyEventListeners();
    addCoordsToSpikeObjects();
    addTypesToObjects();
    fixColorsOnElevators();

    // draw the initial frame
    background(playerPos.x % 100, playerPos.y % 100);
    drawObjects('rectangles');
    drawObjects('spikes');
    drawObjects('circles');
    drawPlayer();

    // start the main loops!
    mainloop();
    fpsloop();
}

drawMenu();
