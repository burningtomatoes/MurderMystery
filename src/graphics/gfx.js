var Gfx = {
    data: {},

    clear: function () {
        this.data = {};
    },

    load: function (fileName) {
        fileName = 'assets/images/' + fileName + '.png';

        if (typeof this.data[fileName] === 'undefined') {
            this.data[fileName] = new Image();
            this.data[fileName].src = fileName;
        }

        return this.data[fileName];
    },

    makeHurtSprite: function (image) {
        // Generate a "white" version of the given sprite to act as a "hurt sprite".
        // This alternative sprite is used to flash white when an entity is hurt.
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0, image.width, image.height);

        var spriteData = ctx.getImageData(0, 0, image.width, image.height);
        var pixelData = spriteData.data;

        var hurtColor = [255, 255, 255]; // RGB format

        // Iterate the pixels in the first frame of the sprite we just loaded.
        // Each pixel has 4 bytes of information: Red, Green, Blue and Alpha.
        for (var i = 0; i < pixelData.length; i += 4) {
            pixelData[i] = hurtColor[0];
            pixelData[i + 1] = hurtColor[1];
            pixelData[i + 2] = hurtColor[2];
            // Pixels that were not previously set should still have a zero alpha (invisible).
            // We don't change alpha (the 4th value) but leave it as is.
            // End result: the sprite, where pixels were already visible, will have our color.
        }

        spriteData.data = pixelData;
        ctx.putImageData(spriteData, 0, 0);

        return canvas;
    },

    preload: function () {

    }
};