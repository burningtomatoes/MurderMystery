var scrWalkIn = Script.extend({
    walkingIn: true,
    copWalking: false,
    copWalkingTwo: false,

    introCop: null,

    run: function () {
        this.walkingIn = true;

        this.introCop = new Officer();
        this.introCop.posX = 492;
        this.introCop.posY = 850;
        this.map.add(this.introCop);

        this.map.player.posX = 492;
        this.map.player.posY = 965;
        this.map.player.canControl = false;

        this.map.player.velocityY = -1;

        Sfx.play('door_closing.wav');
    },

    update: function () {
        // Part one: Detective walks in to the room
        if (this.walkingIn && this.map.player.posY <= 890) {
            this.walkingIn = false;
            this.map.player.velocityY = 0;

            Camera.followEntity(this.introCop);

            var onDialogueComplete = function () {
                this.introCop.direction = Direction.UP;
                this.introCop.velocityY = -1;

                Camera.followEntity(this.map.player);
                this.map.player.canControl = true;

                this.copWalking = true;
            }.bind(this);

            Dialogue.prepare([
                { text: 'Thank you for showing up on this ungodly hour of the night, detective.' },
                { text: 'One of the fany-pants guests attending this dinner party turned up dead.' },
                { text: '...which is why we\'re stuck here at late o\'clock on a rainy ass day.' },
                { text: 'Anyway. Let me show you, sir. Follow me.' }
            ], onDialogueComplete);

            Dialogue.show();
        }

        // Part two: Copper walks through the hallway, informing us of the room it all went down it.
        if (this.copWalking && this.introCop.posY <= 528) {
            var onDialogueComplete = function () {
                Camera.followEntity(this.map.player);
                this.map.player.canControl = true;
            }.bind(this);

            Camera.followEntity(this.introCop);

            Dialogue.prepare([
                { text: 'The door on your right is where the shit hit the fan. It\'s the ' + Story.murderRoom.name + '.' },
                { text: 'You\'ll want to talk to that old fart in there, the medical examiner.' }
            ], onDialogueComplete);

            Dialogue.show();

            this.copWalking = false;
            this.copWalkingTwo = true;
        }

        if (this.copWalkingTwo && this.introCop.posY <= 348) {
            this.introCop.velocityY = 0;

            var onDialogueComplete = function () {
                Camera.followEntity(this.map.player);
                this.map.player.canControl = true;
            }.bind(this);

            Camera.followEntity(this.introCop);

            Dialogue.prepare([
                { text: 'And this is where we\'ve rounded up the guests for now. Each and every one of them is a suspect.' },
                { text: 'The cameras confirm it: no-one else in or out all day. That leaves us with one of these idiots as our killer.'},
                { text: 'Go and do whatever it is you do, detective. We\'ll make sure our friends here don\'t go anywhere.' }
            ], onDialogueComplete);

            Dialogue.show();

            this.copWalkingTwo = false;
        }
    }
});