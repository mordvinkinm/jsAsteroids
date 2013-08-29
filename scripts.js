var Random = {
    randRange: function(from, to){
        return (to - from) * Math.random() + from;
    },

    random: Math.random
};

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

function ImageInfo(center, size, radius, lifespan, animated) {
    var self = this;

    self.center = center;
    self.size = size;
    self.radius = radius ? radius : 0;

    self.lifespan = lifespan ? lifespan : 100000000;
    self.animated = animated && animated == true;
}

// debris images - debris1_brown.png, debris2_brown.png, debris3_brown.png, debris4_brown.png
//                 debris1_blue.png, debris2_blue.png, debris3_blue.png, debris4_blue.png, debris_blend.png
var debris_info = new ImageInfo([320, 240], [640, 480]);
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

// Ship class
function Ship(pos, vel, angle, image, info) {
    var self = this;

    self.pos = [pos[0], pos[1]];
    self.vel = [vel[0], vel[1]];
    self.thrust = false;
    self.shooting = false;
    self.angle = angle;
    self.angle_vel = 0;
    self.image = image;
    self.image_center = info.center;
    self.image_size = info.size;
    self.radius = info.radius;
    self.last_shooting = 0;
    self.invulnerability = RESPAWN_INVULNERABILITY;

    self.draw = function (self, canvas) {
        if (self.thrust == true) {
            shipThrustSound.play();
            var sprite_center = (ship_info.get_center()[0] + ship_info.size[0], ship_info.center[1]);
            canvas.draw_image(ship_image, sprite_center, ship_info.size, self.pos, ship_info.size, self.angle);
        } else {
            canvas.draw_image(ship_image, ship_info.center, ship_info.size, self.pos, ship_info.size, self.angle);
        }

        if (self.invulnerability > 0 && self.invulnerability % 5 == 0) {
            canvas.draw_circle(self.pos, ship_info.radius + 10.0, 1, "White");
        }
    };

    self.destroy = function (self) {
        lives -= 1;

        explosions.append(new Explosion(self.pos));

        if (lives <= 0) {
            game_over = true;
        } else {
            self.invulnerability = RESPAWN_INVULNERABILITY;
        }
    };

    function check_collision(self) {
        for (var rock in rocks) {
            var dst = dist(self.pos, rock.pos);
            if (dst <= self.radius + rock.radius) {
                if (self.invulnerability <= 0) {
                    self.destroy();
                    rocks.remove(rock);
                }
            }
        }
    }

    function get_speed(self) {
        return Math.sqrt(Math.pow(self.vel[0], 2.0) + Math.pow(self.vel[1], 2.0))
    }

    function update(self) {
        if (self.invulnerability > 0) {
            self.invulnerability -= 1;
        }

        self.angle = self.angle + self.angle_vel;
        while (self.angle > 2 * Math.PI) {
            self.angle -= 2 * Math.PI;
        }
        while (self.angle < 0) {
            self.angle += 2 * Math.PI;
        }

        acceleration = [0, 0];
        if (self.thrust == true) {
            acceleration = angle_to_vector(self.angle);
            acceleration[0] *= ACCELERATION_COEF;
            acceleration[1] *= ACCELERATION_COEF;
        }

        friction = [self.vel[0] * FRICTION_COEF, self.vel[1] * FRICTION_COEF];

        if (dist(self.vel) <= MAX_VEL) {
            self.vel[0] += acceleration[0];
            self.vel[1] += acceleration[1];
        }

        self.vel[0] -= friction[0];
        self.vel[1] -= friction[1];

        self.pos[0] += self.vel[0];
        self.pos[1] += self.vel[1];

        // cyclic space
        if (self.pos[0] > WIDTH) {
            self.pos[0] = 0;
        } else if (self.pos[0] < 0) {
            self.pos[0] = WIDTH;
        }

        if (self.pos[1] > HEIGHT) {
            self.pos[1] = 0;
        }
        else if (self.pos[1] < 0) {
            self.pos[1] = HEIGHT;
        }

        if (self.shooting == true && (time - self.last_shooting > TIME_BETWEEN_SHOOTING)) {
            missle_vector = angle_to_vector(self.angle, MISSILE_SPEED + self.speed())

            // setting missle position
            missle_position = list(self.pos);
            ship_size = ship_info.get_radius() + 1.0;
            ship_size_vect = angle_to_vector(self.angle, ship_size);
            missle_position[0] += ship_size_vect[0];
            missle_position[1] += ship_size_vect[1];

            item = (time, Sprite(missle_position, missle_vector, self.angle, 0, missile_image, missile_info, missile_sound));
            missiles.append(item);

            self.last_shooting = time;
        }

        self.check_collision();
    }
}

