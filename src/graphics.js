// functions that draw stuff

// draw a checkerboard background. 
function background(offsetX, offsetY) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.onclick = () => {
        // make sure the game doesn't restart when clicking canvas
    }
    let count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#151515';

    // there are two loops here, one for each color. 
    // this is because for some reason I've found
    // `ctx.fillStyle = color` takes significantly longer
    // than just drawing a normal square, so the less
    // that the fillStyle is changed, the better.

    // draw all the lighter squares
    for (let i = -150; i < canvas.width + 100; i += 50) {
        for (let j = -150; j < canvas.height + 100; j += 50) {
            if (count % 2 === 0) {
                ctx.fillRect(i - offsetX, j - offsetY, 50, 50);
            }
            count++;
        }
    }
    count = 0;
    ctx.fillStyle = '#1a1a1a';
    // draw all the darker squares
    for (let i = -150; i < canvas.width + 100; i += 50) {
        for (let j = -150; j < canvas.height + 100; j += 50) {
            if (count % 2 === 1) {
                ctx.fillRect(i - offsetX, j - offsetY, 50, 50);
            }
            count++;
        }
    }
}

function drawCounter(value) {
    // draws a counter in the top right corner
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = '#ffffff';
    ctx.font = '80px Arial';
    ctx.fillRect(canvas.width - 90, 10, 80, 80);
    ctx.fillStyle = '#000000';
    ctx.fillText(value, canvas.width - 80, 80);
}

/*  `type` can be one of the following:
    - rectangles
    - spikes
*/
function drawObjects(type) {
    // draws all objects on the screen of the given type. 
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    if (type === 'rectangles') {
        for (let i = 0; i < objects[type].length; i++) {
            // first draw all of the normal platforms
            if (!objects[type][i].bottomBarrier) {
                ctx.fillStyle = objects[type][i].color;
                // calculate the actual position on the canvas based on player pos
                let startXCor = (canvas.width  / 2) + (-(cameraPos.x)) + objects[type][i].startx;
                let startYCor = (canvas.height / 2) + (-(cameraPos.y)) + (-(objects[type][i].starty));
                let endXCor   = (canvas.width  / 2) + (-(cameraPos.x)) + objects[type][i].endx;
                let endYCor   = (canvas.height / 2) + (-(cameraPos.y)) + (-(objects[type][i].endy));
                ctx.fillRect(
                    startXCor,
                    startYCor,
                    endXCor - startXCor,
                    endYCor - startYCor
                );
            }
        }
        for (let i = 0; i < objects[type].length; i++) {
            // then draw all of the bottom barriers, so that they are on top of the platforms
            if (objects[type][i].bottomBarrier) {
                ctx.fillStyle = objects[type][i].color;
                // calculate the actual position on the canvas based on player pos
                let startXCor = (canvas.width  / 2) + (-(cameraPos.x)) + objects[type][i].startx;
                let startYCor = (canvas.height / 2) + (-(cameraPos.y)) + (-(objects[type][i].starty));
                let endXCor   = (canvas.width  / 2) + (-(cameraPos.x)) + objects[type][i].endx;
                let endYCor   = (canvas.height / 2) + (-(cameraPos.y)) + (-(objects[type][i].endy));
                ctx.fillRect(
                    startXCor,
                    startYCor,
                    endXCor - startXCor,
                    endYCor - startYCor
                );
            }
        }
    }
    else if (type === 'spikes') {
        for (let i = 0; i < objects[type].length; i++) {
            ctx.fillStyle = objects[type][i].color;
            // calculating actual position on canvas
            let x1 = (canvas.width  / 2) + (-(cameraPos.x)) +    objects[type][i].points[0][0];
            let y1 = (canvas.height / 2) + (-(cameraPos.y)) + (-(objects[type][i].points[0][1]));
            let x2 = (canvas.width  / 2) + (-(cameraPos.x)) +    objects[type][i].points[1][0];
            let y2 = (canvas.height / 2) + (-(cameraPos.y)) + (-(objects[type][i].points[1][1]));
            let x3 = (canvas.width  / 2) + (-(cameraPos.x)) +    objects[type][i].points[2][0];
            let y3 = (canvas.height / 2) + (-(cameraPos.y)) + (-(objects[type][i].points[2][1]));
            // draw triangles
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.fill();
        }
    }
    // circles are currently just for decoration and have no
    // functional purposes. 
    else if (type === 'circles') {
        for (let i = 0; i < objects[type].length; i++) {
            ctx.fillStyle = objects[type][i].color;
            // calculating actual position on canvas
            let x = (canvas.width  / 2) + (-(cameraPos.x)) +    objects[type][i].x;
            let y = (canvas.height / 2) + (-(cameraPos.y)) + (-(objects[type][i].y));
            let r = objects[type][i].radius;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    else {
        throw new Error(`drawObjects: type ${type} is not a valid shape name`);
    }
}

function drawPlayer() {
    // draws the player
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = '#3366ff';
    // calculate the actual position on the canvas based on player pos
    let x = (canvas.width  / 2) + -cameraPos.x + playerPos.x;
    let y = (canvas.height / 2) + -cameraPos.y + playerPos.y;
    ctx.fillRect(x, y, playerSize, playerSize);
}

function drawGameOver() {
    // `domtoimage` is an open source library that converts a DOM node
    // to an image. The source code is loacted at https://github.com/tsayen/dom-to-image 
    // and it is licenced under the MIT licence (https://opensource.org/licenses/MIT)
    let canvas = document.getElementById('canvas');
    let screen = document.createElement('div');
    canvas.onclick = () => {
        // restart when the player clicks the canvas
        startGame(new Date().toString(), 1.5);
    }
    screen.innerHTML = 
    '<span style="font-family:monospace; font-size: 40px; color: white">' +
    '<p>Game Over</p>' +
    '<p>Score: ' + Math.floor(distanceToOrgin(playerPos.x, playerPos.y)) + '</p>' + 
    '<p>Click anywhere to play again</p>' + 
    '</span>';
    domtoimage.toSvg(
        screen, 
        {
            width: canvas.width,
            height: canvas.height
        }
    ).then(dataurl => {
            var img = new Image();
            img.src = dataurl;
            let canvas = document.getElementById("canvas");
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = '#000000aa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 80, 40);
        }
    );
}
