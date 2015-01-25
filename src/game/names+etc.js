var Names = {
    FirstNames: {
        Male: ['Albert', 'Alexander', 'Bertram', 'Roderick', 'Elijah', 'Maurice', 'Edwin', 'Horatio', 'Harold', 'Matthew', 'Sam Houston', 'Patrick Henry', 'Noah'],
        Female: ['Abigale', 'Constance', 'Mildred', 'Lydia', 'Henrietta', 'Mercy', 'Maude', 'Josephine', 'Minerva', 'Hortence', 'Lorraine', 'Stella', 'Edith']
    },

    LastNames: ['Barber', 'Alcock', 'Abraham', 'Angus', 'Clarke', 'Cunningham', 'Foster', 'Gallagher', "O'Keefe", 'Kneebone', 'Murphy', 'Palmer', 'Patterson', 'Phillips',
        'Porter', 'Riddington', 'Roberts', 'Shelton', 'Smith', 'Stewart', 'Taylor', 'Thomas', 'Trimble', 'Wakenshaw', 'Walton', 'Warner', 'Webber', 'Young'],

    getRandomMaleName: function () {
        var idx = chance.integer({
            min: 0,
            max: this.FirstNames.Male.length - 1
        });

        return this.FirstNames.Male[idx];
    },

    getRandomFemaleName: function () {
        var idx = chance.integer({
            min: 0,
            max: this.FirstNames.Female.length - 1
        });

        return this.FirstNames.Female[idx];
    },

    getRandomLastName: function () {
        var idx = chance.integer({
            min: 0,
            max: this.LastNames.length - 1
        });

        return this.LastNames[idx];
    }
};

var Gender = {
    MALE: 'm',
    FEMALE: 'f',

    generateRandom: function () {
        return chance.bool() ? Gender.MALE : Gender.FEMALE;
    }
};

var MaritalStatus = {
    UNDISCLOSED: 1,
    MARRIED: 2,
    UNMARRIED: 3,

    generateRandom: function () {
        return chance.integer({
            min: 1,
            max: 3
        });
    }
};