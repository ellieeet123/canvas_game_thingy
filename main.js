var playerPos = {
    "x": 0,
    "y": 0
};

var playerSpeed = 8;
var playerSize = 50;
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
    for (let i = -150; i < canvas.width + 100; i += 50) {
        for (let j = -150; j < canvas.height + 100; j += 50) {
            "#eeeeee" == ctx.fillStyle ? ctx.fillStyle = "#cccccc" : ctx.fillStyle = "#eeeeee";
            ctx.fillRect(i - offsetX, j - offsetY, 50, 50);
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
                (((playerPos.x) <= currentObject.endx) && 
                (playerPos.x + playerSize) >= currentObject.startx) // x-axis
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
    gravity();
    background(playerPos.x, playerPos.y);
    drawObjects("rectangles");
    drawPlayer();
}

document.addEventListener("keydown", function(event) {
    let oldPos = playerPos;
    if (event.code === "ArrowLeft") {
        playerPos.x -= playerSpeed;
        if (checkForCollisions("rectangles")) {
            playerPos.x = oldPos.x;
            while (!checkForCollisions("rectangles")) {
                playerPos.x -= 1;
            }
        }
    }
    else if (event.code === "ArrowUp") {
        playerPos.y -= playerSpeed;
        if (checkForCollisions("rectangles")) {
            playerPos.y = oldPos.y;
            while (!checkForCollisions("rectangles")) {
                playerPos.y -= 1;
            }
        }
    }
    else if (event.code === "ArrowRight") {
        playerPos.x += playerSpeed;
        if (checkForCollisions("rectangles")) {
            playerPos.x = oldPos.x;
            while (!checkForCollisions("rectangles")) {
                playerPos.x += 1;
            }
        }
    }
    else if (event.code === "ArrowDown") {
        playerPos.y += playerSpeed;
        if (checkForCollisions("rectangles")) {
            playerPos.y = oldPos.y;
            while (!checkForCollisions("rectangles")) {
                playerPos.y += 1;
            }
        }
    }
    if (checkForCollisions("rectangles")) {
        playerPos = oldPos;
    }
    background(playerPos.x % 100, playerPos.y % 100);
    drawObjects("rectangles");
    drawPlayer();
});

background(0, 0);
drawObjects("rectangles");
drawPlayer();
