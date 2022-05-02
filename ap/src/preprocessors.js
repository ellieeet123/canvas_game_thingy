// stuff to do before the main loops start

function addTypesToObjects() {
    // adds a type attribute to each object, based on the list that it's in (rectangles, circles)
    for (let i = 0; i < objects.rectangles.length; i++) {
        objects.rectangles[i].type = 'rectangles';
    }
    for (let i = 0; i < objects.circles.length; i++) {
        objects.circles[i].type = 'circles';
    }
}

// key event handlers
function addKeyEventListeners() {
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
