import GameConstants from 'Game/gameConstants.js';
import Random from 'Helpers/random.js';
import Ship from 'Game/objects/ship.js';
import Render from 'Graphics/render.js';
import GameObjects from 'Game/gameObjects.js';
import Geometry from 'Helpers/geometry.js';
import AudioManager from 'Sound/audioManager.js';

/**
 * @description Singleton manager for the entire game state
 */
function GameState() {
    var self = this;

    var initialized = false;

    var score = 0;
    var lives = GameConstants.INITIAL_LIVES;
    var time = 0;
    var lastShootingTime = 0;
    var gameEnded = false;

    var ship;

    self.initialize = initialize;

    self.getScore = getScore;
    self.getLives = getLives;
    self.getTime = getTime;
    self.isGameOver = isGameOver;

    self.getShip = getShip;

    self.restartGame = restartGame;

    /**
     * @description Get game score
     * @returns {number} Non-negative number
     */
    function getScore() {
        return score;
    }

    /**
     * @description Get remaining lives
     * @return {number} Non-negative number
     */
    function getLives() {
        return lives;
    }

    /**
     * @description Get elapsed ticks from the game start
     * @returns {number} Non-negative number
     */
    function getTime() {
        return time;
    }

    /**
     * @description Indicates if game is over or not
     * @returns {boolean}
     */
    function isGameOver() {
        return !!gameEnded;
    }

    /**
     * @description Get instance of the ship
     * @returns {Ship}
     */
    function getShip() {
        return ship;
    }

    /**
     * @description Respawns ship. Resets its position, speed and set random angle
     */
    function respawn() {
        var shipPosition = {
            x: Render.getFieldWidth() / 2,
            y: Render.getFieldHeight() / 2
        };

        var shipVelocity = {
            x: 0, y: 0
        };

        var shipAngle = Random.random() * Math.PI;

        ship = new Ship(shipPosition, shipVelocity, shipAngle);
    }

    /**
     * @description Resets the entire game: resets score, time, lives to the initial state, respawns ship, drops all objects.
     */
    function restartGame() {
        respawn();

        score = 0;
        time = 0;
        lastShootingTime = 0;
        lives = GameConstants.INITIAL_LIVES;
        gameEnded = false;

        GameObjects.initialize();
    }

    /**
     * @description Processes one game tick (one time unit): updates positions of objects, checks collisions.
     */
    function processTick() {
        if (gameEnded) {
            return;
        }

        time++;

        ship.processTick();
        processShooting();
        processThrusting();

        var i;
        var missiles = GameObjects.getMissiles();
        for (i = 0; i < missiles.length; i++) {
            missiles[i].processTick();
        }

        var rocks = GameObjects.getRocks();
        for (i = 0; i < rocks.length; i++) {
            rocks[i].processTick();
        }

        GameObjects.removeObsoleteMissiles();
        GameObjects.removeObsoleteExplosions();

        checkMissileRockCollision();
        checkShipRockCollision();
    }

    /**
     * @description Based on shooting state produces missiles and plays sound
     */
    function processShooting() {
        if (ship.isShooting() === true && (time - lastShootingTime > GameConstants.TIME_BETWEEN_SHOOTING)) {
            GameObjects.createMissile(ship);

            AudioManager.playMissileSound();

            lastShootingTime = time;
        }
    }

    /**
     * @description Plays or stops thrust sound depending on following state of the ship
     */
    function processThrusting() {
        if (ship.isThrusting()) {
            AudioManager.playThrustSound();
        } else {
            AudioManager.stopThrustSound();
        }
    }

    /**
     * @description Smawns a big rock by timer
     */
    function spawnRock() {
        if (gameEnded) {
            return;
        }

        var rockPosition = getRandomRockPosition();
        var rockVelocity = getRandomRockVelocity();

        GameObjects.createRock(rockPosition, rockVelocity, true);
    }

    /**
     * @description Get random rock position: not too close to the ship
     * @returns {object} 2D position (object {x, y}) of a rock to create
     */
    function getRandomRockPosition() {
        var rockPosition;

        // Chooses position of a rock: not to close to the ship
        do {
            rockPosition = {
                x: Random.randRange(0, Render.getFieldWidth()),
                y: Random.randRange(0, Render.getFieldHeight())
            };
        } while (Geometry.dist(rockPosition, ship.getPosition()) < 3 * (ship.getRadius() + GameConstants.LARGE_ROCK_RADIUS));

        return rockPosition;
    }

    /**
     * @description Get random rock velocity in random direction
     * @returns {object} 2D vector (object {x, y})
     */
    function getRandomRockVelocity() {
        var velocityXMul = Random.randRange(0, 100) % 2 == 0
            ? GameConstants.ROCK_VEL_MULTIPLIER
            : -GameConstants.ROCK_VEL_MULTIPLIER;

        var velocityYMul = Random.randRange(0, 100) % 2 == 0
            ? GameConstants.ROCK_VEL_MULTIPLIER
            : -GameConstants.ROCK_VEL_MULTIPLIER;

        return {
            x: Random.random() * velocityXMul,
            y: Random.random() * velocityYMul
        };
    }

    /**
     * @description Spawns a small rock near the big one (which has exploded) 
     * @param {Rock} largeRock Large rock instance
     * @returns {Rock} Small rock instance
     */
    function spawnSmallRock(largeRock) {
        var smallRockVelocity = {
            x: Random.randRange(-GameConstants.ROCK_VEL_MULTIPLIER, GameConstants.ROCK_VEL_MULTIPLIER),
            y: Random.randRange(-GameConstants.ROCK_VEL_MULTIPLIER, GameConstants.ROCK_VEL_MULTIPLIER)
        };

        var smallRockPosition = {
            x: largeRock.getPosition().x + smallRockVelocity.x,
            y: largeRock.getPosition().y + smallRockVelocity.y
        };

        return GameObjects.createRock(smallRockPosition, smallRockVelocity, false);
    }

    /**
     * @description Check collisions between rocks and missiles. Remove collided ones, play explosion sound and renders explosion
     */
    function checkMissileRockCollision() {
        var missiles = GameObjects.getMissiles();
        var rocks = GameObjects.getRocks();

        for (var i = missiles.length - 1; i >= 0; i--) {
            var missileHit = false;

            for (var j = rocks.length - 1; j >= 0; j--) {
                var distance = Geometry.dist(missiles[i].getPosition(), rocks[j].getPosition());
                if (distance <= missiles[i].getRadius() + rocks[j].getRadius()) {
                    GameObjects.createExplosion(rocks[j].getPosition());

                    if (rocks[j].isLarge()) {
                        spawnSmallRock(rocks[j]);
                        spawnSmallRock(rocks[j]);
                        spawnSmallRock(rocks[j]);
                    }

                    missileHit = true;
                    score += 1;

                    rocks.splice(j, 1);

                    break;
                }
            }

            if (missileHit) {
                missiles.splice(i, 1);
                AudioManager.playExplosionSound();
            }
        }
    }

    /**
     * @description Checks collision between ship and rock. Plays explosion sound and renders explosion (if collided)
     */
    function checkShipRockCollision() {
        if (ship.isInvulnerable()) {
            return;
        }

        var rocks = GameObjects.getRocks();
        for (var i = rocks.length - 1; i >= 0; i--) {
            var distance = Geometry.dist(rocks[i].getPosition(), ship.getPosition());
            if (distance <= rocks[i].getRadius() + ship.getRadius()) {
                GameObjects.createExplosion(ship.getPosition());

                lives -= 1;
                ship.makeInvulnerable();

                AudioManager.playExplosionSound();

                if (lives === 0) {
                    gameOver();
                }

                rocks.splice(i, 1);

                break;
            }
        }
    }

    /**
     * @description Handles "game over" event
     */
    function gameOver() {
        gameEnded = true;
        AudioManager.stopAllSounds();
    }

    /**
     * @description Initializes game - set interval for game tick and rock spawning
     */
    function initialize() {
        if (initialized) {
            return;
        }

        setInterval(processTick, GameConstants.TICK_TIME);
        setInterval(spawnRock, GameConstants.ROCK_SPAWN_TIME);

        initialized = true;
    }
}

var instance = new GameState();

export default instance;