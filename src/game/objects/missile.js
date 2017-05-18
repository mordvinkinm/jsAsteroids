import GameConstants from 'Game/gameConstants.js';
import MissileRender from 'Graphics/render/missileRender.js';

/**
 * @description Class for missile object, which handles its position, velocity and angle
 * @param {object} initialPosition 2D position object { x, y } describing spawn position of the missile
 * @param {object} initialVelocity 2D vector objectd { x, y } describing velocity of the missile
 * @param {number} initialAngle Initial angle of the missile, number from [0, Math.PI] range
 */
export default function Missile(initialPosition, initialVelocity, initialAngle) {
    var self = this;

    var position = { x: initialPosition.x, y: initialPosition.y };
    var velocity = { x: initialVelocity.x, y: initialVelocity.y };
    var angle = initialAngle;
    var lifespan = GameConstants.MISSILE_LIFETIME;

    self.processTick = processTick;

    self.getPosition = getPosition;
    self.getAngle = getAngle;
    self.isExpired = isExpired;
    self.getRadius = getRadius;

    self.render = new MissileRender(self).render;

    /**
     * @description Process game tick, i.e. update self-position and lifetime values
     */
    function processTick() {
        position.x += velocity.x;
        position.y += velocity.y;

        lifespan--;
    }

    /**
     * @description Get 2D position of the missile
     * @returns {object} Object with two fields: x (number) and y (number)
     */
    function getPosition() {
        return position;
    }

    /**
     * @description Get direction of the missile
     * @returns {number} Number in range [0, Math.PI]
     */
    function getAngle() {
        return angle;
    }

    /**
     * @description Check if missile is expired (i.e. it's lifetime has ended) or not;
     *              Does NOT check position of a missile on screen (i.e. if it is out of bounds or not)
     * @returns {boolean} Flag indication if missile is alive or not
     */
    function isExpired() {
        return lifespan <= 0;
    }

    /**
     * @description Get physical radius of a missile
     * @returns {number} Half of missile's side
     */
    function getRadius() {
        return GameConstants.MISSILE_RADIUS;
    }
}