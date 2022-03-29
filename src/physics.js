// gravity and elevators and stuff


function fixColorsOnElevators() {
    // makes all elevator objects slightly transparent
    var elevators = getElevators();
    for (let i = 0; i < elevators.length; i++) {
        elevators[i].color = elevators[i].color + '77';
    }
}

function getElevators() {        
    // returns a list of all rectangles with the
    // `elevator` property set to true
    var elevators = [];
    for (let i = 0; i < objects.rectangles.length; i++) {
        if (objects.rectangles[i].elevator) {
            elevators.push(objects.rectangles[i]);
        }
    }
    return elevators;
}

function gravity() {
    // relatively simple gravity engine. 
    // has no return value, instead simply
    // updates the `playerPos.y` value. 
    if (gravityData.on) {
        if (gravityData.active !== gravityData.activeLastTick) {
            // gravity has been reversed since last processing tick, so
            // all variables must be reset
            gravityData.timeFallen = 2;
            gravityData.prevFall = 0;

        }
        let oldY = playerPos.y;
        // normal falling amount calculator
        var fallAmount = 0;
        if (gravityData.active) {
            fallAmount = (gravityData.timeFallen ** 1.5) + 1.1;
            // limit the falling speed so that it doesn't get way too fast
            if (fallAmount >= 35) {
                fallAmount = 35;
            }
        }
        // will go to the else if gravity is off (the player is jumping)
        else {
            // big ugly equation, calculates jump height.
            fallAmount = ((-(((-0.5 * gravityData.timeFallen) + 1) ** 2) + 15) * 1.86);
        }
        // this loop is gravity is normal
        if (gravityData.active) {
            // we check if there are collisions every pixel to make sure it doesn't fall into or through
            // a block. fortunently this doesn't take much time at all, as the graphics aren't
            // updated until all of this finishes
            for (let i = 0; i < fallAmount && !checkForAllCollisions("rectangles") && !checkForAllElevatorCollisions(); i++) {
                playerPos.y ++;
            }
        }
        // reversed gravity
        else {
            for (let i = 0; i < fallAmount && !checkForAllCollisions("rectangles"); i++) {
                playerPos.y --;
            }
        }
        if (fallAmount !== 0) {
            gravityData.active ? playerPos.y -- : playerPos.y ++;
        }
        // immediately turn on gravity if the player's head hits something above it
        if (!gravityData.active) {
            playerPos.y --;
            if (checkForAllCollisions('rectangles')) {
                gravityData.active = true;
            }
            playerPos.y ++;
        }
        if (playerPos.y === oldY) {
            // this means the player hasn't fallen, so vars are reset
            gravityData.timeFallen = 2;
            gravityData.prevFall = 0;
        }
        else {
            gravityData.timeFallen ++;
            gravityData.prevFall = fallAmount;
        }
        gravityData.activeLastTick = gravityData.active;
    }
}

async function elevator() {
    // moves the player up if it is inside an elevator,
    // and returns true if the player moved. 
    return new Promise(resolve => {
        // idk if this really has to be a promise but oh well
        var elevators = getElevators();
        for (let i = 0; i < elevators.length; i++) {
            if (checkForPlayerCollision(elevators[i]) === 'elevator') {
                for (let j = 0; j < 24; j++) {
                    playerPos.y -= 1;
                    if (checkForAllCollisions('rectangles') || checkForPlayerCollision(elevators[i]) === 'none') {
                        if (checkForPlayerCollision(elevators[i]) === 'none') {
                            playerPos.y += 1;
                            resolve(false);
                        }
                        playerPos.y += 1;
                        break;
                    }
                }
                resolve(true); // player used an elevator. 
                //                The return value is used to tell the game loop to turn off gravity this tick.
            }
        }
        resolve(false); // player didn't use an elevator.
    });
}

async function jump() {
    // simulates jumping by reversing gravity for 300ms
    return new Promise(async function (resolve) {
        playerPos.y ++;
        if (checkForAllCollisions("rectangles") || checkForAllElevatorCollisions()) {
            // this only happens if there is a platform below the player
            playerPos.y --;
            gravityData.active = false;
            await wait(300);
            gravityData.active = true;
        }
        else {
            playerPos.y --;
        }
        resolve();
    });
}
