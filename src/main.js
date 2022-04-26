// Main file that starts the entire game. 
// all functions are in different files, this one just starts everything up.

// preprocessing
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
