// main game loops


async function processTick() {
    // main processing loop. does not draw the screen. 
    // check for any key presses, and do stuff based on them.
    let oldX = playerPos.x;
    if (keydata.any) {
        if (keydata.arrows.up && !jumping) {
            // jump
            jumping = true;
            jump();
        }
        else if (keydata.arrows.left) {
            // move player left
            playerPos.x -= Math.floor(targetFps / playerSpeed);
            if (checkForAllCollisions("rectangles")) {
                playerPos.x = oldX;
                while (!checkForAllCollisions("rectangles")) {
                    playerPos.x -= 1;
                }
                playerPos.x ++; // for some reason the while loop makes this
                                // one too low, locking the player in place.
                                // so this makes the value as it should be.
            }
        }
        else if (keydata.arrows.right) {
            // move player right
            playerPos.x += Math.floor(targetFps / playerSpeed);
            if (checkForAllCollisions("rectangles")) {
                playerPos.x = oldX;
                while (!checkForAllCollisions("rectangles")) {
                    playerPos.x += 1;
                }
                playerPos.x --;
            }
        }
        if (Math.abs(playerPos.x - cameraPos.x) > 150) {
            cameraPos.x += playerPos.x - oldX;
        }
    }
    if (tickNumber - jumpedTick >= 10) {
        endJump();
        jumping = false;
    }
    // process stuff like gravity, etc
    await elevator()
        // don't run gravity this tick if the player was inside an elevator
        ? gravityData.on = false 
        : gravityData.on = true;
    gravity();

    // kill the player if it's touching a spike
    if (checkForAllCollisions("spikes")) {
        // TODO: Fancy animation
        playerPos.x = 0;
        playerPos.y = 0;
        gravityData.active = true;
    }
    if (checkForDeath()) {
        console.log("dead");
        playerDied = true;
    }
    // finally, after all movement has been processed, delete and add blocks
    // based off of the player's new position.
    objects = {
        // deletes all existing objects
        "rectangles": [],
        "spikes": [],
        "circles": []
    };

    /* 
        The following code might be hard to understand. 
        But basically what is does, is generates a space for 
        every 600x600 pixel chunk visible to the player.
    */
    var xOffset = 1200;
    var yOffset = 900;
    for (
        let i = (Math.floor(cameraPos.x / 300) * 300) - xOffset, ii = i;
        i < ii + xOffset * 2.5;
        i += 300
    ) {
        for (
            let j = (Math.floor(-cameraPos.y / 300) * 300) - yOffset, jj = j;
            j < jj + yOffset * 4;
            j += 300
        ) {
            generateSpace(i, j);
        }
    }
    // start block
    objects.rectangles.push({
        "startx": -100,
        "starty": -70,
        "endx": 150,
        "endy": -50,
        "color": "#ffffff",
        "collide": true
    });
    if (time > mspt * headstart) {
        objects.circles.push({
            "x": 0,
            "y": -50,
            "radius": (time - mspt * headstart) * difficulty,
            "color": "#aa000077",
        });
    }
    addTypesToObjects();
    time ++;
}

async function fpsloop() {
    // updates FPS display
    while (true) {
        // only update the fps 2x every second, to make it readable.
        document.getElementById('fps').innerHTML = 
            'FPS: ' + fps + '<br>' 
            + '(' + mspf + ' ms per frame)' 
            + '<br>Seed: ' + base_rng_seed
            + '<br>Player: ' + playerPos.x + ', ' + playerPos.y
            + '<br>Camera: ' + cameraPos.x + ', ' + cameraPos.y
            + '<br>Score: ' + Math.floor(distanceToOrgin(playerPos.x, playerPos.y));
        await wait(1000 / 2);
    }
}

async function mainloop() {
    // this is the main game loop that runs basically everything.
    
    requestAnimationFrame(drawloop);
    if (Date.now() - lastTickTime > 1000 / targetFps) {
        tickNumber++;
        lastTickTime = Date.now();
        let start = Date.now();
        background(cameraPos.x % 100, cameraPos.y % 100);
        drawObjects('rectangles');
        drawObjects('spikes');
        drawObjects('circles');
        drawPlayer();
        if (time < mspt * headstart) {
            drawCounter(headstart - 1 - Math.floor(time / mspt));
        }
        if (playerDied) {
            drawGameOver();
        } else {
            processTick();
        }
        let end = Date.now();
        fps = Math.round((1000 / (end - start)));
        mspf = end - start;
        if (fps === Infinity) {
            fps = 1001;
        }
    } else {
        skippedTicks++;
    }
}
