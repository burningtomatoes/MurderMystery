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

    spriteBody: null,
    spriteHead: null,
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
    clipping: true,

    map: null,

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
        if (!this.clipping) {
            return true;
        }
        var projectedPosX = this.posX - this.movementSpeed;
        var projectedRect = this.getRect(projectedPosX, null);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveRight: function () {
        if (!this.clipping) {
            return true;
        }
        var projectedPosX = this.posX + this.movementSpeed;
        var projectedRect = this.getRect(projectedPosX, null);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveUp: function () {
        if (!this.clipping) {
            return true;
        }
        var projectedPosY = this.posY - this.movementSpeed;
        var projectedRect = this.getRect(null, projectedPosY);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveDown: function () {
        if (!this.clipping) {
            return true;
        }
        var projectedPosY = this.posY + this.movementSpeed;
        var projectedRect = this.getRect(null, projectedPosY);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveAnywhere: function () {
        if (!this.clipping) {
            return true;
        }
        return (this.canMoveLeft() || this.canMoveDown() || this.canMoveUp() || this.canMoveRight());
    },

    getNamePrefix: function () {
        return '';
    },

    getDisplayName: function () {
        return '???';
    },

    draw: function (ctx) {
        ctx.save();
        ctx.translate(Camera.translateX(this.posX), Camera.translateY(this.posY));

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

        if (this.spriteShadow != null) {
            ctx.drawImage(this.spriteShadow, 0, 0, this.width, this.height, 1, 1, this.width, this.height);
        }

        if (this.spriteBody != null) {
            if (this.spriteBody.isAnimation) {
                this.spriteBody.draw(ctx, this.headBob, 0);
            } else {
                ctx.drawImage(this.spriteBody, 0, 0, this.width, this.height, Math.round(this.headBob / 2), 0, this.width, this.height);
            }
        }

        if (this.spriteHead != null) {
            if (this.spriteHead.isAnimation) {
                this.spriteHead.draw(ctx, this.headBob, 0);
            } else {
                ctx.drawImage(this.spriteHead, 0, 0, this.width, this.height, Math.round((this.spriteBody.width / 2) - (this.spriteHead.width / 2) - (this.headBob / 2)), 0, this.width, this.height);
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

        if (this.spriteBody.isAnimation) {
            this.spriteBody.update();
        }

        if (this.spriteHead.isAnimation) {
            this.spriteHead.update();
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

    doBasicDialogue: function (player, data, cb) {
        player.canControl = false;

        var textCompleteCallback = function (payload) {
            player.canControl = true;
            Camera.followEntity(player);

            if (cb) {
                cb(payload);
            }
        };

        Camera.followEntity(this);

        Dialogue.prepare(data, textCompleteCallback);
        Dialogue.show();
    },

    interact: function (player) {
        this.doBasicDialogue(player, [
            { text: 'Uh...hi there.', name: this.getDisplayName() }
        ]);
    },

    lookAt: function (entity) {
        var xDiff = this.posX - entity.posX;
        var yDiff = this.posY - entity.posY;

        if (xDiff > 5) {
            this.direction = Direction.LEFT;
        } else if (xDiff < -5) {
            this.direction = Direction.RIGHT;
        }

        if (yDiff > 5) {
            this.direction = Direction.UP;
        } else if (yDiff < -5) {
            this.direction = Direction.DOWN;
        }
    },

    getInteractRadius: function () {
        var baseRect = this.getRect();

        var interactRange = 20;

        var margin = 6;
        switch (this.direction) {
            default:
            case Direction.DOWN:
                baseRect.top += this.height - margin;
                baseRect.height = interactRange;
                baseRect.width = interactRange;
                baseRect.left += this.width / 2;
                break;
            case Direction.UP:
                baseRect.top -= this.height;
                baseRect.height = interactRange;
                baseRect.width = interactRange;
                break;
            case Direction.LEFT:
                baseRect.height = interactRange;
                baseRect.width = interactRange;
                baseRect.left -= baseRect.width / 2;
                baseRect.top += margin;
                break;
            case Direction.RIGHT:
                baseRect.height = interactRange;
                baseRect.width = interactRange;
                baseRect.left += baseRect.width;
                baseRect.top -= margin;
                break;
        }

        baseRect.bottom = baseRect.top + baseRect.height;
        baseRect.right = baseRect.left + baseRect.width;
        return baseRect;
    }
});