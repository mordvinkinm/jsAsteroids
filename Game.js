// constants for user interface
var WIDTH = 800;
var HEIGHT = 600;
var SLOWMO_BAR_HEIGHT = 20;
var SLOWMO_TOP_LEFT = [12, 30];

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

var SLOW_MO_COEF = 3;
var MAX_SLOW_MO = 100;
var SLOWMO_ADD_DELTA = 5;
var SLOWMO_SUB_DELTA = 0.5;

// globals for UI
var score = 0;
var lives = INITIAL_LIVES;
var time = 0;
var game_over = false;
var slowmo = 0;
var slowmo_enabled = false;

var my_ship;

// debris images - debris1_brown.png, debris2_brown.png, debris3_brown.png, debris4_brown.png
//                 debris1_blue.png, debris2_blue.png, debris3_blue.png, debris4_blue.png, debris_blend.png
var debris_info = new ImageInfo([], []);
var debris_image = new Image();
debris_image.src = 'http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/debris2_blue.png';

// nebula images - nebula_brown.png, nebula_blue.png
var nebula_info = new ImageInfo([400, 300], [800, 600]);
var nebula_image = new Image();
nebula_image.src = 'http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/nebula_blue.png';

// splash image
var splash_info = new ImageInfo([200, 150], [400, 300]);
var splash_image = new Image();
splash_image = 'http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/splash.png';

// ship image
var ship_info = new ImageInfo([45, 45], [90, 90], 35);
var ship_image = new Image();
ship_image.src = 'http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/double_ship.png';

// missile image - shot1.png, shot2.png, shot3.png
var missile_info = new ImageInfo([5, 5], [10, 10], 3, 50);
var missile_image = new Image();
missle_image = 'http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/shot2.png';

// asteroid images - asteroid_blue.png, asteroid_brown.png, asteroid_blend.png
var asteroid_info = new ImageInfo([45, 45], [90, 90], 40);
var asteroid_image = new Image();
asteroid_image.src = 'http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/asteroid_blue.png';

// animated explosion - explosion_orange.png, explosion_blue.png, explosion_blue2.png, explosion_alpha.png
var explosion_info = new ImageInfo([64, 64], [128, 128], 17, 24, true);
var explosion_image = new Image();
explosion_image = 'http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/explosion_alpha.png';

// sound assets purchased from sounddogs.com, please do not redistribute
var soundtrack;
var missile_sound;
var shipThrustSound;
var explosion_sound;

var canvas;

// helper functions to handle transformations
function angle_to_vector(ang, r) {
    r = r ? r : 1;
    return [r * Math.cos(ang), r * Math.sin(ang)];
}

function dist(p, q) {
    q = q ? q : [0, 0];
    return Math.sqrt(Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2));
}

// storage for sprites
var missiles = [];
var rocks = [];
var explosions = [];

// timer handler that spawns a rock
function spawn_rock(rock_pos, large) {
    rock_pos = rock_pos ? rock_pos : Random.randRange(0, WIDTH), Random.randRange(0, HEIGHT);
    if (Random.randRange(0, 100) % 2 == 0) {
        mul1 = ROCK_VEL_MULTIPLIER;
    } else {
        mul1 = -ROCK_VEL_MULTIPLIER;
    }
    if (Random.randRange(0, 100) % 2 == 0) {
        mul2 = ROCK_VEL_MULTIPLIER;
    } else {
        mul2 = -ROCK_VEL_MULTIPLIER;
    }

    if (!large || large == true) {
        rocks.append(new Sprite(rock_pos, (Random.random() * mul1, Random.random() * mul2), Math.PI, 0, asteroid_image, asteroid_info, None, true))
    } else {
        rocks.append(new Sprite(rock_pos, (Random.random() * mul1, Random.random() * mul2), Math.PI, 0, asteroid_image, asteroid_info, None, true, (45, 45), 20))
    }
}

function on_key_down(key) {
    if (key == simplegui.KEY_MAP["up"]) {
        my_ship.thrust = true;
    } else if (key == simplegui.KEY_MAP["down"]) {
        // insert stop code there

    } else if (key == simplegui.KEY_MAP["left"]) {
        my_ship.angle_vel = -Math.PI * 0.03;
    } else if (key == simplegui.KEY_MAP["right"]) {
        my_ship.angle_vel = Math.PI * 0.03;
    } else if (key == simplegui.KEY_MAP["space"]) {
        my_ship.shooting = true;
    } else if (key == simplegui.KEY_MAP["e"]) {
        if (slowmo > 0) {
            slowmo_enabled = slowmo_enabled != true;
        }
    }
}

function on_key_up(key) {
    if (key == simplegui.KEY_MAP["up"]) {
        my_ship.thrust = false;
    } else if (key == simplegui.KEY_MAP["down"]) {
        // insert stop code there
    } else if (key == simplegui.KEY_MAP["left"]) {
        my_ship.angle_vel = 0;
    } else if (key == simplegui.KEY_MAP["right"]) {
        my_ship.angle_vel = 0;
    } else if (key == simplegui.KEY_MAP["space"]) {
        my_ship.shooting = false;
    }
}

function on_click(position) {
    if (game_over == true) {
        game_over = false;
        score = 0;
        lives = INITIAL_LIVES;

        respawn()
    }
}

function respawn() {
    my_ship = new Ship([WIDTH / 2, HEIGHT / 2], [0, 0], 0, ship_image, ship_info);
    my_ship.angle = Random.random() * Math.PI;
    rocks = [];
    missiles = [];
    explosions = [];

    slowmo_enabled = false;
    slowmo = 0;
}

function redraw(){
    canvas.drawImage(nebula_image, 0, 0);
}

function init() {
    canvas = document.getElementById('mainCanvas').getContext("2d");

    soundtrack = document.getElementById('soundtrack');
    missile_sound = document.getElementById('missileSound');
    //missile_sound.volume = 0.5;
    shipThrustSound = document.getElementById('shipThrustSound');
    explosion_sound = document.getElementById('explosion_sound');

    setInterval(redraw, 100);
//    respawn();

//    setInterval(spawn_rock, 2000);

//    soundtrack.play();
}
