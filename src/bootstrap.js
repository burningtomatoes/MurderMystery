$(document).ready(function() {
    // This is a badass ASCII banner. It looks better in your console. :-)
    console.log(' __  __               _           __  __           _');
    console.log('|  \\/  |             | |         |  \\/  |         | |');
    console.log('| \\  / |_   _ _ __ __| | ___ _ __| \\  / |_   _ ___| |_ ___ _ __ _   _');
    console.log('| |\\/| | | | | \'__/ _` |/ _ \\ \'__| |\\/| | | | / __| __/ _ \\ \'__| | | |');
    console.log('| |  | | |_| | | | (_| |  __/ |  | |  | | |_| \\__ \\ ||  __/ |  | |_| |');
    console.log('|_|  |_|\\__,_|_|  \\__,_|\\___|_|  |_|  |_|\\__, |___/\\__\\___|_|   \\__, |');
    console.log('                                          __/ |                  __/ |');
    console.log('                                         |___/                  |___/ ');
    console.log('   "Wow. Much murder. Very mystery."');
    console.log('');

    // Initialize canvas rendering
    Game.initialize();

    // Begin preloading audio and textures
    Sfx.preload();
    Gfx.preload();

    // Show boot logo (a burning tomato) if it is enabled, then start the game
    var startGame = function () {
        Game.start();
    };

    if (!Settings.skipBootLogo) {
        BootLogo.show(startGame);
    } else {
        startGame();
    }
});