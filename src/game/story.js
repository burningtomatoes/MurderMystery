var Story = {
    GUEST_COUNT: 6,

    guests: [],

    generateStory: function () {
        // Step zero: Mop up the corpses and stuff from any previous games.
        Rooms.cleanUp();

        // Step one: generate a random selection of guests.
        this.generateGuests();

        // Step two: assign the guests to random rooms to be in at the time of the murder.
        for (var i = 0; i < this.guests.length; i++) {
            var guest = this.guests[i];
            var room = null;

            // Find a room with...room for us.
            do
            {
                room = Rooms.selectRandomRoom();
            }
            while (!room.anyRoomLeft());

            room.occupants.push(guest);
            guest.room = room;
        }


        if (Settings.showStoryTool) {
            this.fillStoryDebug();
        }
    },

    generateGuests: function () {
        this.guests = [];

        var guestsToSpawn = this.GUEST_COUNT;

        var namesUsed = [];

        for (var i = 0; i < guestsToSpawn; i++) {
            // Generate our basic profile. Gender, marriage (prefix - eg Ms. or Mrs.), name, creepy profession, etc.
            var gender = Gender.generateRandom();
            var maritalStatus = MaritalStatus.generateRandom();

            var firstName = '';
            var lastName = '';
            var completeName = '';

            // Generate a random name based on our gender, but make sure the EXACT name is not used by another guest.
            do
            {
                firstName = gender == Gender.MALE ? Names.getRandomMaleName() : Names.getRandomFemaleName();
                lastName = Names.getRandomLastName();
                completeName = firstName + ' ' + lastName;
            }
            while (namesUsed.indexOf(completeName) >= 0);

            namesUsed.push(completeName);

            // Create an actual guest entity. This entity combines guest logic with an actual NPC on the map.
            var guest = new Guest(firstName, lastName, gender, maritalStatus, 'officer', 'officer');
            // TODO Random bodies & heads instead of officer...
            this.guests.push(guest);
        }
    },

    spawnGuests: function (map) {
        var guestsLength = this.guests.length;

        for (var i = 0; i < guestsLength; i++) {
            var guest = this.guests[i];
            map.add(guest);
            guest.findFreePosition();
        }
    },

    fillStoryDebug: function () {
        var $ds = $('#dev-story');
        $ds.html('');

        for (var i = 0; i < this.guests.length; i++) {
            var guest = this.guests[i];

            $ds.append(guest.getDisplayName());
            $ds.append("<br />");
            $ds.append(guest.room.name);
            $ds.append("<br />");
            $ds.append("<br />");
        }

        $ds.show();
    }
};