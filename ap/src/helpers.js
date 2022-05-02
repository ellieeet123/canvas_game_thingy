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

function distanceToOrgin(x, y) {
    // returns the shortest possible distance between a point and the origin
    // by using the Pythagorean theorem
    return Math.sqrt(x * x + y * y);
}

function setScoreCookie(value) {
    // sets a cookie for the player's high score.
    let dateObject = new Date();
    dateObject.setTime(1e15); // make sure it doesn't expire any time soon
    let dateString = dateObject.toUTCString();
    document.cookie = 'highscore=' + value + ';' + ';expires=' + dateString;
}

function getHighScore() {
    // returns the player's high score from a cookie.
    let cookieString = decodeURIComponent(document.cookie);
    let startIndex = cookieString.indexOf('=');
    let endIndex = cookieString.indexOf(';');
    return cookieString.substring(startIndex, endIndex)
}

function stopGame() {
    gameRunning = false;
}
