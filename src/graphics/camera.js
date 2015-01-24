var Camera = {
    x: 0,
    y: 0,

    applyX: 0,
    applyY: 0,

    yLocked: false,
    xLocked: false,

    translateX: function(x) {
        return Math.round(x + this.applyX);
    },

    translateY: function(y) {
        return Math.round(y + this.applyY);
    },

    translate: function(x, y) {
        return {
            x: this.translateX(x),
            y: this.translateY(y)
        };
    },

    setPos: function(x, y) {
        this.x = x;
        this.y = y;
    },

    trackingEntity: null,

    centerToMap: function() {
        this.x = Canvas.canvas.width / 2 - Game.map.widthPx / 2;
        this.y = Canvas.canvas.height / 2 - Game.map.heightPx / 2;
        this.xLocked = (Canvas.canvas.width > Game.map.widthPx);
        this.yLocked = (Canvas.canvas.height > Game.map.heightPx);
        this.trackingEntity = null;
    },

    trackHard: false,

    followEntity: function(e, hard) {
        this.trackingEntity = e;
        this.trackHard = !!hard;
    },

    update: function() {
        if (this.trackingEntity != null) {
            if (!this.xLocked) {
                var desiredX = Canvas.canvas.width / 2 - this.trackingEntity.posX - this.trackingEntity.width / 2;
                var maxXSpace = Game.map.widthPx - Canvas.canvas.width;
                this.x = MathHelper.clamp(desiredX, -maxXSpace, 0);
            }

            if (!this.yLocked) {
                var desiredY = Canvas.canvas.height / 2 - this.trackingEntity.posY - this.trackingEntity.height / 2;
                var maxYSpace = Game.map.heightPx - Canvas.canvas.height;
                this.y = MathHelper.clamp(desiredY, -maxYSpace, 0);
            }
        }

        if (this.trackHard) {
            this.applyX = this.x;
            this.applyY = this.y;
            this.trackHard = false;
        } else {
            this.applyX = MathHelper.lerp(this.applyX, this.x, 0.1);
            this.applyY = MathHelper.lerp(this.applyY, this.y, 0.1);
        }
    }
};