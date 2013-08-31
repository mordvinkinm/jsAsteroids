function ImageInfo(center, size, radius, lifespan, animated) {
    var self = this;

    self.center = center;
    self.size = size;
    self.radius = radius ? radius : 0;

    self.lifespan = lifespan ? lifespan : 100000000;
    self.animated = animated && animated == true;
}