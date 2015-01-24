var SwordSuper = Weapon.extend({
    init: function () {
        this._super();

        this.damage = 3000;
        this.image = Gfx.load('sword_super');
        this.height = 32;
    }
});