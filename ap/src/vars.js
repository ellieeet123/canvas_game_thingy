// All of the global variables used in the game

function setVars(seed, difficulty) {
    window.gameRunning = true;
    window.playerDied = false;
    window.base_rng_seed = seed;
    window.playerPos = {
        "x": 0,
        "y": 0
    };
    window.cameraPos = {
        "x": 0,
        "y": 0
    }
    window.time = 0;
    window.fps = 0;
    window.mspf = 0; // milliseconds per frame
    window.targetFps = 60;
    window.mspt = 30; // milliseconds per tick
    window.headstart = 10; // seconds before evil circle of death starts
    window.difficulty = difficulty; // rate at which the circle expands
    window.gravityData = {
        "on": true, // if false, gravity is completely disabled
        "active": true, // set to false to reverse gravity
        "activeLastTick": true, 
        "timeFallen": 2,
        "prevFall": 0
    }
    window.jumping = false;
    window.jumpedTick = 0;
    window.lastTickTime = 0;
    window.tickNumber = 0;
    window.playerSpeed = 7; // the amount of pixels the player moves in
                            // the amount of ticks set in targetFps
    window.playerSize = 50;
    window.keydata = {
        "any": false,
        "arrows": {
            "up":    false,
            "down":  false,
            "left":  false,
            "right": false
        }
    }
    // an object with all seeds that have been generated, and the number they produced.
    // this is to prevent running the RNG multiple times, which improves performance.
    window.rngData = {};
    window.lineData = {};

    // these two are just for fun. 
    window.collisionschecked = 0;
    window.rngsGenerated = 0;
    window.skippedTicks = 0;
    window.objects = {
        // two lists that will eventually hold every object being drawn for each frame.
        "rectangles": [],
        "circles": []
    }

    // config for the line section of the space generation
    window.generatorConfig = {
        "lineChance": 60,           // percent chance that a line will be generated
        "rightChance": 45,          // percent chance of a line generating in the right direction from it's start. chance for left will be 100 - rightChance
        "crazyness": 50,            // each block will be offset from a straight line by a random number from 0 to this.
        "minLength": 1000,          // minimum length of a line, pixels
        "maxLength": 1200,          // maximum length of a line, pixels
        "minSlope": 0.5,            // minimum slope of a line, rise over run
        "maxSlope": 2.0,            // maximum slope of a line, rise over run
        "smallSlopeChance": 70,     // percent chance of a line generating with a slope less than 1
        "minBlockDensity": 5,       // minimum percent of 50x50 chunks within the line that will spawn a block
        "maxBlockDensity": 7,       // maximum percent of 50x50 chunks within the line that will spawn a block
        "minBlockWidth": 80,        // minimum width of a block, pixels
        "maxBlockWidth": 200,       // maximum width of a block, pixels
        "blockHeight": 15,          // height of a block, pixels. This is the same for all blocks.
        "minLineHeight": 50,        // minimum height of a line, pixels.
                                    // The height of a line is essentially the range
                                    // of Y cords that blocks can spawn in, starting
                                    // from the origin of the line. In other words,
                                    // the thickness of a line. It still has the slope
                                    // from the min and max slope properties.
        "maxLineHeight": 200,       // maximum height of a line, pixels.
        "colors": {                 // colors that different types can be
            "rectanglesNormal": [
                "#df2a2a",
                "#2a2adf",
                "#2adf2a",
                "#fcba03",
                "#0be35e",
                "#700ff7",
                "#0da5d4",
                "#d6510f",
                "#f7f70f",
                "#ed2da4",
            ]
        }
    }
}
