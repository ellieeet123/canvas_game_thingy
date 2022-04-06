// generating function

function generateLineData(seed) {
    var numbers = random(seed, 100, 10);
    var availibleNumbers = random(seed + ' ', 1000, 150);
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
        freeSpikeDensity,
        blockWidth,
        blockHeight,
        color;
    var output = {};
    output.seed = seed; // initial seed
    output.numbers = numbers; // seeds after running through PRNG
    output.availibleNumbers = availibleNumbers;
    // availibleNumbers will be accessed during actual block generation

    if (numbers[numbers.length] > generatorConfig.lineChance) {
        // if the last number is greater than the line chance,
        // then no line will be generated.
        output.line = false;
        return output;
    }
    output.line = true;

    // whether the line will go towards the left or to the right.
    if (numbers[0] < generatorConfig.rightChance) {
        direction = 'right';
    }
    else {
        direction = 'left';
    }
    output.direction = direction;

    // the slope of the line
    if (numbers[1] < generatorConfig.smallSlopeChance) {
        slope = numbers[2] / (100 / (1 - generatorConfig.minSlope)) + generatorConfig.minSlope;
    }
    else {
        slope = numbers[2] / (100 / (1 - generatorConfig.maxSlope)) + generatorConfig.maxSlope;
    }
    output.slope = slope.toFixed(2);

    // the length of the line
    length = numbers[3] / (100 / (generatorConfig.maxLength - generatorConfig.minLength)) + generatorConfig.minLength;
    output.length = Math.floor(length);

    // how dence the distribution of blocks will be
    blockDensity = numbers[4] / (100 / (generatorConfig.maxBlockDensity - generatorConfig.minBlockDensity)) + generatorConfig.minBlockDensity;
    output.blockDensity = blockDensity.toFixed(2);

    // thickness of the line
    thickness = numbers[5] / (100 / (generatorConfig.maxLineHeight - generatorConfig.minLineHeight)) + generatorConfig.minLineHeight;
    output.thickness = Math.floor(thickness);

    // chance of each block being outlined in spikes
    spikedBlockChance = numbers[6] / (100 / (generatorConfig.maxSpikeBlockChance - generatorConfig.minSpikeBlockChance)) + generatorConfig.minSpikeBlockChance;
    output.spikedBlockChance = spikedBlockChance.toFixed(2);

    // how dence the distribution of free spikes will be
    freeSpikeDensity = numbers[7] / (100 / (generatorConfig.maxRandomSpikeChance - generatorConfig.minRandomSpikeChance)) + generatorConfig.minRandomSpikeChance;
    output.freeSpikeDensity = freeSpikeDensity.toFixed(2);

    // width of the blocks
    blockWidth = numbers[8] / (100 / (generatorConfig.maxBlockWidth - generatorConfig.minBlockWidth)) + generatorConfig.minBlockWidth;
    output.blockWidth = Math.floor(blockWidth);

    // height of the blocks. This is constant for all blocks.
    output.blockHeight = blockHeight = generatorConfig.blockHeight;

    // color of the line
    color = generatorConfig.colors.rectanglesNormal[numbers[8] % generatorConfig.colors.rectanglesNormal.length];
    output.color = color;
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
        if (lineData[seed] === undefined) {
            lineData[seed] = generateLineData(seed);
        }
        var data = lineData[seed];
        if (data.line) {
            var startx, starty;
            if (data.direction === 'right') {
                for (let i = 0; i < Math.floor(data.blockDensity); i++) {
                    startx = Math.floor (
                        x + data.availibleNumbers[i * 10 + 0] / (
                            1000 / (data.length - generatorConfig.minLength) + generatorConfig.minLength
                        )
                    );
                    block = {
                        "color": data.color,
                        "startx": startx,
                        "starty":
                            Math.floor(
                                y
                                /*
                                y + data.availibleNumbers[i * 10 + 1] / (
                                    100 / (data.thickness - generatorConfig.minLineHeight) + generatorConfig.minLineHeight
                                ) + data.slope * (
                                    x + data.availibleNumbers[i * 10 + 2] / (
                                        100 / (data.length - generatorConfig.minLength) + generatorConfig.minLength
                                    )
                                )
                                */
                            ),
                        "endx":
                            Math.floor(
                                startx + 200
                            ),
                        "endy":
                            Math.floor(
                                y + data.blockHeight
                            ),
                        "collide": true,
                        "elevator": false
                    };
                    objects.rectangles.push(block);
                }
            } else {
                // left

            }
        }
        /*
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
        }*/
    }
    else {
        throw new Error(`Unable to generate spaces at ${x}, ${y}. Location not divisible by 300.`);
    }
}
