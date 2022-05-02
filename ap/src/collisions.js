// collision detection and related stuff

function checkForPlayerCollision(object) {
    // an easier way of checking for a player collision,
    // without having to add all 5 args each time.
    // simply checks for a collision between the given
    // object, and a rectangle the size of the player. 
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
    else {
        // give an error message if an invalid name is passed to the function
        throw new Error(`checkForAllCollisions: type ${type} is not a valid shape name`);
    }
    return false;
}

function checkForCollision(object, x, y, height, length) {
    // checks for collisions between the given object
    // and a rectangle with the given dimensions. 
    // returns one of two strings:
    // 'none' - no collision
    // 'normal' - normal collision
    collisionschecked++;
    if (object.collide) {
        if (object.type === 'rectangles') {
            if (
                (x < object.endx && 
                x + length > object.startx) // x-axis
                &&
                ((-y).between(object.starty, object.endy) ||
                ((-y) - height).between(object.starty, object.endy) ||
                object.starty.between(-y, -y - height) ||
                object.endy.between(-y, -y - height)
                ) // y-axis
            ) {
                return 'normal';
            }
            else {
                return 'none';
            }
        }
        else {
            throw new Error(
                `Failed to do collision check, object has type ${object.type} which is invalid`
            );
        }
    }
    else {
        return 'none';
    }
}

function checkForDeath() {
    // returns true if the player is within the ever expanding circle of death
    // returns false otherwise
    let circleSize = (time - mspt * headstart) * difficulty;
    if (
        distanceToOrgin(playerPos.x, playerPos.y) < circleSize ||
        distanceToOrgin(playerPos.x + playerSize, playerPos.y) < circleSize ||
        distanceToOrgin(playerPos.x, playerPos.y - playerSize) < circleSize ||
        distanceToOrgin(playerPos.x + playerSize, playerPos.y - playerSize) < circleSize
    ) {
        return true;
    }
    else {
        return false;
    }
}
