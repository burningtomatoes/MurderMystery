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

        // Clear out the persistent map cache so the entire game world is reset.
        this.maps = [];
        this.lastMapId = null;

        // Generate the backstory for this game session randomly.
        // This will generate the characters, where they were, what they did, what they know, etc.
        Story.generateStory();

        // Show the intro text (nametag / time)
        IntroText.run(function (e) {
            // Load up the main hall / living room and spawn the guests in the living room.
            this.loadMap('main_room', function (map) {
                e.done();

                Story.spawnGuests(map);

                Music.loopSound('rain_loop.mp3');

                map.runScript(scrWalkIn);
            });
        }.bind(this));


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

    loadMap: function (id, loadCallback) {
        if (loadCallback == null) {
            loadCallback = function () { };
        }

        var mapReady = function () {
            loadCallback(this.map);

            Canvas.$canvas.fadeIn(this.lastMapId == null ? 2000 : 'fast');
            this.lastMapId = id;

            Camera.onMapLoaded();

            $('#location').text(this.map.data.properties.name);
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