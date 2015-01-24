// Global scope repository that will contain all map scripts. Each map script should self-register to this array.
// We need this array because the map data will contain script names as a raw string.
window.mapScripts = [];

/**
 * Abstract base class for all map scripts.
 */
var MapScript = Class.extend({
    map: null,

    /**
     * Initializes a new MapScript object for a specific map.
     *
     * @param map
     */
    init: function (map) {
        this.map = map;
    },

    /**
     * Called when the map is first loaded (loaded from network, 1st time).
     */
    run: function () {
        // ...
    },

    /**
     * Called when the map is redeployed (loaded from memory, 2nd time and any later load).
     */
    redeploy: function () {
        // ...
    }
});