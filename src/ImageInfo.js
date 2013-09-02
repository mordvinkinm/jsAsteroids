function ImageInfo(url, params) {
    var self = this;

    self.image = new Image();

    self.Init = function () {
        self.center = params && params.center ? params.center : { x: self.image.width / 2, y: self.image.height / 2 };
        self.size = params && params.size ? params.size : { width: self.image.width, height: self.image.height};
        self.radius = Math.sqrt(Math.pow(self.size.width, 2.0) + Math.pow(self.size.height, 2.0));

        //self.lifespan = lifespan ? lifespan : 100000000;
        self.animated = params && params.animated && params.animated == true;
    };

    self.image.src = url;
    self.image.onload = self.Init();
}