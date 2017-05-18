import Geometry from 'Helpers/geometry.js';
import GameConstants from 'Game/gameConstants.js';
import GameState from 'Game/gameState.js';
import Missile from 'Game/objects/missile.js';
import Render from 'Graphics/render.js';
import Rock from 'Game/objects/rock.js';
import Explosion from 'Game/objects/explosion.js';

/**
 * @description Singleton manager for all game objects except ship
 */
function GameObjects() {
    var self = this;

    var missiles = [];
    var rocks = [];
    var explosions = [];

    self.initialize = initialize;

    self.createMissile = createMissile;
    self.getMissiles = getMissiles;
    self.removeObsoleteMissiles = removeObsoleteMissiles;

    self.createRock = createRock;
    self.getRocks = getRocks;

    self.createExplosion = createExplosion;
    self.getExplosions = getExplosions;
    self.removeObsoleteExplosions = removeObsoleteExplosions;

    /**
     * @description Initializes game objects with empty arrays
     */
    function initialize() {
        missiles = [];
        rocks = [];
        explosions = [];
    }

    /**
     * @description Get all active missiles
     * @returns {Array<Missile>} Array of Missile object
     */
    function getMissiles() {
        return missiles;
    }

    /**
     * @description Creates a new missile based on ship position
     * @param {Ship} ship Instance of Ship object
     * @returns {Missile} Newly created missile
     */
    function createMissile(ship) {
        ship = ship || GameState.getShip();

        // setting missile position
        var missileVelocity = Geometry.angleToVector(ship.getAngle(), GameConstants.MISSILE_SPEED + ship.getSpeed());
        var shipSizeVector = Geometry.angleToVector(ship.getAngle(), ship.getRadius());

        var missilePosition = {
            x: ship.getPosition().x + shipSizeVector.x,
            y: ship.getPosition().y + shipSizeVector.y
        };

        var missile = new Missile(missilePosition, missileVelocity, ship.getAngle());

        missiles.push(missile);

        return missile;
    }

    /**
     * @description Removes missiles with expired lifetime and out-of-screen missiles
     */
    function removeObsoleteMissiles() {
        var resultMissiles = [];

        for (var i = 0; i < missiles.length; i++) {
            var missile = missiles[i];
            var missilePos = missile.getPosition();

            var inScreenBounds =
                missilePos.x > 0 &&
                missilePos.y > 0 &&
                missilePos.x < Render.getFieldWidth() &&
                missilePos.y < Render.getFieldHeight();

            if (!missiles[i].isExpired() && inScreenBounds) {
                resultMissiles.push(missile);
            }
        }

        missiles = resultMissiles;
    }

    /**
     * @description Get all active rocks
     * @returns {Array<Rock>} Array of Rock objects
     */
    function getRocks() {
        return rocks;
    }

    /**
     * @description Creates new rock
     * @param {object} initialPosition Spawn 2D position {x, y} 
     * @param {object} initialVelocity 2D vector represented initial velocity of the rock
     * @param {boolean} isLarge True to spawn big rock and false to spawn small rock (after explosion of a big one)
     * @returns {Rock} Newly created rock
     */
    function createRock(initialPosition, initialVelocity, isLarge) {
        var rock = new Rock(initialPosition, initialVelocity, isLarge);

        rocks.push(rock);

        return rock;
    }

    /**
     * @description Get all active explosions
     * @returns {Array<Rock>} Array of Rock object
     */
    function getExplosions() {
        return explosions;
    }

    /**
     * @description Creates a new exlosion
     * @param {object} initialPosition 2D position of an explosion
     * @returns {Explosion} Newly created explosion
     */
    function createExplosion(initialPosition) {
        var explosion = new Explosion(initialPosition);

        explosions.push(explosion);

        return explosion;
    }

    /**
     * @description Remove explosions with finished animation
     */
    function removeObsoleteExplosions() {
        var remainingExplosions = [];

        for (var i = 0; i < explosions.length; i++) {
            var explosion = explosions[i];

            if (!explosion.isExpired()) {
                remainingExplosions.push(explosion);
            }
        }

        explosions = remainingExplosions;
    }
}

var instance = new GameObjects();

export default instance;