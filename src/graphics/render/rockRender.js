import Sprites from 'Graphics/sprites.js';

/**
 * @description Handles rendering of the rock object
 * @param {Rock} rock Rock data object
 */
export default function RockRender(rock) {
    var self = this;

    var sprite = Sprites.getAsteroidImg();

    self.render = render;

    /**
     * @description Renders rock + debug graphics (if needed) on the canvas
     * @param {RenderingContext} canvas 
     */
    function render(canvas) {
        var rockPos = rock.getPosition();

        if (Debug.isDebugMode()) {
            canvas.beginPath();
            canvas.arc(rockPos.x, rockPos.y, rock.getRadius(), 0, 2 * Math.PI, false);
            canvas.fillStyle = 'red';
            canvas.fill();
            canvas.lineWidth = 3;
            canvas.strokeStyle = '#330000';
            canvas.stroke();
        }

        canvas.drawImage({
            image: sprite.getImage(),
            draw: new Rectangle({
                center: new Point(rockPos.x, rockPos.y),
                size: new Size(rock.getRadius() * 2, rock.getRadius() * 2)
            }),
            crop: new Rectangle(0, 0, sprite.getWidth(), sprite.getHeight()),
            angle: rock.getAngle()
        });
    }
}