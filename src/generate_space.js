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
        color;
    var output = {};
    var seed_data = seed.split('_____');
    seed_data[1] = Number(seed_data[1]);
    seed_data[2] = Number(seed_data[2]);
    output.seed = seed; // initial seed
    output.numbers = numbers; // seeds after running through PRNG
    output.availibleNumbers = availibleNumbers;
    // availibleNumbers will be accessed during actual block generation

    if (
        ((seed_data[1] / 100) % 2 - ((seed_data[2] / 100 ) % 2)) === 0
    ) {
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

    // color of the line
    color = generatorConfig.colors.rectanglesNormal[numbers[8] % generatorConfig.colors.rectanglesNormal.length];
    output.color = color;
    return output;
}

function generateSpace(x, y) {
/* 
    Idea: Instead of block density, change it to block spacing,
    that way lines won't be too dense or too sparse.
*/

    // generates all of the objects that start in a 600x600 square
    // originating at x, y.
    if (x % 300 === 0 && y % 300 === 0) { // make sure the location is valid
        var seed = base_rng_seed + "_____" + x + "_____" + y; // generate a seed based on the location
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
            for (let i = 0; i < Math.floor(data.blockDensity); i++) {
                startx = Math.floor (
                    (x + data.length * data.slope * (i / data.blockDensity))
                    + (data.availibleNumbers[i] / (1000 / generatorConfig.crazyness))
                );
                if (data.direction === 'left' && data.slope > 0) {
                    data.slope = -data.slope;
                }
                starty = Math.floor (
                    data.slope * (startx + -x) + y
                );
                if (Math.abs(startx) < 150 && Math.abs(starty) < 150) {
                    continue;
                }
                block = {
                    "color": data.color,
                    "startx": startx,
                    "starty": starty,
                    "endx":
                        Math.floor(
                            startx + data.blockWidth
                        ),
                    "endy":
                        Math.floor(
                            starty + generatorConfig.blockHeight
                        ),
                    "collide": true,
                    "elevator": false
                };
                objects.rectangles.push(block);
            }
        }
        // todo, make all blocks that intersent with the lower border
        // be removed.
        objects.rectangles.push({
            "color": "#000000",
            "startx": x,
            "starty": Math.abs((0.8 * x)) - 1200,
            "endx": x + 600,
            "endy": Math.abs((0.8 * x)) - 2200,
            "collide": true,
            "bottomBarrier": true
        });
    }
    else {
        throw new Error(`Unable to generate spaces at ${x}, ${y}. Location not divisible by 300.`);
    }
}
