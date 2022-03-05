// generating function


function generateSpace(x, y) {
    // generates all of the objects that start in a 600x600 square
    // originating at x, y.
    if (x % 300 === 0 && y % 300 === 0) { // make sure the location is valid
        var seed = base_rng_seed + x + y; // generate a seed based on the location
        // check if a number has already been generated from that seed, 
        // and if it hasn't then generate it
        if (rngData[seed] === undefined) {
            rngData[seed] = random(seed, 2 ** 36);
            // the number will have 36 bits, as the square that's being
            // generated is a 6x6 square on screen (300x300 pixels)
        }
        var number = rngData[seed];

        var numberStr = number.toString();
        var binary = number.toString(2);
        if (binary.length < 36) { // 36 is the highest number of bits that can appear in the binary string
            binary = '0'.repeat(36 - binary.length) + binary;
        }
        var platformLocations = findAllIndexesOf(binary, '111');
        var newx, newy, blockLength, color;
        for (let i = 0; i < platformLocations.length; i++) {
            newx = x + (platformLocations[i] % 6) * 50;
            newy = y + Math.floor(platformLocations[i] / 6) * 50;
            blockLength = Number(numberStr[i % numberStr.length]) * 25;
            if (blockLength < 100) {
                blockLength = 100;
            }
            color = colors.rectanglesNormal[Number(numberStr[1])];
            objects.rectangles.push(
                {
                    "startx": newx,
                    "starty": newy - 20,
                    "endx": newx + blockLength,
                    "endy": newy,
                    "color": color,
                    "collide": true
                }
            )
            if (numberStr[i % numberStr.length] === '5') {
                objects.rectangles.push(
                    {
                        "startx": newx + blockLength / 2 - 10,
                        "starty": newy ,
                        "endx": newx +  blockLength / 2 + 10,
                        "endy": newy + 300,
                        "color": color + '88',
                        "collide": false,
                        "elevator": true
                    }
                )
            }
        }
        var elevators = getElevators();
        for (let i = 0; i < elevators.length; i++) {
        }
    }
    else {
        throw new Error('Unable to generate spaces at ' + x + ', ' + y + '. Location not divisible by 300.');
    }
}