// Sprite class
function Sprite(pos, vel, ang, ang_vel, image, info, sound, cyclic, actual_size, actual_radius) {
    self.pos = [pos[0], pos[1]];
    self.vel = [vel[0], vel[1]];
    self.angle = ang;
    self.angle_vel = ang_vel;
    self.image = image;
    self.image_center = info.center();
    self.image_size = info.size;
    if (!actual_size || actual_size == [-1, -1]) {
        self.actual_size = info.size;
    } else {
        self.actual_size = actual_size;
    }

    if (!actual_radius || actual_radius == -1) {
        self.radius = info.radius;
    } else {
        self.radius = actual_radius;
    }

    self.lifespan = info.lifespan;
    self.animated = info.animated;
    self.age = 0;
    self.cyclic = cyclic && cyclic == true;
    if (sound) {
        sound.play();
    }

    function draw(self, canvas) {
        if (self.animated == true) {
            sprite_center = (self.image_center[0] + self.age * self.image_size[0], self.image_center[1]);
            canvas.draw_image(self.image, sprite_center, self.image_size, self.pos, self.actual_size, self.angle);
        } else {
            canvas.draw_image(self.image, self.image_center, self.image_size, self.pos, self.actual_size, self.angle);
        }
    }

    function update(self) {
        if (self.age > self.lifespan) {
            self.destroy();
        }

        self.age += 1;

        self.pos[0] += self.vel[0];
        self.pos[1] += self.vel[1];

        if (self.cyclic == true) {
            if (self.pos[0] > WIDTH) {
                self.pos[0] = 0;
            } else if (self.pos[0] < 0) {
                self.pos[0] = WIDTH;
            }

            if (self.pos[1] > HEIGHT) {
                self.pos[1] = 0;
            } else if (self.pos[1] < 0) {
                self.pos[1] = HEIGHT;
            }
        }
    }
}

