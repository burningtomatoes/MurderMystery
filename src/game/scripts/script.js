var Script = Class.extend({
    map: null,

    init: function (map) {
        this.map = map;
    },

    run: function () {
        console.warn('[Script] This script has not implemented run()');
    },

    update: function() {
        // ...
    }
});