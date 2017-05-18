import InputHandlers from 'Input/inputHandlers.js';
import Render from 'Graphics/render.js';
import AudioManager from 'Sound/audioManager.js';
import GameState from 'Game/gameState.js';
import Debug from 'Game/debug.js';
import GameConstants from 'Game/gameConstants.js';

/**
 * @description Check html for validity and add missing elements if needed
 */
function initializeDom() {
    if (!document.body) {
        document.body = document.createElement('body');
    }

    var body = document.body;

    if (!document.getElementById('mainCanvas')) {
        var canvas = document.createElement('canvas');
        canvas.id = 'mainCanvas';

        document.body.appendChild(canvas);
    }

    body.onload = initializeGame;

    body.onkeydown = InputHandlers.onKeyDown;
    body.onkeyup = InputHandlers.onKeyUp;
    body.onclick = InputHandlers.onClick;
    body.onresize = InputHandlers.onResize;

    body.style.margin = '0';
    body.style.overflow = 'hidden';
}

/**
 * @description Initializes base game functionality:
 *              Preparing rendering
 *              Play soundtrack
 *              ...
 */
function initializeGame() {
    LibCanvas.extract();

    Render.initialize();
    Render.resize(window.innerWidth, window.innerHeight);

    GameState.initialize();
    GameState.restartGame();

    if (GameConstants.PLAY_SOUNDTRACK) {
        AudioManager.playSoundtrack();
    }
}

(function initializeApp() {
    window.Debug = Debug;

    initializeDom();
})();