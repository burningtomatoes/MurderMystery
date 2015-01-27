var Officer = Entity.extend({
    isNpc: true,

    slightlyMoveTimer: 0,
    slightlyMoveOverride: 0,

    name: null,

    init: function () {
        this._super();

        this.width = 40;
        this.height = 26;

        this.spriteHead = Gfx.load('head_officer');
        this.spriteBody = Gfx.load('body_officer');
        this.spriteShadow = Gfx.load('shadow_body_generic');

        this.slightlyMoveTimer = 30;

        this.name = Names.getRandomOfficerName();
    },

    getNamePrefix: function () {
        return 'Officer';
    },

    getDisplayName: function () {
        return this.getNamePrefix() + ' ' + this.name;
    },

    update: function () {
        this._super();

        if (this.slightlyMoveTimer > 0) {
            this.slightlyMoveTimer--;

            if (this.slightlyMoveTimer == 0) {
                this.slightlyMoveOverride = Math.round(Math.random() * 4 - 2);
                this.slightlyMoveTimer = Math.round(Math.random() * 60) + 60;
            }
        }

        this.headBob = this.slightlyMoveOverride;
    }
});