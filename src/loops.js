// main game loops


async function mainloop() {
    // main processing loop. does not draw the screen. 
    // check for any key presses, and do stuff based on them.
    let oldX = playerPos.x;
    if (keydata.any) {
        if (keydata.arrows.up && !jumping) {
            // jump
            jumping = true;
            await jump();
            jumping = false;
        }
        else if (keydata.arrows.left) {
            // move player left
            playerPos.x -= playerSpeed;
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
            playerPos.x += playerSpeed;
            if (checkForAllCollisions("rectangles")) {
                playerPos.x = oldX;
                while (!checkForAllCollisions("rectangles")) {
                    playerPos.x += 1;
                }
                playerPos.x --;
            }
        }
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
    var xOffset = 600;
    var yOffset = 300;
    for (
        let i = (Math.floor(playerPos.x / 300) * 300) - xOffset, ii = i;
        i < ii + xOffset * 2.5;
        i += 300
    ) {
        for (
            let j = (Math.floor(-playerPos.y / 300) * 300) - yOffset, jj = j;
            j < jj + yOffset * 4;
            j += 300
        ) {
            generateSpace(i, j);
        }
    }
    addTypesToObjects();
}

async function drawloop() {
    // draws screen
    while (true) {
        let start = Date.now();
        background(playerPos.x % 100, playerPos.y % 100);
        drawObjects('rectangles');
        drawObjects('spikes');
        drawObjects('circles');
        drawPlayer();
        await wait(min_mspf); // tiny delay is needed to prevent the screen from locking up
        let end = Date.now();
        fps = Math.round((1000 / (end - start)));
        mspf = end - start;
        if (fps === Infinity) {
            fps = 1001;
        }
    }
}

async function fpsloop() {
    // updates FPS display
    while (true) {
        // only update the fps 2x every second, to make it readable.
        document.getElementById('fps').innerHTML = 
            'FPS: ' + fps + '<br>' 
            + '(' + mspf + ' ms per frame)' 
            + '<br>Seed: ' + base_rng_seed
            + '<br>Player: ' + playerPos.x + ', ' + playerPos.y;
        await wait(1000 / 2);
    }
}

async function processloop() {
    // runs mainloop() but with a small delay.
    while (true) {
        mainloop();
        await wait(30);
    }
}
