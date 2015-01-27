var Player = Entity.extend({
    isTeleporting: false,
    teleportTo: null,
    teleportTimer: 0,

    isPlayer: true,

    init: function() {
        this._super();

        this.width = 40;
        this.height = 26;

        this.spriteHead = Gfx.load('head_detective');
        this.spriteBody = Gfx.load('body_detective');
        this.spriteShadow = Gfx.load('shadow_body_generic');
    },

    getNamePrefix: function () {
        return '';
    },

    getDisplayName: function () {
        return 'The Detective';
    },

    update: function() {
        if (!this.isTeleporting) {
            if (Keyboard.isKeyDown(KeyEvent.DOM_VK_LEFT) || Keyboard.isKeyDown(KeyEvent.DOM_VK_A)) {
                this.velocityX = -this.movementSpeed;
                this.direction = Direction.LEFT;
            } else if (Keyboard.isKeyDown(KeyEvent.DOM_VK_RIGHT) || Keyboard.isKeyDown(KeyEvent.DOM_VK_D)) {
                this.velocityX = +this.movementSpeed;
                this.direction = Direction.RIGHT;
            } else {
                this.velocityX = 0;
            }
            if (Keyboard.isKeyDown(KeyEvent.DOM_VK_UP) || Keyboard.isKeyDown(KeyEvent.DOM_VK_W)) {
                this.velocityY = -this.movementSpeed;
                this.direction = Direction.UP;
            } else if (Keyboard.isKeyDown(KeyEvent.DOM_VK_DOWN) || Keyboard.isKeyDown(KeyEvent.DOM_VK_S)) {
                this.velocityY = +this.movementSpeed;
                this.direction = Direction.DOWN;
            } else {
                this.velocityY = 0;
            }
        }

        this._super();

        if (this.isTeleporting) {
            if (this.teleportTimer > 0) {
                this.teleportTimer--;

                if (this.teleportTimer == 0) {
                    Game.loadMap(this.teleportTo);
                }
            }
        } else {
            var teleportTo = Game.map.getTeleport(this.getRect());
            if (!this.isTeleporting && teleportTo != null) {
                this.isTeleporting = true;
                this.teleportTo = teleportTo;
                this.teleportTimer = 30;
            }
        }
    }
});