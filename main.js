var playerPos = {
    "x": 0,
    "y": 0
};

var playerSpeed = 6;
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
var objects = {
    "rectangles": [
        {
            "startx": -100,
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
        }
    ]
};

Number.prototype.between = function(a, b) {
    var min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
    return this > min && this < max;
};

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

function drawObjects(type) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
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

function checkForCollisions(type) {
    for (let i = 0; i < objects[type].length; i++) {
        if (objects[type][i].collide) {
            let currentObject = objects[type][i];
            if (
                // warning: this is a mess
                (((playerPos.x) < currentObject.endx) && 
                (playerPos.x + playerSize) > currentObject.startx) // x-axis
                &&
                ((-playerPos.y).between(currentObject.starty, currentObject.endy) ||
                ((-playerPos.y) - playerSize).between(currentObject.starty, currentObject.endy) ||
                currentObject.starty.between(-playerPos.y, -playerPos.y - playerSize) ||
                currentObject.endy.between(-playerPos.y, -playerPos.y - playerSize)
                ) // y-axis

            ) {
                console.log("Collision detected " + currentObject.color);
                return true;
            }
        }
    }
    return false;
}

function drawPlayer() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = '#3366ff';
    ctx.fillRect(canvas.width/2, canvas.height/2, playerSize, playerSize);

}

function gravity() {
    playerPos.y += playerSpeed;
    if (checkForCollisions("rectangles")) {
        playerPos.y -= playerSpeed;
        while (!checkForCollisions("rectangles")) {
            playerPos.y += 1;
        }
    }
}

function mainloop() {

    // check for any key presses, and do stuff based on them.
    if (keydata.any) {
        let oldX = playerPos.x;
        let oldY = playerPos.y;
        if (keydata.arrows.up) {
            playerPos.y -= playerSpeed;
            if (checkForCollisions("rectangles")) {
                playerPos.y = oldY;
                while (!checkForCollisions("rectangles")) {
                    playerPos.y -= 1;
                }
                playerPos.y ++; // for some reason the while loop makes this
                                // one too low, locking the player in place.
                                // so this makes the value as it should be.
            }
        }
        else if (keydata.arrows.down) {
            playerPos.y += playerSpeed;
            if (checkForCollisions("rectangles")) {
                playerPos.y = oldY;
                while (!checkForCollisions("rectangles")) {
                    playerPos.y += 1;
                }
                playerPos.y --;
            }
        }
        else if (keydata.arrows.left) {
            playerPos.x -= playerSpeed;
            if (checkForCollisions("rectangles")) {
                playerPos.x = oldX;
                while (!checkForCollisions("rectangles")) {
                    playerPos.x -= 1;
                }
                playerPos.x ++; 
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
    // gravity();

    // draw the screen!
    background(playerPos.x % 100, playerPos.y % 100);
    drawObjects("rectangles");
    drawPlayer();
}


// key event handlers
document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowLeft") {
        keydata.any = true;
        keydata.arrows.left = true;
    }
    else if (event.code === "ArrowUp") {
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
    else if (event.code === "ArrowUp") {
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

background(playerPos.x % 100, playerPos.y % 100);
drawObjects("rectangles");
drawPlayer();

// Main Loop!
async function main() {
    while (true) {
        mainloop();
        await wait(30);
    }
}

main();
