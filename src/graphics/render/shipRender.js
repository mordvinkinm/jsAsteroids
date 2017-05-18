import Sprites from 'Graphics/sprites.js';

/**
 * @description Handles rendering of the ship object
 * @param {Ship} ship Ship data object
 */
export default function ShipRender(ship) {
    var self = this;

    var sprite = Sprites.shipImg;

    self.render = render;

    /**
     * @description Renders ship + debug graphics (if needed) on the canvas
     * @param {RenderingContext} canvas 
     */
    function render(canvas) {
        var shipPosition = ship.getPosition();

        if (Debug.isDebugMode()) {
            canvas.beginPath();
            canvas.arc(shipPosition.x, shipPosition.y, ship.getRadius(), 0, 2 * Math.PI, false);
            canvas.fillStyle = 'green';
            canvas.fill();
            canvas.lineWidth = 3;
            canvas.strokeStyle = '#003300';
            canvas.stroke();
        }

        var cropStart;
        if (ship.isThrusting()) {
            cropStart = (ship.isInvulnerable() && ship.getRemainingInvulnerability() % 4 < 2)
                ? 3 * sprite.getWidth()
                : sprite.getWidth();
        } else {
            cropStart = (ship.isInvulnerable() && ship.getRemainingInvulnerability() % 4 < 2)
                ? 2 * sprite.getWidth()
                : 0;
        }

        canvas.drawImage({
            image: sprite.getImage(),
            draw: new Rectangle({
                center: new Point(shipPosition.x, shipPosition.y),
                size: new Size(ship.getRadius() * 2, ship.getRadius() * 2)
            }),
            crop: new Rectangle(cropStart, 0, sprite.getWidth(), sprite.getHeight()),
            angle: ship.getAngle()
        });
    }
}