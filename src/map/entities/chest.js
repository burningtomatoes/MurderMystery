var Chest = Container.extend({
    init: function() {
        this._super();

        this.spriteNormal = Gfx.load('chest_closed');
        this.spriteDestroyed = Gfx.load('chest_open');
        this.sprite = this.spriteNormal;
        this.width = 48;
        this.height = 32;

        this.generateHurtSprite();
    },

    damage: function (value) {
        if (value === 0) {
            // This chest can be opened w/o a weapon as well. Zero damage is fine by us.
            value++;
        }

        this._super(value);
    },

    open: function () {
        // Large amount of coin!
        var randomAmount = Math.round(Math.random() * 100) + 1;

        for (var i = 0; i < randomAmount; i++) {
            var coin = new Coin();

            do
            {
                // Find a random non-blocked position
                coin.posX = this.posX + Math.round(Math.random() * 100);
                coin.posY = this.posY + Math.round(Math.random() * 100);
            }
            while (Game.map.isRectBlocked(coin.getRect(), false));

            coin.velocityX = Math.random() * 3;
            coin.velocityY = Math.random() * 3;

            coin.sprite.index = Math.round(Math.random() * coin.sprite.frameCount);

            Game.map.add(coin);
        }
    }
});