// a simple game using canvas.
// this could probably do with more comments. but oh well

// lots of configs...
var playerPos = {
    "x": 0,
    "y": 0
};
var fps = 0;
var mspf = 0; // milliseconds per frame
var min_mspf = 1;
var gravityData = {
    "active": true,
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
/*
===== Epic guide to making objects =====

RECTANGLES: 
the startx and starty values will form the corner of the bottom left corner. 
the endx and endy values will form the corner of the top right corner. 
color obviously sets the color
collide desides if collision physics will effect it. If it is set to false, the player
will be able to pass right through it. 

SPIKES: 
equalateral triangles that kill you. 
spikes are positioned based off of the smallest possible square that it could fit into.
x and y form the bottom left corner of that square. 
size (pixels) is how long each side of the tri (and also square) will be
direction is where it will face (up, down, left, right, must be lowercase)
color sets the color of the spike
collide desides if collision physics will effect it. If it is set to false, the player
will be able to pass right through it. 
*/
var objects = {
    "rectangles": [
        {
            "startx": -1000,
            "starty": -70,
            "endx": 100,
            "endy": -50,
            "color": "#ff0000",
            "collide": true
        },
        {
            "startx": 330,
            "starty": 120,
            "endx": 400,
            "endy": 200,
            "color": "#00ff00",
            "collide": true
        },
        {
            "startx": -170,
            "starty": -70,
            "endx": -150,
            "endy": -750,
            "color": "#7722ff",
            "collide": true
        },
        {
            "startx": 130,
            "starty": 30,
            "endx": 330,
            "endy": 50,
            "color": "#000000",
            "collide": true
        },
        {
            "startx": -630,
            "starty": 130,
            "endx": 250,
            "endy": 150,
            "color": "#000000",
            "collide": true
        },
        {
            "startx": -1000,
            "starty": -470,
            "endx": 100,
            "endy": -460,
            "color": "#ff0000",
            "collide": true
        },
        {
            "startx": -1000,
            "starty": -10000,
            "endx": 1000,
            "endy": -10010,
            "color": "#209920",
            "collide": true
        },
        {
            "startx": -640,
            "starty": 0,
            "endx": -230,
            "endy": 10,
            "color": "#000000",
            "collide": true
        }
    ],
    "spikes": [
        {
            "x": -400,
            "y": -50,
            "size": 25,
            "direction": "up",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -425,
            "y": -50,
            "size": 25,
            "direction": "up",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -450,
            "y": -50,
            "size": 25,
            "direction": "up",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -475,
            "y": -50,
            "size": 25,
            "direction": "up",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -500,
            "y": -50,
            "size": 25,
            "direction": "up",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -525,
            "y": -50,
            "size": 25,
            "direction": "up",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -550,
            "y": -50,
            "size": 25,
            "direction": "up",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -575,
            "y": -50,
            "size": 25,
            "direction": "up",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -600,
            "y": -50,
            "size": 25,
            "direction": "up",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
////////////////////////////////////////////////////////////////////////////
        {
            "x": -400,
            "y": 105,
            "size": 25,
            "direction": "down",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -425,
            "y": 105,
            "size": 25,
            "direction": "down",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -450,
            "y": 105,
            "size": 25,
            "direction": "down",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -475,
            "y": 105,
            "size": 25,
            "direction": "down",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -500,
            "y": 105,
            "size": 25,
            "direction": "down",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -525,
            "y": 105,
            "size": 25,
            "direction": "down",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -550,
            "y": 105,
            "size": 25,
            "direction": "down",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -575,
            "y": 105,
            "size": 25,
            "direction": "down",
            "color": "#e67923",
            "death": true,
            "collide": true
        },
        {
            "x": -600,
            "y": 105,
            "size": 25,
            "direction": "down",
            "color": "#e67923",
            "death": true,
            "collide": true
        }
    ]
};

/* returns true if a number is between two values. 
   for example: 
   8.between(2, 12)
   -> true
   8.between(10, 20)
   -> false
   ** stolen from stackoverflow
*/
Number.prototype.between = function(a, b) {
    return this > Math.min(a,b) && this < Math.max(a,b);
};

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// returns true if a point is inside a triangle with vertices A, B, C
// from https://stackoverflow.com/a/9747983
// vec and dot are helper functions for pointInTriangle, taken from the same source
function vec(from, to) {  
    return [to[0] - from[0], to[1] - from[1]];
}
function dot(u, v) {
    return u[0] * v[0] + u[1] * v[1];
}
function pointInTriange(P, A, B, C) {
    // Compute vectors        
    var v0 = vec(A, C);
    var v1 = vec(A, B);
    var v2 = vec(A, P);
    // Compute dot products
    var dot00 = dot(v0, v0);
    var dot01 = dot(v0, v1);
    var dot02 = dot(v0, v2);
    var dot11 = dot(v1, v1);
    var dot12 = dot(v1, v2);
    // Compute barycentric coordinates
    var invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);
}

// draw a checkerboard background. 
function background(offsetX, offsetY) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#eeeeee';
    for (let i = -150; i < canvas.width + 100; i += 50) {
        for (let j = -150; j < canvas.height + 100; j += 50) {
            if (count % 2 === 0) {
                ctx.fillRect(i - offsetX, j - offsetY, 50, 50);
            }
            count++;
        }
    }
    count = 0;
    ctx.fillStyle = '#cccccc';
    for (let i = -150; i < canvas.width + 100; i += 50) {
        for (let j = -150; j < canvas.height + 100; j += 50) {
            if (count % 2 === 1) {
                ctx.fillRect(i - offsetX, j - offsetY, 50, 50);
            }
            count++;
        }
    }
}

