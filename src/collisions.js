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
    else if (type === 'spikes') {
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

function checkForAllElevatorCollisions() {
    // checks for collisions between the player and all rectangle objects
    // with the `elevator` property set to true. 
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
                // check if each point in the current triangle
                // collides with the rectangle
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
    let circleSize = time - mspt * headstart;
    if (
        distanceToOrgin(playerPos.x, playerPos.y) < circleSize ||
        distanceToOrgin(playerPos.x + playerSize, playerPos.y) < circleSize ||
        distanceToOrgin(playerPos.x, playerPos.y + playerSize) < circleSize ||
        distanceToOrgin(playerPos.x + playerSize, playerPos.y + playerSize) < circleSize
    ) {
        return true;
    }
    else {
        return false;
    }
}