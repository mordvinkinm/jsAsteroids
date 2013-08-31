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

    function draw(canvas) {
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