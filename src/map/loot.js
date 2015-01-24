var Loot = Entity.extend({
    causesCollision: false,
    causesDamage: false,
    receivesDamage: false,

    isLoot: true,
    isPickupable: true,
    instantPickup: true,

    init: function () {
        // ...
    },

    pickUp: function () {
        // Remove ourselves from the world
        Game.map.remove(this);
    },

    update: function () {
        this._super();

        this.headBob = 0;

        if (this.velocityX != 0) {
            this.velocityX = MathHelper.lerp(this.velocityX, 0, 0.1);
        }

        if (this.velocityY != 0) {
            this.velocityY = MathHelper.lerp(this.velocityY, 0, 0.1);
        }
    }
});