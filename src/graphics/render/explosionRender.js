import Sprites from 'Graphics/sprites.js';

/**
 * @description Handles rendering of the explosion object
 * @param {Explosion} explosion Explosion data object
 */
export default function ExplosionRender(explosion) {
    var self = this;

    var lifetime = 0;
    var sprite = Sprites.getExplosionImg();

    self.render = render;
    self.isFinished = isFinished;

    /**
     * @description Renders animated explosion on the canvas
     * @param {RenderingContext} canvas 
     */
    function render(canvas) {
        var position = explosion.getPosition();

        var imageCenter = {
            x: sprite.getWidth() / 2.0,
            y: sprite.getHeight() / 2.0
        };

        var spriteCenter = {
            x: imageCenter.x + lifetime * sprite.getWidth(),
            y: imageCenter.y
        };

        lifetime++;

        canvas.drawImage({
            image: sprite.getImage(),
            draw: new Rectangle({
                center: new Point(position.x, position.y),
                size: new Size(sprite.getWidth(), sprite.getHeight())
            }),
            crop: new Rectangle({
                center: spriteCenter,
                size: new Size(sprite.getWidth(), sprite.getHeight())
            }),
            angle: explosion.getAngle()
        });
    }

    /**
     * @description Checks if explosion animation finished. If so, object will be deleted by objects manager
     * @returns {boolean} Boolean flag indication if animation is finished or not
     */
    function isFinished() {
        return lifetime >= sprite.getAnimationTime();
    }
}