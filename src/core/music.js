var Music = {
    sounds: { },

    prepareSound: function(filename) {
        if (typeof(this.sounds[filename]) == 'undefined') {
            this.sounds[filename] = new Audio('assets/audio/' + filename);
        }

        return this.sounds[filename];
    },

    loopSound: function(filename) {
        var sound = this.prepareSound(filename);
        sound.currentTime = 0;
        sound.addEventListener('ended', function() {
            this.currentTime = 0;
            this.load();
            this.play();
        });
        sound.load();
        sound.play();
    },

    stopSound: function(filename) {
        var sound = this.prepareSound(filename);
        sound.pause();
    },

    stopAll: function() {
        for (var sound in this.sounds) {
            var soundObj = this.sounds[sound];
            soundObj.pause();
        }
    }
};