// misc helper functions

/*  returns true if a number is between two values. 
    for example: 
    8.between(2, 12)
    -> true
    8.between(10, 20)
    -> false
*/
Number.prototype.between = function(firstNum, secondNum) {
    return (
        this > Math.min(firstNum, secondNum) &&
        this < Math.max(firstNum, secondNum)
    );
}

async function wait(ms) {
    // waits for a given number of milliseconds
    return new Promise(
        function(resolve) {
            window.setTimeout(resolve, ms)
        }
    );
}

/*  !!! NOT ORIGINAL CODE !!!
    Code Snippit written by StackOverflow user Grumdrig.
    Link to profile:       https://stackoverflow.com/users/167531/grumdrig
    Link to code snippit:  https://stackoverflow.com/a/9747983.

    Functions named vec, dot, and pointInTriangle are all
    from this same source. 
*/
function vec(from, to) {  
    return [to[0] - from[0], to[1] - from[1]];
}
function dot(u, v) {
    return u[0] * v[0] + u[1] * v[1];
}
function pointInTriange(P, A, B, C) {
    // returns true if a point is inside a triangle with vertices A, B, C
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

function random(seed, range, digits) {
    // returns a random number (or a list of them) from the UHEPRNG
    rngsGenerated++;
    var prng = uheprng();
    prng.initState();
    prng.hashString(seed);
    if (digits <= 1 || !digits) {
        return prng(range);
    }
    else {
        var output = [];
        for (let i = 0; i < digits; i++) {
            output.push(prng(range));
        }
        return output;
    }
}

function findAllIndexesOf(string, substring) {
    // returns an array of all indexes of a substring in a string
    var indexes = [];
    var i = -1;
    while (true) {
        i = string.indexOf(substring, i + 1);
        if (i === -1) {
            // no more substrings found
            break;
        } else {
            indexes.push(i);
        }
    }
    return indexes;
}

function fixColorsOnElevators() {
    // makes all elevator objects slightly transparent
    var elevators = getElevators();
    for (let i = 0; i < elevators.length; i++) {
        elevators[i].color = elevators[i].color + '77';
    }
}

function getElevators() {        
    // returns a list of all rectangles with the
    // `elevator` property set to true
    var elevators = [];
    for (let i = 0; i < objects.rectangles.length; i++) {
        if (objects.rectangles[i].elevator) {
            elevators.push(objects.rectangles[i]);
        }
    }
    return elevators;
}
