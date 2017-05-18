import Sprites from 'Graphics/sprites.js';
import Debug from 'Game/debug.js';

/**
 * Handles rendering of the missile object
 * @param {Missile} missile Missile data object
 */
export default function MissileRender(missile) {
    var self = this;

    var sprite = Sprites.missileImg;

    self.render = render;

    /**
     * @description Renders missile on the canvas
     * @param {RenderingContext} canvas 
     */
    function render(canvas) {
        var missilePos = missile.getPosition();

        if (Debug.isDebugMode()) {
            canvas.beginPath();
            canvas.arc(missilePos.x, missilePos.y, missile.getRadius(), 0, 2 * Math.PI, false);
            canvas.fillStyle = 'yellow';
            canvas.fill();
            canvas.lineWidth = 3;
            canvas.strokeStyle = '#BDB76B';
            canvas.stroke();
        }

        canvas.drawImage({
            image: sprite.getImage(),
            draw: new Rectangle({
                center: new Point(missilePos.x, missilePos.y),
                size: new Size(missile.getRadius() * 2, missile.getRadius() * 2)
            }),
            crop: new Rectangle(0, 0, sprite.getWidth(), sprite.getHeight()),
            angle: missile.getAngle()
        });
    }
}