/**
 * @description Converts angle and radius to 2D vector
 * @param {number} ang Angle in range [0, Math.PI]
 * @param {number} [r=1] Radius. A positive number
 * @returns {object} 2D object with fields { x, y }, both numeric
 */
function angleToVector(ang, r) {
    r = r || 1;

    return {
        x: r * Math.cos(ang),
        y: r * Math.sin(ang)
    };
}

/**
 * @description Calculates distance between two 2D points
 * @param {object} p First point
 * @param {object} q Second point. Default {0, 0} if not provided
 * @return {number} Floating-point number
 */
function dist(p, q) {
    if (!q) {
        q = { x: 0, y: 0 };
    }

    return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));
}

export default { angleToVector, dist };