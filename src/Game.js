// constants for user interface
var FPS = 60;
var WIDTH = 1280;
var HEIGHT = 760;

// game constants
var MAX_VEL = 7;
var ACCELERATION_COEF = 0.5;
var FRICTION_COEF = 0.05;
var TIME_BETWEEN_SHOOTING = 10;
var MISSILE_LIFETIME = 30;
var MISSILE_SPEED = 15;
var ROCK_VEL_MULTIPLIER = 3;
var INITIAL_LIVES = 3;
var RESPAWN_INVULNERABILITY = 200;

// globals for UI
var score = 0;
var lives = INITIAL_LIVES;
var time = 0;
var game_over = false;

var my_ship;

var canvasDom;
var canvas;

var missiles = [];
var rocks = [];
var explosions = [];

var Media;

function spawn_rock(rock_pos, isLarge) {
    if (!rock_pos) {
        do {
            rock_pos = { x: Random.randRange(0, WIDTH), y: Random.randRange(0, HEIGHT) };
        } while (Helpers.dist(rock_pos, my_ship.pos) < 3 * rock_pos.radius);
    }
    var mul1 = Random.random() * (Random.randRange(0, 100) % 2 == 0 ? ROCK_VEL_MULTIPLIER : -ROCK_VEL_MULTIPLIER);
    var mul2 = Random.random() * (Random.randRange(0, 100) % 2 == 0 ? ROCK_VEL_MULTIPLIER : -ROCK_VEL_MULTIPLIER);

    var params = {
        vel: { x: mul1, y: mul2},
        cyclic: true,
        actual_size: isLarge && isLarge == true ? {width: 90, height: 90} : {width: 45, height: 45}
    };
    rocks.push(new Sprite(Media.getAsteroidImg(), rock_pos, params));
}

function on_key_down(evt) {
    var key = evt.keyIdentifier;
    if (key == "Up") {
        my_ship.thrust = true;
    } else if (key == "Down") {
    } else if (key == "Left") {
        my_ship.angle_vel = -Math.PI * 0.03;
    } else if (key == "Right") {
        my_ship.angle_vel = Math.PI * 0.03;
    } else if (key == "U+0020") {
        // space key
        my_ship.shooting = true;
    }
}

function on_key_up(evt) {
    var key = evt.keyIdentifier;
    if (key == "Up") {
        my_ship.thrust = false;
    } else if (key == "Left" || key == "Right") {
        my_ship.angle_vel = 0;
    } else if (key == "U+0020") {
        // space key
        my_ship.shooting = false;
    }
}

function resize(width, height) {
    WIDTH = width;
    HEIGHT = height;
    canvasDom.width = width;
    canvasDom.height = height;
    canvasDom.style.width = width + 'px';
    canvasDom.style.height = height + 'px';
}

function resize_handler(evt) {
    resize(evt.target.innerWidth, evt.target.innerHeight);
}

function on_click() {
    if (game_over == true) {
        game_over = false;
        score = 0;
        lives = INITIAL_LIVES;

        respawn();
    }
}

function respawn() {
    my_ship = new Ship({
        x: WIDTH / 2,
        y: HEIGHT / 2
    }, { x: 0, y: 0 }, 0, Media.shipImg.image, Media.shipImg);

    my_ship.angle = Random.random() * Math.PI;
    rocks = [];
    missiles = [];
    explosions = [];
}

function redraw() {
    time += 1;

    canvas.drawImage(Media.nebulaImg.image, 0, 0);
    canvas.drawImage(Media.debrisImg.image, 0, 0);

    if (game_over == true) {
        canvas.font = '36px Arial';
        canvas.fillStyle = '#FF0000';
        canvas.fillText("GAME OVER (Click to continue)", WIDTH / 2 - 240, HEIGHT / 2);
        canvas.font = '24px Arial';
        canvas.fillText("Score: " + score, WIDTH / 2 - 60, HEIGHT / 2 + 40);
        my_ship.shipThrustSound.pause();
        my_ship.shipThrustSound.currentTime = 0;

        return;
    }

    // draw score
    var score_str = 'Score: ' + score;
    canvas.font = '20px Arial';
    canvas.fillStyle = '#FFFFFF';
    canvas.fillText(score_str, 10, 20);

    // draw lives
    var lives_str = 'Lives: ' + lives;
    canvas.font = '20px Arial';
    canvas.fillStyle = '#FFFFFF';
    canvas.fillText(lives_str, WIDTH - 100, 20);

    my_ship.update();
    my_ship.draw(canvas);

    for (var i = 0; i < missiles.length; i++) {
        missiles[i].update();

        if (missiles[i] + MISSILE_LIFETIME < time) {
            missiles.remove(missiles[i]);
        } else {
            missiles[i].draw(canvas);

            for (var j = 0; j < rocks.length; j++) {
                if (Helpers.dist(missiles[i].pos, rocks[j].pos) <= missiles[i].radius + rocks[j].radius) {
                    explosions.push(new Sprite(Media.getExplosionImg(), rocks[j].pos, {
                        sound: Media.explosionSound,
                        animated: true,
                        lifetime: 1000,
                        img_size: { width: 128, height: 128 }
                    }));

                    // determine if big rock exploded
                    if (rocks[j].actual_size.width == 90) {
                        spawn_rock({
                            x: rocks[j].pos.x + Random.randRange(-10, 10), 
                            y: rocks[j].pos.y + Random.randRange(-10, 10)
                        }, false);
                        spawn_rock({
                            x: rocks[j].pos.x + Random.randRange(-10, 10), 
                            y: rocks[j].pos.y + Random.randRange(-10, 10)
                        }, false);
                        spawn_rock({
                            x: rocks[j].pos.x + Random.randRange(-10, 10), 
                            y: rocks[j].pos.y + Random.randRange(-10, 10)
                        }, false);
                    }

                    rocks[j] = rocks[rocks.length - 1];
                    rocks.pop();
                    j--;
                    missiles[i] = missiles[missiles.length - 1];
                    i--;
                    missiles.pop();

                    score += 1;

                    break;
                }
            }
        }
    }

    for (i = 0; i < missiles.length; i++) {
        missiles[i].draw(canvas);
    }

    for (i = 0; i < rocks.length; i++) {
        rocks[i].update();
        rocks[i].draw(canvas);
    }

    for (i = 0; i < explosions.length; i++) {
        explosions[i].update();
        explosions[i].draw(canvas);
    }
}

function init() {
    LibCanvas.extract();
    canvasDom = document.getElementById('mainCanvas');

    resize(window.innerWidth, window.innerHeight);
    canvas = document.getElementById('mainCanvas').getContext("2d-libcanvas");
    
    Media = new InitMedia();

    setInterval(redraw, 1000 / FPS);
    respawn();

    setInterval(function () {
        spawn_rock({ x: Random.randRange(0, WIDTH), y: Random.randRange(0, HEIGHT)}, true);
    }, 2000);

    Media.soundtrack.play();
}
