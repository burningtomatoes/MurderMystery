var Direction = {
    UP: 1,
    LEFT: 2,
    DOWN: 3,
    RIGHT: 4
};

var Entity = Class.extend({
    posX: 0,
    posY: 0,

    height: 0,
    width: 0,

    sprite: null,
    spriteShadow: null,
    spriteHurt: null,

    velocityX: 0,
    velocityY: 0,

    movementSpeed: 2,

    direction: 0,

    headBobTimer: 0,
    headBob: 0,

    weapon: null,

    healthValue: 6,
    healthCapacity: 12,
    dead: false,

    hurtTimer: 0,

    causesCollision: true,
    receivesDamage: true,
    causesDamage: false,

    init: function () {
        this.width = 32;
        this.height = 32;
        this.direction = Direction.DOWN;
    },

    generateHurtSprite: function () {
        this.spriteHurt = this.sprite;

        var mkSprite = function () {
            this.spriteHurt = Gfx.makeHurtSprite(this.sprite);
        }.bind(this);

        this.sprite.onload = mkSprite;

        if (this.sprite.complete) {
            mkSprite();
        }
    },

    damage: function (changeValue) {
        if (this.dead || !this.receivesDamage) {
            return;
        }

        if (changeValue > 0) {
            // Damage dealt
            this.hurtTimer = 1;
        } else if (changeValue < 0) {
            // Health added
            this.hurtTimer = 0;
        }

        this.drewHurtFrame = false;
        this.healthValue -= changeValue;

        if (this.healthValue <= 0) {
            this.healthValue = 0;
            this.die();
        } else if (changeValue > 0) {
            this.sfxHurt();
        }
    },

    die: function () {
        if (this.dead || !this.receivesDamage) {
            return;
        }

        this.dead = true;
        this.weapon = null;
        this.sfxDie();
    },

    sfxHurt: function () {
        Sfx.play('enemy_hurt.wav');
    },

    sfxDie: function () {
        Sfx.play('goblin_death.wav');
    },

    setPos: function (x, y) {
        this.posX = x;
        this.posY = y;
    },

    setCoord: function (x, y) {
        this.posX = (Settings.tileSize * x) + ((Settings.tileSize / 2) - (this.width / 2));
        this.posY = (Settings.tileSize * y) + ((Settings.tileSize / 2) - (this.height / 2));
    },

    getPos: function () {
        return {
            x: this.posX,
            y: this.posY
        };
    },

    canMoveLeft: function () {
        var projectedPosX = this.posX - this.movementSpeed;
        var projectedRect = this.getRect(projectedPosX, null);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveRight: function () {
        var projectedPosX = this.posX + this.movementSpeed;
        var projectedRect = this.getRect(projectedPosX, null);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveUp: function () {
        var projectedPosY = this.posY - this.movementSpeed;
        var projectedRect = this.getRect(null, projectedPosY);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveDown: function () {
        var projectedPosY = this.posY + this.movementSpeed;
        var projectedRect = this.getRect(null, projectedPosY);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    isAttacking: false,
    attackTimer: 0,

    attack: function () {
        if (this.isAttacking) {
            return;
        }

        this.isAttacking = true;
        this.attackTimer = 10;

        if (this.weapon != null) {
            this.weapon.playSfx();
        }

        var attackRect = this.getAttackRadius();
        var entitiesAffected = Game.map.getEntitiesInRect(attackRect, this);

        for (var i = 0; i < entitiesAffected.length; i++) {
            var entity = entitiesAffected[i];

            if (!entity.receivesDamage || entity.dead) {
                continue;
            }

            entity.damage(this.weapon == null ? 0 : this.weapon.damage);
        }
    },

    drewHurtFrame: false,

    draw: function (ctx) {
        ctx.save();
        ctx.translate(Camera.translateX(this.posX), Camera.translateY(this.posY));

        // Beware: I just sort of bruteforced these translations until they looked right. So, yeah.
        switch (this.direction) {
            case Direction.UP:
                break;
            case Direction.RIGHT:
                ctx.rotate(90 * Math.PI / 180);
                ctx.translate(-this.height / 2, -this.width + (this.width / 4));
                break;
            case Direction.DOWN:
                ctx.rotate(180 * Math.PI / 180);
                ctx.translate(-this.width, -this.height);
                break;
            case Direction.LEFT:
                ctx.rotate(270 * Math.PI / 180);
                ctx.translate(-this.width + (this.width / 4), this.height / 2);
                break;
        }

        if (this.weapon != null) {
            this.weapon.draw(this, ctx);
        }

        if (this.spriteShadow != null) {
            ctx.drawImage(this.spriteShadow, 0, 0, this.width, this.height, 1, 1, this.width, this.height);
        }

        if (this.sprite != null) {
            if (this.hurtTimer > 0) {
                ctx.drawImage(this.spriteHurt, 0, 0, this.width, this.height, this.headBob, 0, this.width, this.height);
                this.drewHurtFrame = true;
            } else if (this.sprite.isAnimation) {
                this.sprite.draw(ctx, this.headBob, 0);
            } else {
                ctx.drawImage(this.sprite, 0, 0, this.width, this.height, this.headBob, 0, this.width, this.height);
            }
        }

        ctx.restore();

        if (Settings.drawCollisions) {
            var r = this.getRect();

            ctx.beginPath();
            ctx.rect(Camera.translateX(r.left), Camera.translateY(r.top), r.width, r.height);
            ctx.strokeStyle = "#FFCCAA";
            ctx.stroke();
            ctx.closePath();

            if (this.isAttacking) {
                var r = this.getAttackRadius();

                ctx.beginPath();
                ctx.rect(Camera.translateX(r.left), Camera.translateY(r.top), r.width, r.height);
                ctx.strokeStyle = "#AACCFF";
                ctx.stroke();
                ctx.closePath();
            }
        }
    },

    update: function () {
        if (this.hurtTimer > 0 && this.drewHurtFrame) {
            this.hurtTimer--;
        }

        if (this.dead) {
            return;
        }

        if (this.velocityX < 0 && (!this.canMoveLeft() || this.isAttacking)) {
            this.velocityX = 0;
        }

        if (this.velocityX > 0 && (!this.canMoveRight() || this.isAttacking)) {
            this.velocityX = 0;
        }

        if (this.velocityY < 0 && (!this.canMoveUp() || this.isAttacking)) {
            this.velocityY = 0;
        }

        if (this.velocityY > 0 && (!this.canMoveDown() || this.isAttacking)) {
            this.velocityY = 0;
        }

        this.posX += this.velocityX;
        this.posY += this.velocityY;

        if (this.velocityX != 0 || this.velocityY != 0) {
            if (this.headBobTimer > 0) {
                this.headBobTimer--;
            }

            if (this.headBobTimer <= 0) {
                this.headBob = (this.headBob == 1 ? -1 : 1);
                this.headBobTimer = 15;
            }
        } else {
            this.headBob = 0;
        }

        if (this.weapon != null) {
            this.weapon.update(this);

            if (this.attackTimer > 0) {
                this.weapon.swordSway = this.attackTimer;
                this.attackTimer--;

                if (this.attackTimer <= 0) {
                    this.isAttacking = false;
                }
            }
        } else {
            this.isAttacking = false;
        }

        if (this.sprite.isAnimation) {
            this.sprite.update();
        }
    },

    getRect: function (overrideX, overrideY) {
        var x = this.posX;
        var y = this.posY;

        if (overrideX != null) {
            x = overrideX;
        }

        if (overrideY != null) {
            y = overrideY;
        }

        var margin = 6;
        var rect = {
            left: x + (margin / 2),
            top: y + (margin / 2),
            height: this.height - margin,
            width: this.width - margin
        };
        rect.bottom = rect.top + rect.height;
        rect.right = rect.left + rect.width;
        // TODO Specific collision masks for left/right directions?
        return rect;
    },

    getAttackRadius: function () {
        var baseRect = this.getRect();

        var weapHeight = this.weapon == null ? 10 : this.weapon.height;
        var weapWidth = this.weapon == null ? 10 : this.weapon.width;

        var margin = 6;
        switch (this.direction) {
            default:
            case Direction.DOWN:
                baseRect.top += this.height - margin;
                baseRect.height = weapHeight;
                baseRect.width = weapWidth;
                baseRect.left += this.width / 2;
                break;
            case Direction.UP:
                baseRect.top -= this.height;
                baseRect.height = weapHeight;
                baseRect.width = weapWidth;
                break;
            case Direction.LEFT:
                baseRect.height = weapWidth;
                baseRect.width = weapHeight;
                baseRect.left -= baseRect.width / 2;
                baseRect.top += margin;
                break;
            case Direction.RIGHT:
                baseRect.height = weapWidth;
                baseRect.width = weapHeight;
                baseRect.left += baseRect.width;
                baseRect.top -= margin;
                break;
        }

        baseRect.bottom = baseRect.top + baseRect.height;
        baseRect.right = baseRect.left + baseRect.width;
        return baseRect;
    }
});