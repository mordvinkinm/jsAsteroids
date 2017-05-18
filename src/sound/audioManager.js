/**
 * @description Singleton responsible for playing all sounds in the game
 */
function AudioManager() {
    var self = this;

    var soundtrack = new Audio('res/sounds/soundtrack.mp3');
    var missileSound = new Audio('res/sounds/missile.mp3');
    var explosionSound = new Audio('res/sounds/explosion.mp3');
    var thrustSound = new Audio('res/sounds/thrust.mp3');

    self.playSoundtrack = playSoundtrack;
    self.playMissileSound = playMissileSound;
    self.playExplosionSound = playExplosionSound;
    self.playThrustSound = playThrustSound;
    self.stopThrustSound = stopThrustSound;

    self.stopAllSounds = stopAllSounds;

    /**
     * @description Plays a background soundtrack
     */
    function playSoundtrack() {
        soundtrack.play();
    }

    /**
     * @description Plays a missile sound
     */
    function playMissileSound() {
        missileSound.play();
    }

    /**
     * @description Plays an explosion sound
     */
    function playExplosionSound() {
        explosionSound.play();
    }

    /**
     * @description Plays ship thrust sound
     */
    function playThrustSound() {
        thrustSound.play();
    }

    /**
     * @description Mutes sound of ship thrust
     */
    function stopThrustSound() {
        stopSound(thrustSound);
    }

    /**
     * @description Mutes all sounds except soundtrack
     */
    function stopAllSounds() {
        stopSound(thrustSound);
        stopSound(missileSound);
        stopSound(explosionSound);
    }

    /**
     * @description Helper to mute a particular sound
     * @param {HTMLAudioElement} sound 
     */
    function stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }
}

var instance = new AudioManager();

export default instance;