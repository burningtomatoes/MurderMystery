var Player = Entity.extend({
    isTeleporting: false,
    teleportTo: null,
    teleportTimer: 0,

    isPlayer: true,

    canControl: true,

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

    footstepDelayer: 0,

    update: function() {
        if (this.velocityX != 0 || this.velocityY != 0) {
            if (this.footstepDelayer > 0) {
                this.footstepDelayer--;
            }

            if (this.footstepDelayer == 0) {
                Sfx.play('footstep.wav', 0.25);
                this.footstepDelayer = 20;
            }
        }

        if (!this.isTeleporting && this.canControl) {
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

            if (Keyboard.wasKeyPressed(KeyEvent.DOM_VK_SPACE)) {
                var interactRect = this.getInteractRadius();

                var entities = this.map.getEntitiesInRect(interactRect, this);
                var entity = entities.length > 0 ? entities[0] : null;

                if (entity != null) {
                    entity.interact(this);
                    return;
                }

                var teleport = this.map.getTeleport(interactRect);

                if (teleport != null) {
                    this.isTeleporting = true;
                    Game.loadMap(teleport);
                    this.map.remove(this);
                    Sfx.play('door_closing.wav');
                    return;
                }
            }
        }

        this._super();
    }
});