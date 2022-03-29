// generating function

function generateLineData(seed) {
    var numbers = random(seed, 100, 100);
    // numbers is a list of 100 rns. 
    // each part of generating the output object
    // should use a different number from this list.
    var 
        slope,
        direction, 
        length, 
        blockDensity, 
        thickness,
        spikedBlockChance,
        freeSpikesChance,
        color;
    var output = {};
    output.seed = seed; // initial seed
    output.numbers = numbers; // seeds after running through PRNG
    if (numbers[0] < generatorConfig.rightChance) {
        direction = 'right';
    }
    else {
        direction = 'left';
    }
    output.direction = direction;
    if (numbers[1] < generatorConfig.smallSlopeChance) {
        slope = numbers[2] / (100 / (1 - generatorConfig.minSlope)) + generatorConfig.minSlope;
    }
    else {
        slope = numbers[2] / (100 / (1 - generatorConfig.maxSlope)) + generatorConfig.maxSlope;
    }
    output.slope = slope.toFixed(2);
    length = numbers[3] / (100 / (generatorConfig.maxLength - generatorConfig.minLength)) + generatorConfig.minLength;
    output.length = Math.floor(length);
    blockDensity = numbers[4] / (100 / (generatorConfig.maxBlockDensity - generatorConfig.minBlockDensity)) + generatorConfig.minBlockDensity;
    output.blockDensity = blockDensity.toFixed(2);

    return output;
}

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

        if (lineData[seed] === undefined) {
            lineData[seed] = generateLineData(seed);
        }
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
            color = generatorConfig.colors.rectanglesNormal[Number(numberStr[1])];
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
