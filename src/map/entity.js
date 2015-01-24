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

    init: function () {
        this.width = 32;
        this.height = 32;
        this.direction = Direction.DOWN;
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
            if (this.sprite.isAnimation) {
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
        }
    },

    update: function () {
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
    }
});