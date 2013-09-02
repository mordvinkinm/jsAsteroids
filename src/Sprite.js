function Sprite(img, pos, params) {
    var self = this;

    self.image = img.image;
    self.image_center = img.center;
    self.image_size = img.size;
    self.pos = { x: pos.x, y: pos.y };
    self.vel = params && params.vel ? { x: params.vel.x, y: params.vel.y } : { x: 0, y: 0};
    self.angle = params && params.angle ? params.angle : 0;
    self.angle_vel = params && params.angle_vel ? params.angle_vel : 0;
    self.actual_size = img.size;
    self.radius = img.radius;

    self.lifespan = img.lifespan;
    self.animated = img.animated;
    self.age = 0;
    self.cyclic = params && params.cyclic && params.cyclic == true;
    if (params && params.sound) {
        params.sound.play();
    }

    self.draw = function (canvas) {
        if (self.animated == true) {
            var sprite_center = {x: self.image_center.x + self.age * self.image_size.x, y: self.image_center.y};
            canvas.drawImage({
                image: self.image,
                draw: new Rectangle({center: self.pos, size: self.image_size}),
                crop: new Rectangle({center: sprite_center, size: self.image_size}),
                angle: self.angle
            });
        } else {
            canvas.drawImage({
                image: self.image,
                crop: new Rectangle({center: self.image_center, size: self.image_size}),
                draw: new Rectangle({center: self.pos, size: self.image_size}),
                angle: self.angle
            });
        }
    };

    self.update = function() {
        if (self.age > self.lifespan) {
            self.destroy();
        }

        self.age += 1;

        self.pos.x += self.vel.x;
        self.pos.y += self.vel.y;

        if (self.cyclic == true) {
            if (self.pos.x > WIDTH) {
                self.pos.x = 0;
            } else if (self.pos.x < 0) {
                self.pos.x = WIDTH;
            }

            if (self.pos.y > HEIGHT) {
                self.pos.y = 0;
            } else if (self.pos.y < 0) {
                self.pos.y = HEIGHT;
            }
        }
    };
}