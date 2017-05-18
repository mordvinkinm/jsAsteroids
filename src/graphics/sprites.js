import Sprite from 'Graphics/sprite.js';
import Random from 'Helpers/random.js';

/**
 * @description Singleton storage for all sprites
 */
function Sprites() {
    var self = this;

    var asteroidImgs, explosionImgs;

    (function init() {
        asteroidImgs = [
            new Sprite('res/sprites/asteroid_blue.png'),
            new Sprite('res/sprites/asteroid_blend.png'),
            new Sprite('res/sprites/asteroid_brown.png')
        ];

        var explosionSize = { width: 128, height: 128 };
        var explosionAnimationDuration = 240;

        explosionImgs = [
            new Sprite('res/sprites/explosion_alpha.png', explosionSize, explosionAnimationDuration),
            new Sprite('res/sprites/explosion_blue.png', explosionSize, explosionAnimationDuration),
            new Sprite('res/sprites/explosion_blue2.png', explosionSize, explosionAnimationDuration),
            new Sprite('res/sprites/explosion_orange.png', explosionSize, explosionAnimationDuration)
        ];
    })();

    self.nebulaImg = new Sprite('res/sprites/the_great_nebula.jpg');

    self.debrisImg = new Sprite('res/sprites/debris2_blue.png');

    self.shipImg = new Sprite('res/sprites/double_ship.png', {
        width: 90,
        height: 90
    });

    self.missileImg = new Sprite('res/sprites/shot2.png');

    self.getAsteroidImg = function () {
        return asteroidImgs[Random.randRange(0, asteroidImgs.length)];
    };

    self.getExplosionImg = function () {
        return explosionImgs[Random.randRange(0, explosionImgs.length)];
    };
}

var instance = new Sprites();

export default instance;