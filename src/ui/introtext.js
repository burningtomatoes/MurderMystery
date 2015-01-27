var IntroText = {
    run: function (cb) {
        // Fade in the intro text on top of the game and everything else.
        // When our text is visible, call the callback (`cb`). This will trigger the main map to load.
        // We then pass our callbackEventObject along. The map calls the done() function on the callback when it is loaded.
        // We then fade our text out again a little later.
        this.randomizeText();

        var callbackEventObject = {
            done: function () {
                $('#text').delay(2000).fadeOut('slow');
            }
        };

        $('#text').fadeIn('slow', function () {
            cb(callbackEventObject);
        });
    },

    randomizeText: function () {
        var cirty = chance.city();
        var country = chance.country({full:true});

        var year = chance.year({
            min: 1990,
            max: 2014
        });
        var date = chance.date({
            year: year
        });

        var monthName = '';

        switch (date.getMonth()) {
            case 0:  monthName  = 'January';   break;
            case 1:  monthName  = 'February';  break;
            case 2:  monthName  = 'March';     break;
            case 3:  monthName  = 'April';     break;
            case 4:  monthName  = 'May';       break;
            case 5:  monthName  = 'June';      break;
            case 6:  monthName  = 'July';      break;
            case 7:  monthName  = 'August';    break;
            case 8:  monthName  = 'September'; break;
            case 9:  monthName  = 'October';   break;
            case 10: monthName  = 'November'; break;
            case 11: monthName  = 'December'; break;
        }

        $('#text')
            .html('')
            .append(cirty + ', ' + country)
            .append('<br />')
            .append('The evening of ' + date.getDate() + ' ' +  monthName + ' ' + year);
    }
};