function Explosion(extendSprite, pos) {
    explosion_sound.play();
    Sprite.__init__(self, pos, (0, 0), 0, 0, explosion_image, explosion_info, None, false);

    function destroy(self) {
        explosions.remove(self);
    }

    function draw(canvas) {
        if (slowmo_enabled == true) {
            slowmo = Math.max(slowmo - SLOWMO_SUB_DELTA, 0);
            if (slowmo == 0) {
                slowmo_enabled = false
            }
        }

        // animiate background
        time += 1;
        center = debris_info.get_center();
        size = debris_info.get_size();
        wtime = (time / 8) % center[0];
        canvas.draw_image(nebula_image, nebula_info.get_center(), nebula_info.get_size(), [WIDTH / 2, HEIGHT / 2], [WIDTH, HEIGHT]);
        canvas.draw_image(debris_image, [center[0] - wtime, center[1]], [size[0] - 2 * wtime, size[1]], [WIDTH / 2 + 1.25 * wtime, HEIGHT / 2], [WIDTH - 2.5 * wtime, HEIGHT]);
        canvas.draw_image(debris_image, [size[0] - wtime, center[1]], [2 * wtime, size[1]], [1.25 * wtime, HEIGHT / 2], [2.5 * wtime, HEIGHT]);

        if (game_over == true) {
            canvas.draw_text("GAME OVER (Click to continue)", (150, HEIGHT / 2), 40, "Red");
            canvas.draw_text("Score: " + str(score), (370, HEIGHT / 2 + 40), 30, "Red");
            return;
        }

        // draw ship and sprites
        my_ship.draw(canvas);

        for (rock in rocks) {
            rock.draw(canvas);

            if (slowmo_enabled == false || slowmo <= 0 || time % SLOW_MO_COEF == 0) {
                rock.update();
            }
        }

        for (missle in missiles) {
            if (missle[0] + MISSILE_LIFETIME < time) {
                missiles.remove(missle);
            } else {
                missle[1].draw(canvas);

                if (slowmo_enabled == false || slowmo <= 0 || time % SLOW_MO_COEF == 0) {
                    missle[1].update();
                }

                for (rock in rocks) {
                    if (dist(missle[1].pos, rock.pos) <= missle[1].radius + rock.radius) {
                        explosions.append(new Explosion(rock.pos));
                        rocks.remove(rock);
                        missiles.remove(missle);

                        // determine if big rock exploded
                        if (rock.radius == asteroid_info.radius) {
                            pos1 = (rock.pos[0] + Random.randRange(-10, 10), rock.pos[1] + Random.randRange(-10, 10));
                            pos2 = (rock.pos[0] + Random.randRange(-10, 10), rock.pos[1] + Random.randRange(-10, 10));
                            pos3 = (rock.pos[0] + Random.randRange(-10, 10), rock.pos[1] + Random.randRange(-10, 10));

                            spawn_rock(pos1, false);
                            spawn_rock(pos2, false);
                            spawn_rock(pos3, false);
                        }

                        score += 1;

                        if (slowmo < MAX_SLOW_MO) {
                            slowmo = min(slowmo + SLOWMO_ADD_DELTA, MAX_SLOW_MO);
                        }

                        break;
                    }
                }
            }
        }

        for (explosion in explosions) {
            explosion.draw(canvas);

            if (slowmo_enabled == false || slowmo <= 0 || time % SLOW_MO_COEF == 0) {
                explosion.update();
            }
        }

        if (slowmo_enabled == false || slowmo <= 0 || time % SLOW_MO_COEF == 0) {
            my_ship.update();
        }

        // draw score
        score_str = 'Score: ' + str(score);
        canvas.draw_text(score_str, (10, 20), 24, "White");

        // draw lives
        lives_str = 'Lives: ' + str(lives)
        canvas.draw_text(lives_str, (WIDTH - 100, 20), 24, "White")

        // draw slow-mo counter
        canvas.draw_polygon([
            SLOWMO_TOP_LEFT,
            (SLOWMO_TOP_LEFT[0] + MAX_SLOW_MO, SLOWMO_TOP_LEFT[1]),
            (SLOWMO_TOP_LEFT[0] + MAX_SLOW_MO, SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT),
            (SLOWMO_TOP_LEFT[0], SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT)],
            1, "Red");

        if (slowmo < MAX_SLOW_MO || time % 14 >= 7) {
            canvas.draw_polygon([
                SLOWMO_TOP_LEFT,
                (SLOWMO_TOP_LEFT[0] + slowmo, SLOWMO_TOP_LEFT[1]),
                (SLOWMO_TOP_LEFT[0] + slowmo, SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT),
                (SLOWMO_TOP_LEFT[0], SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT)],
                1, "Red", "Red")
        } else if (slowmo == MAX_SLOW_MO) {
            canvas.draw_text("Press E", (SLOWMO_TOP_LEFT[0] + 15, SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT / 2 + 5), 20, "Red")
        }
    }
}
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
    var my_ship = new Ship([WIDTH / 2, HEIGHT / 2], [0, 0], 0, ship_image, ship_info);
    my_ship.angle = Random.random() * Math.PI;
    rocks = [];
    missiles = [];
    explosions = [];

    slowmo_enabled = false;
    slowmo = 0;
}

function init() {
    soundtrack = document.getElementById('soundtrack');
    missile_sound = document.getElementById('missileSound');
    //missile_sound.volume = 0.5;
    shipThrustSound = document.getElementById('shipThrustSound');
    explosion_sound = document.getElementById('explosion_sound');

    respawn();

    setInterval(spawn_rock, 2000);

    soundtrack.play();
}
