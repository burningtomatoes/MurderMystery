var SwordTroll = Weapon.extend({
    init: function () {
        this._super();

        this.damage = 1;
        this.image = Gfx.load('sword_troll');
    }
});