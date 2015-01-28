/**
 * Compile-time client configuration data.
 *
 * RENDERING
 * tileSize         int         This affects how maps are interpreted and rendered. Must match the tileset, etc.
 *
 * DEVELOPMENT
 * skipBootLogo     bool        Skips the "BurningTomato.com" boot logo.
 * countFps         bool        Shows the frames-per-second counter.
 * showStoryTool    bool        Shows the tool that reveals the game story.
 */
var Settings = {
    tileSize: 32,

    skipBootLogo: false,
    countFps: false,
    showStoryTool: false,
    skipIntroScript: false
};