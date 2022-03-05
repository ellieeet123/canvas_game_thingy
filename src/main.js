// a simple game using canvas.
// this could probably do with more comments. but oh well 
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
drawloop();
processloop();
fpsloop();
