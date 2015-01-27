var Outfitter = {
    Heads: {
        Male: 4,
        Female: 4
    },

    // I am so sorry if my terrible design skills offend anyone. Haha, no, but really, I'm pretty shit at this.
    Bodies: {
        Male: ['suit_white', 'suit_black', 'lumber_shirt', 'stupid_blue_shirt', 'wave_shirt'],
        Female: ['f_blue_top', 'f_pink_dress', 'f_red_dress']
    },

    exactOutfits: [],

    reset: function () {
        this.exactOutfits = [];
    },

    generateOutfit: function (gender) {
        var headId = chance.integer({
            min: 1,
            max: this.Heads.Male
        });

        var headString = (gender == Gender.MALE ? 'male' : 'female') + "_" + headId;

        var bodyIdx = chance.integer({
            min: 0,
            max: (gender == Gender.MALE ? this.Bodies.Male.length : this.Bodies.Female.length) - 1
        });

        var bodyString = (gender == Gender.MALE ? this.Bodies.Male : this.Bodies.Female)[bodyIdx];

        return {
            body: bodyString,
            head: headString
        };
    },

    generateUniqueOutfit: function (gender) {
        var outfit = null;
        var outfitString = 'bla';

        do {
            outfit = this.generateOutfit(gender);
            outfitString = gender + ';' + outfit.head + ';' + outfit.body;
        }
        while (this.exactOutfits.indexOf(outfitString) >= 0);

        this.exactOutfits.push(outfitString);

        return outfit;
    }
};