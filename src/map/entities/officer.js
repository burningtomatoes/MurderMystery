var Officer = Entity.extend({
    isNpc: true,

    init: function() {
        this._super();

        this.width = 40;
        this.height = 26;

        this.spriteHead = Gfx.load('head_officer');
        this.spriteBody = Gfx.load('body_officer');
        this.spriteShadow = Gfx.load('shadow_body_generic');
    }
});