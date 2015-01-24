window.mapScripts['epic_win'] = MapScript.extend({
    run: function () {
        Camera.trackingEntity = null;
        Camera.centerToMap();

        Sfx.play('secret_success.wav');

        Dialogue.prepare([
            {text: 'You are the true hero!'},
            {text: 'You win the game! You found the treasure room!'},
            {text: 'Yeah, so, this is all I had time for.'},
            {text: 'Please forgive me.'},
            {text: 'Oh, and you get this kick ass sword for free with your win.'}
        ], function() {
            Camera.trackingEntity = Game.map.player;
        });
        Dialogue.show();

        Inventory.setWeapon(new SwordSuper());

        Inventory.health = 52;
        Game.map.player.healthCapacity = 52;
        Game.map.player.healthValue = 52;
        Game.map.player.syncHealthUi();
    }
});