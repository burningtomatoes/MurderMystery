var Guest = Entity.extend({
    isNpc: true,
    isGuest: true,

    restlessTimer: 0,

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

        this.spriteHead = Gfx.load('head_' + head);
        this.spriteBody = Gfx.load('body_' + body);
        this.spriteShadow = Gfx.load('shadow_body_generic');
    },

    findFreePosition: function () {
        do {
            this.posX = chance.integer({
                min: Settings.tileSize,
                max: this.map.widthPx - Settings.tileSize
            });

            this.posY = chance.integer({
                min: Settings.tileSize,
                max: this.map.heightPx - Settings.tileSize
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

    update: function () {
        this._super();
    }
});