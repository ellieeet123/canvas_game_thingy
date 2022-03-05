// All of the global variables used in the game


var base_rng_seed = Date.now().toString();
var playerPos = {
    "x": 0,
    "y": 0
};
var fps = 0;
var mspf = 0; // milliseconds per frame
var min_mspf = 1;
var gravityData = {
    "on": true, // if false, gravity is completely disabled
    "active": true, // set to false to reverse gravity
    "activeLastTick": true, 
    "timeFallen": 2,
    "prevFall": 0
}
var jumping = false;
var playerSpeed = 10;
var playerSize = 50;
var keydata = {
    "any": false,
    "arrows": {
        "up":    false,
        "down":  false,
        "left":  false,
        "right": false
    }
}
var colors = {
    // colors that different types can be
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
// an object with all seeds that have been generated, and the number they produced.
// this is to prevent running the RNG multiple times, which improves performance.
var rngData = {};
var collisionschecked = 0;
var rngsGenerated = 0;
/*
===== Epic guide to making objects =====

RECTANGLES: 
the startx and starty values will form the corner of the bottom left corner. 
the endx and endy values will form the corner of the top right corner. 
color obviously sets the color
collide desides if collision physics will effect it. If it is set to false, the player
will be able to pass right through it. 
To make it an elevator, set the elevator attribute to true, and collide to false.

SPIKES: 
equalateral triangles that kill you. 
spikes are positioned based off of the smallest possible square that it could fit into.
x and y form the bottom left corner of that square. 
size (pixels) is how long each side of the tri (and also square) will be
direction is where it will face (up, down, left, right, must be lowercase)
color sets the color of the spike
collide desides if collision physics will effect it. If it is set to false, the player
will be able to pass right through it. 

Currently most objects are auto generated.
*/
var objects = {
    "rectangles": [
        {
            "startx": -100,
            "starty": -50,
            "endx": 200,
            "endy": -70,
            "color": "#ff0000",
            "collide": true,
        }
    ],
    "spikes": [],
    "circles": []
}
