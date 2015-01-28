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

        this.wasTalkedTo = false;
    },

    Texts: {
        DoneTalking: [
            "I'm done talking to you.",
            "Please leave me alone. I've told you everything.",
            "Can I just go home, please? I'm done talking.",
            "Go away. Go bother someone else. I've said what I need to say.",
            "No, we're not doing this again. You and me, we're done talking.",
            "I am so sick and tired of repeating myself over and over again.",
            "Are you back again, Detective? I've told you all I know.",
            "I'm sorry, but that's all I remember! I can't tell you more than that."
        ],
        Intro: [
            "Oh, great, another copper. Listen, I already told your colleagues everything.",
            "Who are you, Sherlock bloody Holmes? You look like an idiot. What do you want?",
            "Can I please just go home? Do I really need to keep repeating this?",
            "I'm innocent! Why won't any of you believe me!?",
            "I'm telling you, I didn't do it. I wasn't even there when it happened.",
            "Ask anyone in this room. It wasn't me. I didn't do it. I wouldn't hurt a fly.",
            "I'll tell you anything you need to know, as long as I can get out of here soon.",
            "Thank God you're here Detective. Please catch the killer, I'm terrified. I can't believe one of these people would do such a thing."
        ],
        WhereIWas: [
            "When it all went down, I was in the %room%.",
            "I was in the %room% when it all happened.",
            "Before the cops came rushing in, I was hanging around the %room%.",
            "I heard a scream when it happened. I was in the %room% at the time. It was terrible.",
            "Like I already said, I was in the %room%, just down the hall before you all arrived.",
            "I wasn't there when it happened. Not even close. I was in the %room%.",
            "The cops pulled me out of the %room% when they arrived. That's where I was when the killer did their thing."
        ],
        NooneElse: [
            "I was all alone in there, I didn't see anyone else.",
            "I was only in there for a moment, though. I don't think I saw anyone else in there.",
            "That room was empty, though. I didn't see anyone, at least.",
            "Pretty sure that room was completely empty, other than me."
        ],
        SawSomeone: [
            "I saw another person in there, %name%.",
            "Oh! There was someone else in there with me, it was %name%.",
            "You can ask %name% if you don't believe me, he was in there with me.",
            "I saw %name% in that same room. Go talk to him, he'll back me up.",
            "But %name% already told you that, I suppose. He was in there with me.",
            "If you ask %name%, he'll verify that I was there.",
            "I saw %name% in there. I don't think they did it, I don't see how they would have the time.",
            "At least I can safely say that %name% didn't do it. They were in there with me.",
            "I saw someone else in there, but I honestly don't remember who it was."
        ]
    },

    busyTalking: false,

    getRandomText: function (arr) {
        var idx = chance.integer({
            min: 0,
            max: (arr.length - 1)
        });

        return arr[idx];
    },

    wasTalkedTo: false,

    interact: function (player) {
        var onComplete = function () {
            this.busyTalking = false;
        }.bind(this);

        this.busyTalking = true;
        this.stopWalking();
        this.lookAt(player);

        if (!Story.visitedScene) {
            var sgt = this.map.script.introCop;

            sgt.doBasicDialogue(player, [
                { text: 'Hey, Detective, don\'t you think you should check out the murder scene before you go bothering our friends here?', name: sgt.getDisplayName() }
            ], onComplete);

            return;
        }

        if (this.wasTalkedTo) {
            this.doBasicDialogue(player, [
                { text: this.getRandomText(this.Texts.DoneTalking), name: this.getDisplayName() }
            ], onComplete);

            return;
        }

        Story.interrogatedFolks = true;
        this.wasTalkedTo = true;

        var lying = this.isWitness || this.isMurderer;
        var allegedRoom = this.room;

        if (lying) {
            while (allegedRoom == null || allegedRoom == Story.murderRoom) {
                allegedRoom = Rooms.selectRandomRoom();
            }
        }

        var personPage = null;

        if (lying || allegedRoom.occupants.length == 1) {
            personPage = this.getRandomText(this.Texts.NooneElse);
        } else {
            var randomPerson = null;

            // Select a random person that isn't us
            do {
                randomPerson = this.room.occupants[chance.integer({
                    min: 0,
                    max: this.room.occupants.length - 1
                })];
            }
            while (randomPerson == this);

            personPage = this.getRandomText(this.Texts.SawSomeone).replace('%name%', randomPerson.getDisplayName());
        }

        this.doBasicDialogue(player, [
            { text: this.getRandomText(this.Texts.Intro), name: this.getDisplayName() },
            { text: this.getRandomText(this.Texts.WhereIWas).replace('%room%', allegedRoom.name) },
            { text: personPage }
        ], onComplete);
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
        if (this.busyTalking) {
            return;
        }

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