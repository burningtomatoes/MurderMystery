var Canvas = {
    $canvas: null,
    canvas: null,
    context: null,

    lastRenderTime: null,
    fps: 0,

    /**
     * Binds to the canvas element on the page, configures it and begins the update/render loop.
     * NB: This function should normally only be called once (when the game is starting).
     */
    initialize: function() {
        console.info('[Canvas] Game is starting, starting loop.');

        // Find the Canvas element we will be drawing to and retrieve the drawing context
        this.$canvas = $('#game');
        this.canvas = this.$canvas[0];
        this.context = this.canvas.getContext('2d');

        console.info('[Canvas] Canvas render resolution is ' + this.canvas.width + 'x' + this.canvas.height + '.');

        // Try to disable the "smooth" (stretched becomes blurry) scaling on the Canvas element
        // Instead, we want a "pixelated" effect (nearest neighbor scaling)
        this.canvas.mozImageSmoothingEnabled = false;
        this.canvas.webkitImageSmoothingEnabled = false;
        this.canvas.msImageSmoothingEnabled = false;
        this.canvas.imageSmoothingEnabled = false;

        // Begin the loop
        var loop = function() {
            window.requestAnimationFrame(loop);

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            Game.draw(this.context);
            Game.update();

            if (Settings.countFps) {
                if (this.lastRenderTime == null) {
                    this.lastRenderTime = Date.now();
                    this.fps = 0;
                    return;
                }

                var delta = (new Date().getTime() - this.lastRenderTime) / 1000;
                this.lastRenderTime = Date.now();
                this.fps = 1 / delta;
            }
        }.bind(this);

        if (Settings.countFps) {
            window.setInterval(function() {
                $('#fps').show().text('FPS: ' + this.fps.toFixed(0));
            }.bind(this), 1000);
        }

        loop();
    }
};