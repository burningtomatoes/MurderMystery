var BootLogo = {
    show: function(cb) {
        Sfx.play('burningtomato.wav');

        $('#burningtomato').delay(500).fadeIn(500, function() {
            window.setTimeout(function() {
                $('#burningtomato').fadeOut(500, cb);
            }, 1500)
        });
    }
};