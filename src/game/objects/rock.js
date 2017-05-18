import Random from 'Helpers/random.js';
import Render from 'Graphics/render.js';
import RockRender from 'Graphics/render/rockRender.js';
import GameConstants from 'Game/gameConstants.js';

/**
 * @description Class for rock object, which handles its position and velocity
 * @param {object} initialPosition 2D position of the rock { x, y } describing spawn position of the rock
 * @param {object} initialVelocity 2D vector { x, y } describing initial velocity of the rock
 * @param {boolean} initialLarge Describes if rock is large (i.e. spawned) or small (produced by large rock explosion)
 */
export default function Rock(initialPosition, initialVelocity, initialLarge) {
    var self = this;

    var position = { x: initialPosition.x, y: initialPosition.y };
    var velocity = { x: initialVelocity.x, y: initialVelocity.y };
    var angle = Math.PI * Random.random();
    var large = initialLarge;

    self.processTick = processTick;

    self.getPosition = getPosition;
    self.getAngle = getAngle;
    self.isLarge = isLarge;
    self.getRadius = getRadius;

    self.render = new RockRender(self).render;

    /**
     * @description Processes game tick - update position of the rock
     */
    function processTick() {
        position.x += velocity.x;
        position.y += velocity.y;

        if (position.x > Render.getFieldWidth()) {
            position.x = 0;
        } else if (position.x < 0) {
            position.x = Render.getFieldWidth();
        }

        if (position.y > Render.getFieldHeight()) {
            position.y = 0;
        } else if (position.y < 0) {
            position.y = Render.getFieldHeight();
        }
    }

    /**
     * @description Get 2D positition of the rock
     * @returns {object} Object containing x (number) and y (number) properties
     */
    function getPosition() {
        return position;
    }

    /**
     * @description Get angle of a rock
     * @returns {number} A number in range of [0, Math.PI];
     */
    function getAngle() {
        return angle;
    }

    /**
     * @description Determines if rock is a large or a small one
     * @returns {boolean} Boolean flag
     */
    function isLarge() {
        return large;
    }

    /**
     * @description Gets physical radius of the rock depending on whether it is large or small
     * @returns {number} Positive number, half of either 90 or 45 (by default)
     */
    function getRadius() {
        return isLarge() ? GameConstants.LARGE_ROCK_RADIUS : GameConstants.SMALL_ROCK_RADIUS;
    }
}