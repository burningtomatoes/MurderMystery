var Goblin = Entity.extend({
    isNpc: true,
    causesDamage: true,

    init: function() {
        this._super();

        this.width = 28;
        this.height = 18;

        this.sprite = Gfx.load('goblin');
        this.spriteShadow = Gfx.load('goblin_shadow');

        this.setCoord(9, 9);

        this.weapon = new SwordTroll();

        this.movementSpeed = 1.5;

        this.generateHurtSprite();
    },

    deathDelayer: 0,

    moveDirection: 0,
    canContinue: true,
    attentionSpan: 0,
    restTimer: 0,

    killMode: false,

    damage: function (val) {
        this.killMode = true;
        this._super(val);
    },

    update: function () {
        this._super();

        if (!this.dead) {
            if (!this.canContinue) {
                this.moveDirection = Math.round(Math.random() * 3) + 1;
                this.attentionSpan = Math.round(Math.random() * 300);
                this.canContinue = true;
            }

            if (this.attentionSpan > 0) {
                this.attentionSpan--;
            }
            if (this.attentionSpan <= 0) {
                this.canContinue = false;
            }

            if (this.restTimer > 0) {
                this.restTimer--;
            }

            this.velocityX = 0;
            this.velocityY = 0;

            var player = Game.map.player;

            if (this.killMode)
            {
                // Want to kill the player
                var diffX = Math.abs(this.posX - player.posX);
                var diffY = Math.abs(this.posY - player.posY);

                if (diffX + diffY <= 32 && this.restTimer <= 0 && !this.isAttacking) {
                    this.attack();
                    this.restTimer = 30;
                }

                if (this.restTimer == 0) {
                    if (player.posY < this.posY && diffY > 16) {
                        this.direction = Direction.UP;
                        this.velocityY = -this.movementSpeed;
                    }
                    else if (player.posY > this.posY && diffY > 16) {
                        this.direction = Direction.DOWN;
                        this.velocityY = +this.movementSpeed;
                    }

                    if (player.posX < this.posX && diffX > 16) {
                        this.direction = Direction.LEFT;
                        this.velocityX = -this.movementSpeed;
                    }
                    else if (player.posX > this.posX && diffX > 16) {
                        this.direction = Direction.RIGHT;
                        this.velocityX = +this.movementSpeed;
                    }
                }
            }
            else
            {
                // Feeling bloodlust yet?
                var diffX = Math.abs(this.posX - player.posX);
                var diffY = Math.abs(this.posY - player.posY);

                if (diffX + diffY <= 255) {
                    this.killMode = true;
                }

                // Wander mode
                if (this.canContinue && this.attentionSpan > 0 && this.restTimer <= 0) {
                    switch (this.moveDirection) {
                        default:
                        case Direction.UP:
                            this.velocityY = -this.movementSpeed;
                            this.direction = Direction.UP;
                            if (!this.canMoveUp()) {
                                this.canContinue = false;
                            }
                            break;
                        case Direction.DOWN:
                            this.velocityY = +this.movementSpeed;
                            this.direction = Direction.DOWN;
                            if (!this.canMoveDown()) {
                                this.canContinue = false;
                            }
                            break;
                        case Direction.LEFT:
                            this.velocityX = -this.movementSpeed;
                            this.direction = Direction.LEFT;
                            if (!this.canMoveLeft()) {
                                this.canContinue = false;
                            }
                            break;
                        case Direction.RIGHT:
                            this.velocityX = +this.movementSpeed;
                            this.direction = Direction.RIGHT;
                            if (!this.canMoveRight()) {
                                this.canContinue = false;
                            }
                            break;
                    }
                }
            }

            if (!this.canContinue) {
                this.restTimer = Math.round(Math.random() * 100);
            }
        }

        if (this.dead) {
            this.hurtTimer = Infinity;

            if (this.deathDelayer > 0) {
                this.deathDelayer--;

                if (this.deathDelayer == 0) {
                    Game.map.remove(this);
                }
            }
            else if (this.drewHurtFrame) {
                this.deathDelayer = 3;
            }
        }
    }
});