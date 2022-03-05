// stuff to do before the main loops start


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

// key event handlers
function addKeyEventListeners(){
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
}
