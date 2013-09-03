InitMedia = function () {
    var self = this;

    var asteroidImgs, explosionParams, explosionImgs;
    (function () {
        asteroidImgs = [
        new ImageInfo('res/sprites/asteroid_blue.png'),
        new ImageInfo('res/sprites/asteroid_blend.png'),
        new ImageInfo('res/sprites/asteroid_brown.png')
        ];

        explosionParams = {
            animated: true,
            size: { width: 128, height: 128 },
            lifespan: 240
        };
        explosionImgs = [
            new ImageInfo('res/sprites/explosion_alpha.png', explosionParams),
            new ImageInfo('res/sprites/explosion_blue.png', explosionParams),
            new ImageInfo('res/sprites/explosion_blue2.png', explosionParams),
            new ImageInfo('res/sprites/explosion_orange.png', explosionParams)
        ];
    })();


    self.nebulaImg = new ImageInfo('res/sprites/the_great_nebula.jpg');
    self.debrisImg = new ImageInfo('res/sprites/debris2_blue.png');
    self.shipImg = new ImageInfo('res/sprites/double_ship.png', {
        size: { width: 90, height: 90 }
    });

    self.missileImg = new ImageInfo('res/sprites/shot2.png');

    self.getAsteroidImg = function () {
        return asteroidImgs[Random.randRange(0, asteroidImgs.length)];
    };
    self.getExplosionImg = function () {
        return explosionImgs[Random.randRange(0, explosionImgs.length)];
    };
    

    self.soundtrack = document.getElementById('soundtrack');
    self.missileSound = document.getElementById('missile_sound');
    self.explosionSound = document.getElementById('explosion_sound');

}