/*  [type] can be one of the following:
    - rectangles
    - spikes
*/
function drawObjects(type) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    if (type === 'rectangles') {
        for (let i = 0; i < objects[type].length; i++) {
            ctx.fillStyle = objects[type][i].color;
            // ignore the mess below, it works
            let startXCor = (canvas.width  / 2) + (-(playerPos.x)) + objects[type][i].startx;
            let startYCor = (canvas.height / 2) + (-(playerPos.y)) + (-(objects[type][i].starty));
            let endXCor   = (canvas.width  / 2) + (-(playerPos.x)) + objects[type][i].endx;
            let endYCor   = (canvas.height / 2) + (-(playerPos.y)) + (-(objects[type][i].endy));
            ctx.fillRect(
                startXCor,
                startYCor,
                endXCor - startXCor,
                endYCor - startYCor
            );
        }
    }
    else if (type === 'spikes') {
        for (let i = 0; i < objects[type].length; i++) {
            ctx.fillStyle = objects[type][i].color;
            // calculating actual position on canvas
            let x1 = (canvas.width  / 2) + (-(playerPos.x)) +    objects[type][i].points[0][0];
            let y1 = (canvas.height / 2) + (-(playerPos.y)) + (-(objects[type][i].points[0][1]));
            let x2 = (canvas.width  / 2) + (-(playerPos.x)) +    objects[type][i].points[1][0];
            let y2 = (canvas.height / 2) + (-(playerPos.y)) + (-(objects[type][i].points[1][1]));
            let x3 = (canvas.width  / 2) + (-(playerPos.x)) +    objects[type][i].points[2][0];
            let y3 = (canvas.height / 2) + (-(playerPos.y)) + (-(objects[type][i].points[2][1]));
            // draw triangles
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.fill();
        }
    }
    else {
        throw new Error('drawObjects: type ' + type + ' is not a valid shape name');
    }
}

function addCoordsToSpikeObjects() {
    // adds data for the actual cordinates of the trialgles to their data.
    // this is done to improve speed, and readability, without having
    // to spend too much time making the tris.
    for (let i = 0; i < objects.spikes.length; i++) {
        let xCor = objects.spikes[i].x;
        let yCor = objects.spikes[i].y;
        let size = objects.spikes[i].size;
        let direction = objects.spikes[i].direction;
        if (direction === 'up') {
            objects.spikes[i].points = [
                [xCor, yCor],
                [xCor + size, yCor],
                [xCor + (size / 2), yCor + size]
            ]
        }
        else if (direction === 'down') {
            objects.spikes[i].points = [
                [xCor, yCor + size],
                [xCor + size, yCor + size],
                [xCor + (size / 2), yCor]
            ]
        }
        else if (direction === 'right') {
            objects.spikes[i].points = [
                [xCor, yCor],
                [xCor, yCor + size],
                [xCor + size, yCor + (size / 2)],
            ]
        }
        else if (direction === 'left') {
            objects.spikes[i].points = [
                [xCor + size, yCor],
                [xCor + size, yCor + size],
                [xCor, yCor + (size / 2)]
            ]
        }
    }
}

