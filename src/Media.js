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
    

    
    /*<audio src="res/sounds/soundtrack.mp3" id="soundtrack"></audio>
    <audio src="res/sounds/missile.mp3" id="missile_sound"></audio>
    <audio src="res/sounds/thrust.mp3" id="ship_thrust_sound"></audio>
    <audio src="res/sounds/explosion.mp3" id="explosion_sound"></
    audio >       */ 
    self.soundtrack = new Audio('res/sounds/soundtrack.mp3');//document.getElementById('soundtrack');
    self.missileSound = new Audio('res/sounds/missile.mp3');//document.getElementById('missile_sound');
    self.explosionSound = new Audio('res/sounds/explosion.mp3');//document.getElementById('explosion_sound');
    self.shipThrustSound = new Audio('res/sounds/thrust.mp3');

}