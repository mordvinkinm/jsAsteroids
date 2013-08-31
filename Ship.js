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

    self.draw = function (canvas) {
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