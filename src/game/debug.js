/**
 * @description Singleton responsible for all debug-related operations
 */
function Debug() {
    var self = this;

    var debugModeEnabled = false;

    self.log = log;
    self.isDebugMode = isDebugMode;

    self.enableDebugMode = enableDebugMode;
    self.disableDebugMode = disableDebugMode;

    /**
     * @description Logs message to the console if debug mode enabled
     * @param {string} message Message to log
     */
    function log(message) {
        if (debugModeEnabled) {
            /* eslint-disable no-console */
            console.log(message);
            /* eslint-enable no-console */
        }
    }

    /**
     * @description Checks if application is in debug mode or not
     */
    function isDebugMode() {
        return debugModeEnabled;
    }

    /**
     * @description Enables application debug mod
     */
    function enableDebugMode() {
        debugModeEnabled = true;
    }

    /**
     * @description Disables application debug mode
     */
    function disableDebugMode() {
        debugModeEnabled = false;
    }
}

var instance = new Debug();

export default instance;