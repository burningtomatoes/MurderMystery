var Weapon = Class.extend({
    damage: 1,
    attackRadius: 13,

    image: null,
    width: 12,
    height: 18,
    swordSway: 0,
    swordSwayTimer: 0,

    init: function () {
        this.damage = 1;
        this.image = Gfx.load('sword_basic');
    },

    playSfx: function() {
        Sfx.play('sword_attack.wav');
    },

    update: function (entity) {
        if (entity.velocityX == 0 && entity.velocityY == 0) {
            this.swordSway = 0;
        } else {
            if (this.swordSwayTimer > 0) {
                this.swordSwayTimer--;
            }

            if (this.swordSwayTimer <= 0) {
                this.swordSwayTimer = 30;
                this.swordSway = this.swordSway == -1 ? 1 : -1;
            }
        }
    },

    draw: function (entity, ctx) {
        ctx.drawImage(this.image, 0, 0, this.width, this.height, entity.headBob + this.swordSway, -this.height + 4, this.width, this.height);
    }
});