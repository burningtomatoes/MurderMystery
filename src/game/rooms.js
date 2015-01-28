var Rooms = {
    data: [],

    push: function (room) {
        this.data.push(room);
    },

    get: function (idx) {
        return this.data[idx];
    },

    cleanUp: function () {
        for (var i = 0; i < this.data.length; i++) {
            var room = this.data[i];
            room.occupants = [];
        }
    },

    selectMurderRoom: function () {
        var room = null;

        do
        {
            var idx = chance.integer({
                min: 0,
                max: this.data.length - 1
            });

            room = this.data[idx];
        }
        while (!room.canMurder || room.occupants.length == 0);

        return room;
    },

    selectRandomRoom: function () {
        var room = null;

        var idx = chance.integer({
            min: 0,
            max: this.data.length - 1
        });

        return this.data[idx];
    }
};

var Room = Class.extend({
    /**
     * The display name of this room, used in the UI and dialogue to reference it.
     */
    name: 'A Room',
    /**
     * Indicates whether a murder can happen in this room or not.
     * This is almost always TRUE.
     */
    canMurder: true,
    /**
     * Indicates how many people can be in this room at the time of the murder.
     * This is almost always 2, sometimes 1. Anything else would make the story weird.
     */
    maxOccupants: 2,
    /**
     * The name (ID) of the map file associated with this room.
     */
    mapId: null,
    /**
     * Occupants of this room at the time of the murder.
     */
    occupants: [],

    init: function (data) {
        for (var property in data) {
            var value = data[property];
            this[property] = value;
        }

        this.occupants = [];
    },

    anyRoomLeft: function () {
        return this.occupants.length < this.maxOccupants;
    }
});

Rooms.push(new Room({
    name: 'Front Room',
    canMurder: false,
    maxOccupants: 1,
    mapId: 'main_room',
    hallwaySide: 'top',
    hallwayPosY: 0
}));

Rooms.push(new Room({
    name: 'Bathroom',
    canMurder: true,
    maxOccupants: 2,
    mapId: 'bath_room',
    hallwaySide: 'left',
    hallwayPosY: 528
}));

Rooms.push(new Room({
    name: 'Dining Room',
    canMurder: true,
    maxOccupants: 2,
    mapId: 'dining_room',
    hallwaySide: 'right',
    hallwayPosY: 528
}));

Rooms.push(new Room({
    name: 'Master Bedroom',
    canMurder: true,
    maxOccupants: 2,
    mapId: 'bed_room_1',
    hallwaySide: 'left',
    hallwayPosY: 752
}));

Rooms.push(new Room({
    name: 'Guest Bedroom',
    canMurder: true,
    maxOccupants: 2,
    mapId: 'bed_room_2',
    hallwaySide: 'right',
    hallwayPosY: 752
}));