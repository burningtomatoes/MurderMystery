var Game = {
    map: null,
    maps: [],
    lastMapId: null,

    initialize: function () {
        Canvas.initialize();
        Keyboard.bind();
    },

    start: function () {
        Canvas.$canvas.hide();

        this.maps = [];
        this.lastMapId = null;

        Inventory.clear();

        this.loadMap('dungeon_1');
    },

    resetting: false,

    reset: function (callback) {
        if (callback == null) {
            callback = function() { };
        }

        if (this.resetting) {
            return;
        }

        this.resetting = true;

        Dialogue.hide();
        $('#hud').hide();

        if (this.map != null) {
            this.map.pause();
        }

        var completeReset = function() {
            this.map = null;
            this.start();
            this.resetting = false;
        }.bind(this);

        Canvas.$canvas.fadeOut(3000, function() {
            Music.stopAll();
            window.setTimeout(completeReset, 1000);
        });
    },

    loadMap: function (id) {
        var mapReady = function () {
            Canvas.$canvas.delay(200).fadeIn(this.lastMapId == null ? 2000 : 'fast');
            this.lastMapId = id;
        }.bind(this);

        var execLoad = function() {
            if (typeof this.maps[id] == 'undefined') {
                this.map = new Map();
                this.maps[id] = this.map;
                this.map.load(id, function (okay) {
                    if (!okay) {
                        alert('Something went wrong, could not load the next part of the game. Sorry... we let you down.');
                        return;
                    }

                    if (!this.map.paused) {
                        $('#hud').show();
                    }

                    mapReady();
                }.bind(this));
            } else {
                this.map = this.maps[id];
                this.map.redeploy();
                mapReady();
            }
        }.bind(this);

        if (!Canvas.$canvas.is(':visible')) {
            execLoad();
        } else {
            Canvas.$canvas.fadeOut('fast', execLoad);
        }
    },

    draw: function (ctx) {
        if (this.map != null) {
            this.map.draw(ctx);
        }
    },

    update: function () {
        if (this.map != null) {
            this.map.update();
        }

        Dialogue.update();
        Keyboard.update();
        Camera.update();
    }
};