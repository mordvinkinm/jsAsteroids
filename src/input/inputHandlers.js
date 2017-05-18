import KeyCodes from 'Input/keyCodes.js';
import Render from 'Graphics/render.js';
import GameState from 'Game/gameState.js';

/**
 * @description Occurs when the user pushes a key (on the keyboard)
 * @param {object} evt Keyboard event
 */
function onKeyDown(evt) {
    var key = evt.keyCode;

    var ship = GameState.getShip();

    if (key === KeyCodes.up) {
        ship.startThrusting();
    } else if (key === KeyCodes.left) {
        ship.startTurningLeft();
    } else if (key === KeyCodes.right) {
        ship.startTurningRight();
    } else if (key === KeyCodes.space) {
        ship.startShooting();
    }
}

/**
 * @description Occurs when the user releases a key (on the keyboard)
 * @param {object} evt Keyboard event
 */
function onKeyUp(evt) {
    var key = evt.keyCode;

    var ship = GameState.getShip();

    if (key === KeyCodes.up) {
        ship.stopThrusting();
    } else if (key === KeyCodes.left || key === KeyCodes.right) {
        ship.stopTurning();
    } else if (key === KeyCodes.space) {
        ship.stopShooting();
    }
}

/**
 * @description Occurs when user performs a mouse-click on window
 */
function onClick() {
    if (GameState.isGameOver()){
        GameState.restartGame();
    }
}

/**
 * @description Occurs when user resizes window
 * @param {object} evt A "resize" event
 */
function onResize(evt) {
    Render.resize(evt.target.innerWidth, evt.target.innerHeight);
}

export default { onKeyDown, onKeyUp, onClick, onResize };