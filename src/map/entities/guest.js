var Guest = Entity.extend({
    isNpc: true,
    isGuest: true,

    firstName: 'John',
    lastName: 'Doe',
    gender: Gender.MALE,
    martialStatus: MaritalStatus.UNDISCLOSED,

    /**
     * The room we were in at the time of the murder.
     */
    room: null,

    isMurderer: false,
    isVictim: false,
    isWitness: false,

    init: function (firstName, lastName, gender, maritalStatus, head, body) {
        this._super();

        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.martialStatus = maritalStatus;

        this.width = 40;
        this.height = 26;

        this.movementSpeed = 1;

        this.spriteHead = Gfx.load('head_' + head);
        this.spriteBody = Gfx.load('body_' + body);
        this.spriteShadow = Gfx.load('shadow_body_generic');
    },

    interact: function (player) {
        if (!this.visitedScene) {
            var sgt = this.map.script.introCop;

            sgt.doBasicDialogue(player, [
                { text: 'Hey, Detective, don\'t you think you should check out the murder scene before you go bothering our friends here?', name: sgt.getDisplayName() }
            ]);

            return;
        }
    },

    findFreePosition: function () {
        do {
            this.posX = chance.integer({
                min: 30,
                max: 955
            });

            this.posY = chance.integer({
                min: 190,
                max: 330
            });

            this.direction = chance.integer({
                min: Direction.UP,
                max: Direction.LEFT
            })
        }
        while (!this.canMoveAnywhere());
    },

    getNamePrefix: function () {
        if (this.gender == Gender.MALE) {
            return 'Mr';
        }

        // Wow, okay, so there is a lot of discussions on these prefixes on the internet. Hope I used this right.
        switch (this.martialStatus) {
            case MaritalStatus.UNDISCLOSED:
                return 'Ms';
            case MaritalStatus.MARRIED:
                return 'Mrs';
            case MaritalStatus.UNMARRIED:
                return 'Miss';
        }
    },

    getDisplayName: function () {
        return this.getNamePrefix() + ' ' + this.firstName + ' ' + this.lastName;
    },

    restlessTimer: 0,
    tiredTimer: 0,
    currentAction: null,

    doSomething: function () {
        this.restlessTimer = chance.integer({
            min: 60,
            max: 600
        });

        this.tiredTimer = -chance.integer({
            min: 60,
            max: 600
        });

        var direction = chance.integer({
            min: 0,
            max: 4
        });

        switch (direction) {
            case Direction.UP:
                this.direction = Direction.UP;
                this.velocityX = 0;
                this.velocityY = -this.movementSpeed;
                break;

            case Direction.LEFT:
                this.direction = Direction.LEFT;
                this.velocityX = -this.movementSpeed;
                this.velocityY = 0;
                break;

            case Direction.RIGHT:
                this.direction = Direction.RIGHT;
                this.velocityX = +this.movementSpeed;
                this.velocityY = 0;
                break;

            case Direction.DOWN:
                this.direction = Direction.DOWN;
                this.velocityX = 0;
                this.velocityY = +this.movementSpeed;
                break;
        }
    },

    isWalking: function () {
        return this.velocityX != 0 || this.velocityY != 0;
    },

    isBored: function () {
        if (this.restlessTimer > 0) {
            this.restlessTimer--;
        }

        return this.restlessTimer == 0;
    },

    isTired: function () {
        if (this.tiredTimer < 0) {
            this.tiredTimer++;
        }

        return this.tiredTimer >= 0;
    },

    stopWalking: function () {
        this.velocityX = 0;
        this.velocityY = 0;
    },

    update: function () {
        this._super();

        if (this.isBored()) {
            this.doSomething();
        }

        if (this.isWalking()) {
            if (this.isTired()) {
                this.stopWalking();
            }
        }
    }
});