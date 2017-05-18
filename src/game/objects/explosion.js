import Random from 'Helpers/random.js';
import ExplosionRender from 'Graphics/render/explosionRender.js';

/**
 * @description Class for explosion object, which handles its position, angle and expiration
 * @param {object} initialPosition 2D position object { x, y }, describing position of the explosion  
 */
export default function Explosion(initialPosition) {
    var self = this;

    var position = { x: initialPosition.x, y: initialPosition.y };
    var angle = Random.random() * Math.PI;

    var renderer = new ExplosionRender(self);

    self.isExpired = isExpired;

    self.getPosition = getPosition;
    self.getAngle = getAngle;

    self.render = renderer.render;

    /**
     * @description Returns explosion 2D position
     * @returns {object} Returns object with two fields: x (number) and y (number)
     */
    function getPosition() {
        return position;
    }

    /**
     * @description Returns explosion angle
     * @returns {number} Number in range [0, Math.PI]
     */
    function getAngle() {
        return angle;
    }

    /**
     * @description Checks if explosion animation ended i.e. explosion itself is expired
     * @returns {boolean} Boolean flag
     */
    function isExpired() {
        return renderer.isFinished();
    }
}