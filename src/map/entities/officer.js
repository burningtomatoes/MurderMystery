var Officer = Entity.extend({
    isNpc: true,

    slightlyMoveTimer: 0,
    slightlyMoveOverride: 0,

    name: null,
    title: null,

    randomChatter: [
        "Ugh, I can't believe I'm stuck here on my one free night...",
        "At least I'm dry inside, I guess.",
        "My legs are cramping up. I hate just standing around for no good reason.",
        "Do you really need me, Detective? I feel like I'm just part of the furniture.",
        "Come on, these folks aren't going anywhere. Can I go home yet?",
        "Why are you talking to me, Detective? Don't you have a murder to solve?",
        "Why are you looking at me like that? I'm not a piece of evidence, you know.",
        "...",
        "This house is weird. Looks more like crappy bungalow than a fancy manor house to me.",
        "What's with all these weird hair styles anyway? I don't think I get fashion.",
        "These people should fire their interior decorators.",
        "This rain looks weird.",
        "I bet it's a crime of passion.",
        "I bet it's something to with an inheritance.",
        "I bet the murderer just got bored. Can't blame them either, really.",
        "I'd be a lot warmer and a lot happier with a belly full of mead.",
        "I used to be a detective like you, but then I took an arrow to the knee.",
        "No lollygagging'.",
    ],

    init: function () {
        this._super();

        this.width = 40;
        this.height = 26;

        this.spriteHead = Gfx.load('head_officer');
        this.spriteBody = Gfx.load('body_officer');
        this.spriteShadow = Gfx.load('shadow_body_generic');

        this.slightlyMoveTimer = 30;

        this.title = 'Officer';

        this.name = Names.getRandomOfficerName();
    },

    getRandomChatter: function () {
        return this.randomChatter[chance.integer({
            min: 0,
            max: this.randomChatter.length - 1
        })];
    },

    interact: function (player) {
        this.doBasicDialogue(player, [{ name: this.getDisplayName(), text: this.getRandomChatter() }]);
    },

    getNamePrefix: function () {
        return this.title;
    },

    getDisplayName: function () {
        return this.getNamePrefix() + ' ' + this.name;
    },

    update: function () {
        this._super();

        if (this.velocityX == 0 && this.velocityY == 0) {
            if (this.slightlyMoveTimer > 0) {
                this.slightlyMoveTimer--;

                if (this.slightlyMoveTimer == 0) {
                    this.slightlyMoveOverride = Math.round(Math.random() * 4 - 2);
                    this.slightlyMoveTimer = Math.round(Math.random() * 60) + 60;
                }
            }

            this.headBob = this.slightlyMoveOverride;
        }
    }
});