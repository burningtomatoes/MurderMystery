var Pot = Container.extend({
    init: function () {
        this._super();

        this.spriteNormal = Gfx.load('pot');
        this.spriteDestroyed = Gfx.load('pot_shards');
        this.sprite = this.spriteNormal;
        this.width = 32;
        this.height = 32;

        this.generateHurtSprite();
    },

    sfxHurt: function () {
        Sfx.play('break_pot.wav');
    },

    die: function () {
        this._super();
        // Once we are reduced to shards, you can walk on us.
        this.causesCollision = false;

        // Throw around random coins
        var randomAmount = Math.round(Math.random() * 3) + 1;

        for (var i = 0; i < randomAmount; i++) {
            var coin = new Coin();

            do
            {
                // Find a random non-blocked position
                coin.posX = this.posX + Math.round(Math.random() * 10) - 5;
                coin.posY = this.posY + Math.round(Math.random() * 10) - 5;
            }
            while (Game.map.isRectBlocked(coin.getRect(), false, this));

            coin.velocityX = Math.random() * 3;
            coin.velocityY = Math.random() * 3;

            coin.sprite.index = Math.round(Math.random() * coin.sprite.frameCount);

            Game.map.add(coin);
        }
    }
});