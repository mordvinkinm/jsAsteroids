import Sprites from 'Graphics/sprites.js';
import GameState from 'Game/gameState.js';
import Debug from 'Game/debug.js';
import GameConstants from 'Game/gameConstants.js';
import GameObjects from 'Game/gameObjects.js';

/**
 * @description Singleton of rendering manager
 */
function Render() {
    var self = this;

    var initialized = false;

    var width = 1024;
    var height = 768;

    var canvas;

    self.initialize = initialize;
    self.resize = resize;
    self.getFieldWidth = getFieldWidth;
    self.getFieldHeight = getFieldHeight;

    /**
     * @description Initializes rendering mechanism - set repaint interval, initializes canvas
     */
    function initialize() {
        if (initialized) {
            return;
        }

        setInterval(redraw, 1000 / GameConstants.FPS);

        canvas = getCanvas();

        initialized = true;
    }

    /**
     * @description Correctly handles resize event - resize canvas and DOM object, store new values
     * @param {number} newWidth 
     * @param {number} newHeight 
     */
    function resize(newWidth, newHeight) {
        width = newWidth;
        height = newHeight;

        var canvasDom = getCanvasDOM();

        canvasDom.width = width;
        canvasDom.height = height;
        canvasDom.style.width = width + 'px';
        canvasDom.style.height = height + 'px';
    }

    /**
     * @description Redraws the entire field
     */
    function redraw() {
        renderBackground();

        if (GameState.isGameOver()) {
            renderGameOver();
            return;
        }

        if (Debug.isDebugMode()) {
            renderDebugInfo();
        }

        renderScore();
        renderLives();
        renderExplosions();
        renderShip();
        renderMissiles();
        renderRocks();
    }

    /**
     * @description Renders space and debris backgrounds
     */
    function renderBackground() {
        canvas.drawImage(Sprites.nebulaImg.getImage(), 0, 0);
        canvas.drawImage(Sprites.debrisImg.getImage(), 0, 0);
    }

    /**
     * @description Renders "Game over" UI
     */
    function renderGameOver() {
        canvas.font = '36px Arial';
        canvas.fillStyle = '#FF0000';
        canvas.fillText('GAME OVER (Click to continue)', width / 2 - 240, height / 2);
        canvas.font = '24px Arial';
        canvas.fillText('Score: ' + GameState.getScore(), width / 2 - 60, height / 2 + 40);
    }

    /**
     * @description Renders score UI
     */
    function renderScore() {
        var score_str = 'Score: ' + GameState.getScore();

        canvas.font = '20px Arial';
        canvas.fillStyle = '#FFFFFF';
        canvas.fillText(score_str, 10, 20);
    }

    /**
     * @description Renders remaining life UI
     */
    function renderLives() {
        var lives_str = 'Lives: ' + GameState.getLives();

        canvas.font = '20px Arial';
        canvas.fillStyle = '#FFFFFF';
        canvas.fillText(lives_str, width - 100, 20);
    }

    /**
     * @description Renders actual ship
     */
    function renderShip() {
        GameState.getShip().render(canvas);
    }

    /**
     * @description Renders all missiles
     */
    function renderMissiles() {
        var missiles = GameObjects.getMissiles();

        for (var i = 0; i < missiles.length; i++) {
            missiles[i].render(canvas);
        }
    }

    /**
     * @description Renders all rocks
     */
    function renderRocks() {
        var rocks = GameObjects.getRocks();

        for (var i = 0; i < rocks.length; i++) {
            rocks[i].render(canvas);
        }
    }

    /**
     * @description Renders all explosions
     */
    function renderExplosions() {
        var explosions = GameObjects.getExplosions();
        for (var i = 0; i < explosions.length; i++) {
            explosions[i].render(canvas);
        }
    }

    /**
     * @description Gets actual field width
     * @returns {number}
     */
    function getFieldWidth() {
        return width;
    }

    /**
     * @description Gets actual field height
     * @returns {number}
     */
    function getFieldHeight() {
        return height;
    }

    /**
     * @description Renders debug info, including ship status, number of object of each type and so on
     */
    function renderDebugInfo() {
        var positionX = 20;
        var positionY = 40;
        var verticalStep = 10;

        canvas.font = '10px Arial';
        canvas.fillStyle = '#00FF00';

        var ship = GameState.getShip();

        canvas.fillText('Ship:', positionX, positionY);
        positionY += verticalStep;

        var coordsStr = '{ x: ' + parseInt(ship.getPosition().x) + ', y: ' + parseInt(ship.getPosition().y) + '}';
        canvas.fillText('Coords: ' + coordsStr, positionX, positionY);
        positionY += verticalStep;

        canvas.fillText('Angle: ' + ship.getAngle().toFixed(2), positionX, positionY);
        positionY += verticalStep;

        canvas.fillText('Shooting: ' + (ship.isShooting() ? 'yes' : 'no'), positionX, positionY);
        positionY += verticalStep;

        canvas.fillText('Invulnerable: ' +(ship.isInvulnerable() ? 'yes' : 'no'), positionX, positionY);
        positionY += 2 * verticalStep;

        canvas.fillStyle = '#00AAAA';
        canvas.fillText('MissileCount: ' + GameObjects.getMissiles().length, positionX, positionY);
        positionY += 2 * verticalStep;

        canvas.fillStyle = '#FF0000';
        canvas.fillText('RockCount: ' + GameObjects.getRocks().length, positionX, positionY);
        positionY += 2 * verticalStep;

        canvas.fillStyle = '#AAAAAA';
        canvas.fillText('ExplosionsCount: ' + GameObjects.getExplosions().length, positionX, positionY);
        positionY += 2 * verticalStep;
    }

    /**
     * @description Gets canvas DOM object
     * @returns {HTMLElement}
     */
    function getCanvasDOM() {
        return document.getElementById('mainCanvas');
    }

    /**
     * @description Gets rendering context of the canvas
     */
    function getCanvas() {
        return getCanvasDOM().getContext('2d-libcanvas');
    }
}

var instance = new Render();

export default instance;