window.mapScripts['wake_up'] = MapScript.extend({
    spawnedChest: false,

    run: function () {
        this.spawnedChest = false;

        if (!Settings.skipIntroDialogue) {
            Dialogue.prepare([
                {text: 'What..what is this?', player: true},
                {text: 'Where am I?', player: true}
            ]);
            Dialogue.show();
        }
    },

    redeploy: function () {
        if (!this.spawnedChest) {
            this.map.pause();

            this.spawnedChest = true;

            // Spawn the sword chest
            var chest = new Chest();
            chest.setCoord(9, 2);
            chest.direction = Direction.DOWN;
            chest.open = function () {
                this._super();

                Dialogue.prepare([
                    {text: 'It\'s a sword!', player: true}
                ]);
                Dialogue.show();

                Inventory.setWeapon(new SwordBasic());
            };
            this.map.add(chest);

            // Pan the camera to the chest, and play the "secret unlocked" noise (Zelda-esque-inspired-thing)
            Camera.followEntity(chest);
            Sfx.play('secret_success.wav');

            // After one second, pan the camera back to the player and give htem a bit of speech
            window.setTimeout(function() {
                Camera.followEntity(this.map.player);
                Dialogue.prepare([
                    {text: 'Am I going crazy? What is going on here?', player: true}
                ]);
                Dialogue.show();
            }.bind(this), 1000);
        }
    }
});