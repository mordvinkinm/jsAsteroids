import GameConstants from 'Game/gameConstants.js';
import Geometry from 'Helpers/geometry.js';
import Render from 'Graphics/render.js';
import ShipRender from 'Graphics/render/shipRender.js';

/**
 * @description Class for ship object, which handles its position, actions and properties
 * @param {object} initialPosition 2D position of the ship {x, y} describing spawn position of the ship
 * @param {object} initialVelocity 2D vector {x, y} describing initial velocity of the ship
 * @param {number} initialAngle Describes initial angle for the ship in range [0, Math.PI]
 */
export default function Ship(initialPosition, initialVelocity, initialAngle) {
    var self = this;

    var position = initialPosition;
    var velocity = initialVelocity;
    var thrust = false;
    var shooting = false;
    var angle = initialAngle;
    var angleVelocity = 0;
    var invulnerabilityTime = GameConstants.RESPAWN_INVULNERABILITY;

    self.getPosition = getPosition;
    self.getRadius = getRadius;
    self.getAngle = getAngle;
    self.getVelocity = getVelocity;
    self.getSpeed = getSpeed;

    self.startTurningLeft = startTurningLeft;
    self.startTurningRight = startTurningRight;
    self.stopTurning = stopTurning;

    self.startThrusting = startThrusting;
    self.stopThrusting = stopThrusting;
    self.isThrusting = isThrusting;

    self.isShooting = isShooting;
    self.startShooting = startShooting;
    self.stopShooting = stopShooting;

    self.getRemainingInvulnerability = getRemainingInvulnerability;
    self.makeInvulnerable = makeInvulnerable;
    self.isInvulnerable = isInvulnerable;

    self.processTick = processTick;

    self.render = new ShipRender(self).render;

    /**
     * @description Get 2D position of the ship
     * @returns {object} Object with x (number) and y (number) properties
     */
    function getPosition() {
        return position;
    }

    /**
     * @description Get radius of the ship
     * @returns {number} Radius of the ship
     */
    function getRadius() {
        return GameConstants.SHIP_RADIUS;
    }

    /**
     * @description Gets speed of the ship
     * @returns {number} Non-negative number
     */
    function getSpeed() {
        return Math.sqrt(Math.pow(velocity.x, 2.0) + Math.pow(velocity.y, 2.0));
    }

    /**
     * @description Set angle velocity for the ship (counter-clockwise)
     */
    function startTurningLeft() {
        angleVelocity = -Math.PI * GameConstants.SHIP_TURNING_COEF;
    }

    /**
     * @description Set angle velocity for the ship (clockwise)
     */
    function startTurningRight() {
        angleVelocity = Math.PI * GameConstants.SHIP_TURNING_COEF;
    }

    /**
     * @description Set angle velocity of the ship to zero
     */
    function stopTurning() {
        angleVelocity = 0;
    }

    /**
     * @description Check if ship is currently shooting or not
     * @returns {boolean} Boolean flag
     */
    function isShooting() {
        return shooting;
    }

    /**
     * @description Starts shooting. Does nothing but sets flag to true;
     *              Object manager will spawn (or not) missles by itself looking at this flag.
     */
    function startShooting() {
        shooting = true;
    }

    /**
     * @description Stops shooting. Does nothing but sets flag to false;
     *              Object manager will spawn (or not) missiles by itself looking at this flag.
     */
    function stopShooting() {
        shooting = false;
    }

    /**
     * @description Starts thrusting. Does nothing but sets flag to true;
     *              Ship itself will look at this flag and update acceleration/velocity accordingly in processTick method.
     */
    function startThrusting() {
        thrust = true;
    }

    /**
     * @description Stops thrusting. Does nothing but sets flag to false;
     *              Ship itself will look at this flag and update acceleration/velocity accordingly in processTick method.
     */
    function stopThrusting() {
        thrust = false;
    }

    /**
     * @description Checks if ship is currently thrusting or not
     * @returns {boolean} Boolean flag
     */
    function isThrusting() {
        return !!thrust;
    }

    /**
     * @description Get angle of the ship
     * @returns {number} Nuber in range [0, Math.PI]
     */
    function getAngle() {
        return angle;
    }

    /**
     * @description Get velocity vector of the ship
     * @returns {object} Velocity vector with { x, y } fields
     */
    function getVelocity() {
        return velocity;
    }

    /**
     * @description Get remaining invulnerability time. We need it only for rendering purpose, i.e. to emulate ship blinking
     * @returns {number} Number of remaining "game ticks"
     */
    function getRemainingInvulnerability() {
        return invulnerabilityTime;
    }

    /**
     * @description Set ship invulnerable for a limited period (defined in constants)
     */
    function makeInvulnerable() {
        invulnerabilityTime = GameConstants.RESPAWN_INVULNERABILITY;
    }

    /**
     * @description Check if ship is invulnerable after respawn or not
     * @returns {boolean} Boolean flag
     */
    function isInvulnerable() {
        return invulnerabilityTime > 0;
    }

    /**
     * @description Process "game tick" for the ship - update position, angle
     */
    function processTick() {
        if (invulnerabilityTime > 0) {
            invulnerabilityTime -= 1;
        }

        recalculateAngle();

        recalculateRawPosition();

        recalculateCyclicPosition();
    }

    /**
     * @description Updates angle of the ship based on angle velocity
     */
    function recalculateAngle() {
        angle += angleVelocity;

        while (angle > 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }

        while (angle < 0) {
            angle += 2 * Math.PI;
        }
    }

    /**
     * @description Updates ship position w/o cycling move, i.e. do not handle case when ship fled out of screen borders
     */
    function recalculateRawPosition() {
        var acceleration = { x: 0, y: 0 };
        if (isThrusting()) {
            acceleration = Geometry.angleToVector(angle);
            acceleration.x *= GameConstants.ACCELERATION_COEF;
            acceleration.y *= GameConstants.ACCELERATION_COEF;
        }

        var friction = {
            x: velocity.x * GameConstants.FRICTION_COEF,
            y: velocity.y * GameConstants.FRICTION_COEF
        };

        if (Geometry.dist(velocity) <= GameConstants.MAX_VEL) {
            velocity.x += acceleration.x;
            velocity.y += acceleration.y;
        }

        velocity.x -= friction.x;
        velocity.y -= friction.y;

        position.x += velocity.x;
        position.y += velocity.y;
    }

    /**
     * @description Handles case when ship moved out of screen border
     *              If it is upper than upper-bound, then move it to the bottom of the screen
     *              If it is lefter than left-bound, then move it to the right border of the screen
     *              If it is lower than lower-bound, then move it to the up border of the screen
     *              If it is righter than right-bound, then move it to the left border of the screen
     */
    function recalculateCyclicPosition() {
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
}