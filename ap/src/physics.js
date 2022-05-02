// gravity and stuff


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
            fallAmount = ((-((-0.5 * gravityData.timeFallen + 1) ** 2) + 15) * 2.16);
        }
        // this loop is gravity is normal
        if (gravityData.active) {
            // we check if there are collisions every pixel to make sure it doesn't fall into or through
            // a block. fortunently this doesn't take much time at all, as the graphics aren't
            // updated until all of this finishes
            for (
                let i = 0; 
                i < fallAmount && 
                !checkForAllCollisions("rectangles");
                i++
            ) {
                playerPos.y ++;
            }
        }
        // reversed gravity
        else {
            for (
                let i = 0; 
                i < fallAmount && 
                !checkForAllCollisions("rectangles");
                i++
            ) {
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
        if (Math.abs(playerPos.y - cameraPos.y) > 150) {
            cameraPos.y += playerPos.y - oldY;
        }
        gravityData.activeLastTick = gravityData.active;
    }
}

function jump() {
    // reverses gravity if the player is standing on a platform.
    jumpedTick = tickNumber;
    playerPos.y ++;
    if (checkForAllCollisions("rectangles")) {
        // this only happens if there is a platform below the player
        playerPos.y --;
        gravityData.active = false;
    }
    else {
        playerPos.y --;
    }
}

function endJump() {
    // resets gravity
    gravityData.active = true;
}
