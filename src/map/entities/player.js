var Player = Entity.extend({
    damageFlash: 0,

    isTeleporting: false,
    teleportTo: null,
    teleportTimer: 0,

    isPlayer: true,

    init: function() {
        this._super();

        this.width = 32;
        this.height = 18;

        this.sprite = Gfx.load('hero');
        this.spriteShadow = Gfx.load('hero_shadow');
    },

    damage: function (changeValue) {
        if (this.isTeleporting) {
            return;
        }

        if (changeValue > 0 && !this.dead) {
            this.damageFlash = 1;
            Sfx.play('player_hurt.wav');
        }

        this._super(changeValue);

        this.syncHealthUi();

        Inventory.health = this.healthValue;
    },

    die: function() {
        if (this.dead) {
            return;
        }

        this._super();

        this.damageFlash = Infinity;

        Sfx.play('cinboom.wav');
        Game.reset();
    },

    update: function() {
        var ourRect = this.getRect();

        if (!this.isTeleporting && !this.dead && !this.isAttacking) {
            // Movement input ///
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

            // Attack input //
            if (Keyboard.wasKeyPressed(KeyEvent.DOM_VK_SPACE)) {
                this.attack();
            }

            // Red damage flash timer //
            if (this.damageFlash > 0) {
                this.damageFlash--;
            }

            // Entity collision (get hurt when you toch an enemy) //
            if (this.hurtTimer <= 0 && this.touchPainTimer <= 0) {
                var entities = Game.map.entities;
                var entitiesLength = entities.length;

                for (var i = 0; i < entitiesLength; i++) {
                    var entity = entities[i];

                    if (!entity.isNpc || !entity.causesDamage || entity.dead) {
                        continue;
                    }

                    var theirRect = entity.getRect();

                    if (Utils.rectIntersects(theirRect, ourRect)) {
                        this.damage(1);
                        this.touchPainTimer = 30;

                        // Need to increment the pain timer because otherwise it would never render
                        // (this code is above the entity update call, so it would be instantly brought to zero)
                        this.hurtTimer++;

                        break;
                    }
                }
            }
            else if (this.touchPainTimer > 0) {
                this.touchPainTimer--;
            }

            // Pickups //
            var entities = Game.map.entities;
            var entitiesLength = entities.length;

            for (var i = 0; i < entitiesLength; i++) {
                var entity = entities[i];

                if (!entity.isPickupable || !entity.instantPickup) {
                    continue;
                }

                var theirRect = entity.getRect();

                if (Utils.rectIntersects(theirRect, ourRect)) {
                    entity.pickUp();
                }
            }
        }

        if (this.dead) {
            this.damageFlash = Infinity;
        }

        this._super();

        if (this.isTeleporting) {
            this.damageFlash = 0;

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
    },

    sfxHurt: function () {
        Sfx.play('player_hurt.wav');
    },

    sfxDeath: function () {
        // TODO
    },

    draw: function(ctx) {
        if (this.damageFlash > 0) {
            ctx.rect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
            ctx.fillStyle = '#ff0000';
            ctx.fill();
        }

        this._super(ctx);
    }
});