function checkForCollisions(type) {
    if (type === 'rectangles') {
        for (let i = 0; i < objects[type].length; i++) {
            if (objects[type][i].collide) {
                let currentObject = objects[type][i];
                if (
                    // warning: this is a mess. but it works somehow
                    (playerPos.x < currentObject.endx && 
                    playerPos.x + playerSize > currentObject.startx) // x-axis
                    &&
                    ((-playerPos.y).between(currentObject.starty, currentObject.endy) ||
                    ((-playerPos.y) - playerSize).between(currentObject.starty, currentObject.endy) ||
                    currentObject.starty.between(-playerPos.y, -playerPos.y - playerSize) ||
                    currentObject.endy.between(-playerPos.y, -playerPos.y - playerSize)
                    ) // y-axis
                ) {
                    if (currentObject.eeeee) {console.log('eeeee')}
                    return true;
                }
            }
        }
        return false;
    }
    else if (type === 'spikes') {
        for (let i = 0; i < objects[type].length; i++) {
            if (objects[type][i].collide) {
                let currentObject = objects[type][i];
                if (
                    // check for individual points on triangle
                    (currentObject.points[0][0].between(playerPos.x, playerPos.x + playerSize) &&
                     currentObject.points[0][1].between(-playerPos.y, -playerPos.y - playerSize))
                    ||
                    (currentObject.points[1][0].between(playerPos.x, playerPos.x + playerSize) &&
                     currentObject.points[1][1].between(-playerPos.y, -playerPos.y - playerSize)) 
                    ||
                    (currentObject.points[2][0].between(playerPos.x, playerPos.x + playerSize) &&
                     currentObject.points[2][1].between(-playerPos.y, -playerPos.y - playerSize))
                ) {
                    return true;
                }
                else if (
                    // check if individual corners of the player are inside the triangle
                    pointInTriange(
                        [playerPos.x, -playerPos.y],
                        [currentObject.points[0][0], currentObject.points[0][1]], 
                        [currentObject.points[1][0], currentObject.points[1][1]], 
                        [currentObject.points[2][0], currentObject.points[2][1]]
                    ) ||
                    pointInTriange(
                        [playerPos.x + playerSize, -playerPos.y],
                        [currentObject.points[0][0], currentObject.points[0][1]],
                        [currentObject.points[1][0], currentObject.points[1][1]],
                        [currentObject.points[2][0], currentObject.points[2][1]]
                    ) ||
                    pointInTriange(
                        [playerPos.x, -playerPos.y - playerSize],
                        [currentObject.points[0][0], currentObject.points[0][1]],
                        [currentObject.points[1][0], currentObject.points[1][1]],
                        [currentObject.points[2][0], currentObject.points[2][1]]
                    ) ||
                    pointInTriange(
                        [playerPos.x + playerSize, -playerPos.y - playerSize],
                        [currentObject.points[0][0], currentObject.points[0][1]],
                        [currentObject.points[1][0], currentObject.points[1][1]],
                        [currentObject.points[2][0], currentObject.points[2][1]]
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    else {
        throw new Error('checkForCollisions: type ' + type + ' is not a valid shape name');
    }
}

function drawPlayer() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = '#3366ff';
    ctx.fillRect(canvas.width / 2, canvas.height / 2, playerSize, playerSize);
}

function gravity() {
    if (gravityData.active !== gravityData.activeLastTick) {
        // gravity has been reversed since last processing tick, so
        // all variables must be reset
        gravityData.timeFallen = 2;
        gravityData.prevFall = 0;

    }
    let oldY = playerPos.y;
    // normal falling amount calculator
    if (gravityData.active) {
        var fallAmount = (gravityData.timeFallen ** 1.5) + 1.1;
        // limit the falling speed so that it doesn't get way too fast
        if (fallAmount >= 35) {
            fallAmount = 35;
        }
    }
    // will go to the else if gravity is off (the player is jumping)
    else {
        // big ugly equation, calculates jump height.
        var fallAmount = ((-(((-0.5 * gravityData.timeFallen) + 1) ** 2) + 15) * 1.38);
    }
    // this loop is gravity is normal
    if (gravityData.active) {
        // we check if there are collisions every pixel to make sure it doesn't fall into or through
        // a block. fortunently this doesn't take much time at all, as the graphics aren't
        // updated until all of this finishes
        for (let i = 0; i < fallAmount && !checkForCollisions("rectangles"); i++) {
            playerPos.y ++;
        }
    }
    // reversed gravity
    else {
        for (let i = 0; i < fallAmount && !checkForCollisions("rectangles"); i++) {
            playerPos.y --;
        }
    }
    if (fallAmount !== 0) {
        gravityData.active ? playerPos.y -- : playerPos.y ++;
    }
    // immediately turn on gravity if the player's head hits something above it
    if (!gravityData.active) {
        playerPos.y --;
        if (checkForCollisions('rectangles')) {
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

async function jump() {
    return new Promise(async function (resolve) {
        playerPos.y ++;
        if (checkForCollisions("rectangles")) {
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

async function mainloop() {
    // main processing loop. does not draw the screen. 
    // check for any key presses, and do stuff based on them.
    if (keydata.any) {
        let oldX = playerPos.x;
        if (keydata.arrows.up && !jumping) {
            jumping = true;
            await jump();
            jumping = false;
        }
        else if (keydata.arrows.left) {
            playerPos.x -= playerSpeed;
            if (checkForCollisions("rectangles")) {
                playerPos.x = oldX;
                while (!checkForCollisions("rectangles")) {
                    playerPos.x -= 1;
                }
                playerPos.x ++; // for some reason the while loop makes this
                                // one too low, locking the player in place.
                                // so this makes the value as it should be.
            }
        }
        else if (keydata.arrows.right) {
            playerPos.x += playerSpeed;
            if (checkForCollisions("rectangles")) {
                playerPos.x = oldX;
                while (!checkForCollisions("rectangles")) {
                    playerPos.x += 1;
                }
                playerPos.x --;
            }
        }
    }

    // process stuff like gravity, etc
    gravity();

    // kill the player if it's touching a spike
    if (checkForCollisions("spikes")) {
        playerPos.x = 0;
        playerPos.y = 0;
        gravityData.active = true;
    }
}


// key event handlers
document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowLeft") {
        keydata.any = true;
        keydata.arrows.left = true;
    }
    else if (event.code === "ArrowUp" || event.code === "Space") {
        keydata.any = true;
        keydata.arrows.up = true;
    }
    else if (event.code === "ArrowRight") {
        keydata.any = true;
        keydata.arrows.right = true;
    }
    else if (event.code === "ArrowDown") {
        keydata.any = true;
        keydata.arrows.down = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.code === "ArrowLeft") {
        keydata.arrows.left = false;
    }
    else if (event.code === "ArrowUp" || event.code === "Space") {
        keydata.arrows.up = false;
    }
    else if (event.code === "ArrowRight") {
        keydata.arrows.right = false;
    }
    else if (event.code === "ArrowDown") {
        keydata.arrows.down = false;
    }
    if (
        !keydata.arrows.left   &&
        !keydata.arrows.up     &&
        !keydata.arrows.right  &&
        !keydata.arrows.down  
    ) {
        keydata.any = false;
    }
});

async function drawloop() {
    while (true) {
        let start = Date.now();
        background(playerPos.x % 100, playerPos.y % 100);
        drawObjects('rectangles');
        drawObjects('spikes');
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
    while (true) {
        // only update the fps 3x every second, to make it readable.
        document.getElementById('fps').innerHTML = 'FPS: ' + fps + '<br>(' + mspf + ' ms per frame)';
        await wait(333);
    }
}

async function processloop() {
    while (true) {
        mainloop();
        await wait(30);
    }
}

// start this thing!

// preprosessing
addCoordsToSpikeObjects();

// draw the initial frame
background(playerPos.x % 100, playerPos.y % 100);
drawObjects('rectangles');
drawObjects('spikes');
drawPlayer();

// start the main loops
drawloop();
processloop();
fpsloop();

// holy crap, javascript is really annoying sometimes.
