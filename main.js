// a simple game using canvas.
// this could probably do with more comments. but oh well 

// lots of configs...
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
var collisionschecked = 0;
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

/*  returns true if a number is between two values. 
    for example: 
    8.between(2, 12)
    -> true
    8.between(10, 20)
    -> false
        - stolen from stackoverflow
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

function random(seed, range) {
    // returns a random number from the UHEPRNG
    var prng = uheprng();
    prng.initState();
    prng.hashString(seed);
    return prng(range);
}

function generateSpace(x, y) {
    // generates all of the objects that start in a 50x50 square
    // originating at x, y.
    if (x % 50 === 0 && y % 50 === 0) { // make sure the location is valid
        var number = random(
            base_rng_seed + x + y,
            100_000
        );
        if (number > 93_000) {
            objects.rectangles.push(
                {
                    "startx": x,
                    "starty": y - 20,
                    "endx": x + 150,
                    "endy": y,
                    "color": "#00f",
                    "collide": true
                }
            )
        }
    }
    else {
        throw new Error('Unable to generate spaces at ' + x + ', ' + y + '. Location not divisible by 50.');
    }
}

function removeOffScreenObjects() {
    // removes all objects that are currently not displayed on the screen.
    // They will then be re-generated once they move into view again
    // this is to make the game run faster, so that we are only
    // processing the objects that need to be processed.
    var canvas = document.getElementById('canvas');
    var newObjects = {
        "rectangles": [],
        "spikes": [],
        "circles": []
    };
    var shapeNames = [
        "rectangles",
        "spikes",
        "circles"
    ];
    for (let j = 0; j < shapeNames.length; j++) {
        for (let i = 0; i < objects[shapeNames[j]].length; i++) {
            if (
                checkForCollision(
                    objects[shapeNames[j]][i],
                    playerPos.x - canvas.width / 2,
                    playerPos.y - canvas.height / 2,
                    canvas.height,
                    canvas.width
                ) === 'normal'
            ) {
                newObjects[shapeNames[j]].push(objects[shapeNames[j]][i]);
            }
        }
    }
    objects = newObjects;
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
    else if (type === 'circles') {
        for (let i = 0; i < objects[type].length; i++) {
            ctx.fillStyle = objects[type][i].color;
            // calculating actual position on canvas
            let x = (canvas.width  / 2) + (-(playerPos.x)) +    objects[type][i].x;
            let y = (canvas.height / 2) + (-(playerPos.y)) + (-(objects[type][i].y));
            let r = objects[type][i].radius;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
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

function addTypesToObjects() {
    // adds a type attribute to each object, based on the list that it's in (rectangles, spikes, circles)
    for (let i = 0; i < objects.rectangles.length; i++) {
        objects.rectangles[i].type = 'rectangles';
    }
    for (let i = 0; i < objects.spikes.length; i++) {
        objects.spikes[i].type = 'spikes';
    }
    for (let i = 0; i < objects.circles.length; i++) {
        objects.circles[i].type = 'circles';
    }
}

function fixColorsOnElevators() {
    // makes all elevator objects slightly transparent
    var elevators = getElevators();
    for (let i = 0; i < elevators.length; i++) {
        elevators[i].color = elevators[i].color + '77';
    }

}

function getElevators() {
    var elevators = [];
    for (let i = 0; i < objects.rectangles.length; i++) {
        // get all elevator objects
        if (objects.rectangles[i].elevator) {
            elevators.push(objects.rectangles[i]);
        }
    }
    return elevators;
}

function checkForPlayerCollision(object) {
    // an easier way of checking for a player collision,
    // without having to add all 5 args each time.
    return checkForCollision(
        object,
        playerPos.x,
        playerPos.y,
        playerSize,
        playerSize
    )
}

function checkForAllCollisions(type) {
    // checks for collisions between the player and all objects of the given type
    // returns true if there is a collision, false otherwise
    if (type === 'rectangles') {
        for (let i = 0; i < objects[type].length; i++) {
            if (checkForPlayerCollision(objects[type][i]) === 'normal') {
                return true;
            }
        }
    }
    else if (type === 'spikes') {
        for (let i = 0; i < objects[type].length; i++) {
            if (checkForPlayerCollision(objects[type][i]) === 'normal') {
                return true;
            }
        }
    }
    else {
        throw new Error('checkForAllCollisions: type ' + type + ' is not a valid shape name');
    }
    return false;
}

function checkForAllElevatorCollisions() {
    // checks for collisions between the player and all elevator objects
    // returns true if there is a collision, false otherwise
    var elevators = getElevators();
    for (let i = 0; i < elevators.length; i++) {
        if (checkForPlayerCollision(elevators[i]) === 'elevator') {
            return true;
        }
    }
    return false;
}

function checkForCollision(object, x, y, height, length) {
    // checks for collisions between the given object
    // and a rectangle with the given dimensions. 
    // returns one of three strings:
    // 'none' - no collision
    // 'normal' - normal collision
    // 'elevator' - collision with an elevator
    collisionschecked++;
    if (object.collide || object.elevator) {
        if (object.type === 'rectangles') {
            if (
                // warning: this is a mess. but it works somehow
                (x < object.endx && 
                x + length > object.startx) // x-axis
                &&
                ((-y).between(object.starty, object.endy) ||
                ((-y) - height).between(object.starty, object.endy) ||
                object.starty.between(-y, -y - height) ||
                object.endy.between(-y, -y - height)
                ) // y-axis
            ) {
                if (object.elevator) {
                    return 'elevator';
                }
                else {
                    return 'normal';
                }
            }
            else {
                return 'none';
            }
        }
        else if (object.type === 'spikes') {
            if (
                // check for individual points on triangle
                (object.points[0][0].between(x, x + length) &&
                object.points[0][1].between(-y, -y - height))
                ||
                (object.points[1][0].between(x, x + length) &&
                object.points[1][1].between(-y, -y - height)) 
                ||
                (object.points[2][0].between(x, x + length) &&
                object.points[2][1].between(-y, -y - height))
            ) {
                return 'normal';
            }
            else if (
                // check if individual corners of the player are inside the triangle
                pointInTriange(
                    [x, -y],
                    [object.points[0][0], object.points[0][1]], 
                    [object.points[1][0], object.points[1][1]], 
                    [object.points[2][0], object.points[2][1]]
                ) ||
                pointInTriange(
                    [x + length, -y],
                    [object.points[0][0], object.points[0][1]],
                    [object.points[1][0], object.points[1][1]],
                    [object.points[2][0], object.points[2][1]]
                ) ||
                pointInTriange(
                    [x, -y - height],
                    [object.points[0][0], object.points[0][1]],
                    [object.points[1][0], object.points[1][1]],
                    [object.points[2][0], object.points[2][1]]
                ) ||
                pointInTriange(
                    [x + length, -y - height],
                    [object.points[0][0], object.points[0][1]],
                    [object.points[1][0], object.points[1][1]],
                    [object.points[2][0], object.points[2][1]]
                )
            ) {
                return 'normal';
            }
            else {
                return 'none';
            }
        }
        else {
            throw new Error('Failed to do collision check, object has type ' + object.type + ' which is invalid');
        }
    }
    else {
        return 'none';
    }
}

function drawPlayer() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = '#3366ff';
    ctx.fillRect(canvas.width / 2, canvas.height / 2, playerSize, playerSize);
}

function gravity() {
    if (gravityData.on) {
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
                //              The return value is used to tell the game loop to turn off gravity this tick.
            }
        }
        resolve(false); // player didn't use an elevator.
    });
}

async function jump() {
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

async function mainloop() {
    // main processing loop. does not draw the screen. 
    // check for any key presses, and do stuff based on them.
    let oldX = playerPos.x;
    let oldY = playerPos.y;
    if (keydata.any) {
        if (keydata.arrows.up && !jumping) {
            jumping = true;
            await jump();
            jumping = false;
        }
        else if (keydata.arrows.left) {
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
    if (await elevator()) { 
        gravityData.on = false;
    }
    else {
        gravityData.on = true;
    }
    gravity();
    // kill the player if it's touching a spike
    if (checkForAllCollisions("spikes")) {
        playerPos.x = 0;
        playerPos.y = 0;
        gravityData.active = true;
    }
    // finally, after all movement has been processed, delete and add blocks
    // based off of the player's new position.
    removeOffScreenObjects();
    if (playerPos.x !== oldX || playerPos.y !== oldY) {
        /* 
            WARNING: The following code is quite messy.
            Basically what is does, is calculates where
            new spaces have to be generated, based on which
            direction the player moved.
        */
        // console.log(playerPos, oldX, oldY);
        if (playerPos.x > oldX) {
            // moved right
            for (
                let i = (Math.floor(playerPos.x / 50) * 50) + (canvas.width / 2), ii = i;
                i < ii + 300;
                i += 50) {
                for (
                    let j = (Math.floor(playerPos.y / 50) * 50) + (canvas.height / 2), jj = j;
                    j > jj - 600;
                    j -= 50
                ) {
                    generateSpace(i, j);
                }
            }
            addTypesToObjects();
        }
        if (playerPos.x < oldX) {
            // moved left
            for (
                let i = (Math.floor(playerPos.x / 50) * 50) - (canvas.width / 2), ii = i;
                i > ii - 300;
                i -= 50) {
                for (
                    let j = (Math.floor(playerPos.y / 50) * 50) + (canvas.height / 2), jj = j;
                    j > jj - 600;
                    j -= 50
                ) {
                    generateSpace(i, j);
                }
            }
            addTypesToObjects();
        }
        if (playerPos.y > oldY) {
            // moved down
            for (
                let i = (Math.floor(playerPos.x / 50) * 50) - (canvas.width / 2) - 300, ii = i;
                i < ii + 1400;
                i += 50) {
                for (
                    let j = (Math.floor(-playerPos.y / 50) * 50) - (canvas.height / 2), jj = j;
                    j > jj - 300;
                    j -= 50
                ) {
                    generateSpace(i, j);
                }
            }
            addTypesToObjects();
        }
        if (playerPos.y < oldY) {
            // moved up
            for (
                let i = (Math.floor(playerPos.x / 50) * 50) - (canvas.width / 2) - 300, ii = i;
                i < ii + 1400;
                i += 50) {
                for (
                    let j = (Math.floor(-playerPos.y / 50) * 50) + (canvas.height / 2), jj = j;
                    j < jj + 300;
                    j += 50
                ) {
                    generateSpace(i, j);
                }
            }
            addTypesToObjects();
        }
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
for (let i = -1000; i < 1000; i += 50) {
    for (let j = -1000; j < 1000; j += 50) {
        generateSpace(j, i);
    }
}
addCoordsToSpikeObjects();
addTypesToObjects();
fixColorsOnElevators();

// draw the initial frame
background(playerPos.x % 100, playerPos.y % 100);
drawObjects('rectangles');
drawObjects('spikes');
drawObjects('circles');
drawPlayer();

// start the main loops
drawloop();
processloop();
fpsloop();

// holy crap, javascript is really annoying sometimes.
