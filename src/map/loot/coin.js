var Coin = Loot.extend({
    init: function() {
        this._super();

        this.height = 16;
        this.width = 16;

        this.sprite = new Animation('coin', 16, 16, 15, 10, true);
        this.spriteShadow = null;
    },

    pickUp: function() {
        this._super();

        Sfx.play('coin_pickup.wav');

        Inventory.addCoins(1);
    }
});