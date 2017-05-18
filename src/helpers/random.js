/**
 * @desc Returns a pseudo-random number in the provided range
 * @param {number} from Integer number indicating lower bound. Inclusive.
 * @param {number} to Integer number indicating upper bound. Exclusive.
 * @returns {number} Integer number between lower bound (inclusive) and upper bound (exclusive)
 */
function randRange(from, to) {
    var result = parseInt((to - from) * Math.random() + from);

    return result === to ? result - 1 : result;
}

/**
 * @description Returns a pseudo-random number. Alias for Math.random()
 * @returns {number} Floating point number in range 0 (inclusive) to 1 (exclusive)
 */
function random() {
    return Math.random();
}

export default { randRange, random };