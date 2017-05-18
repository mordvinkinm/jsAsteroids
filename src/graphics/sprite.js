/**
 * Represents sprite (animated or not)
 * @param {string} url Image url. Mandatory parameter
 * @param {object} overridenSize Actual size of image in large combined sprite (or in animated sprite). Optional.
 * @param {number} animationTime Time of animation. Optional.
 */
export default function Sprite(url, overridenSize, animationTime) {
    var self = this;

    var image = new Image();

    var size;
    var radius;

    image.onload = init;
    image.src = url;

    /**
     * @description Initializes image parameters (size, center) after image reload
     */
    function init() {
        size = overridenSize || { width: image.width, height: image.height };
        radius = Math.max(size.width, size.height) / 2.0;
        animationTime = animationTime || 0;
    }

    self.getImage = getImage;
    self.getWidth = getWidth;
    self.getHeight = getHeight;
    self.getRadius = getRadius;
    self.isAnimated = isAnimated;
    self.getAnimationTime = getAnimationTime;

    function getImage(){
        return image;
    }

    /**
     * @description Gets sprite width
     * @returns {number} Positive number
     */
    function getWidth() {
        return size.width;
    }

    /**
     * @description Get sprite height
     * @returns {number} Positive number
     */
    function getHeight() {
        return size.height;
    }

    /**
     * @description Get sprite radius (actually half of largest side)
     * @returns {number} Positive number
     */
    function getRadius() {
        return radius;
    }

    /**
     * @description Checks if sprite is animated or not
     */
    function isAnimated() {
        return !!animationTime;
    }

    /**
     * @description Gets animation time for an animated sprite
     */
    function getAnimationTime(){
        return animationTime;
    }
}