var Sfx = {
    sounds: { },

    preload: function() {
        // Note to self: Do not preload "burning tomato". It doesn't work due to timing issues and just causes overhead.
    },

    load: function(fileName) {
        if (typeof Sfx.sounds[fileName] != 'undefined') {
            return Sfx.sounds[fileName];
        }

        Sfx.sounds[fileName] = new Audio('assets/sfx/' + fileName);
        Sfx.sounds[fileName].load();

        return Sfx.sounds[fileName];
    },

    play: function(soundId, volume) {
        if (volume == null) {
            volume = 0.8;
        }

        if (typeof Sfx.sounds[soundId] == 'undefined') {
            Sfx.load(soundId);
        } else {
            // Call load() every time to fix Chrome issue where sound only plays first time
            Sfx.sounds[soundId].load();
        }

        Sfx.sounds[soundId].volume = volume;
        Sfx.sounds[soundId].play();
    }
};