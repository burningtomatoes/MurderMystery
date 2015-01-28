var Map = Class.extend({
    entities: [],
    paused: false,
    id: null,
    loading: false,
    loaded: false,
    data: null,

    init: function () {
        this.clear();

        this.loading = false;
        this.loaded = false;
    },

    load: function (id, callback) {
        if (this.loading) {
            return;
        }

        if (callback == null) {
            callback = function () {
            };
        }

        this.id = id;
        this.loading = true;

        console.info('[Map] Loading map', id);

        $.get('assets/maps/' + id + '.json')

            .success(function (data) {
                this.data = data;
                this.processData();

                this.loading = false;
                this.loaded = true;

                callback(true);
            }.bind(this))

            .error(function (obj, msg, e) {
                console.error('[Map] A network error occurred while loading the map data.', msg, e);

                this.loading = false;
                this.loaded = false;

                callback(false);
            }.bind(this));
    },

    layers: null,
    tileset: null,

    height: 0,
    width: 0,
    heightPx: 0,
    widthPx: 0,
    tilesPerRow: 0,

    tidTranslations: [],
    tidAnimations: [],

    processData: function () {
        // Load & prepare the tileset for rendering
        var tilesetSrc = this.data.tilesets[0].image;
        tilesetSrc = tilesetSrc.replace('../images/', '');
        tilesetSrc = tilesetSrc.replace('.png', '');

        // Configure map dimensions & data
        this.height = this.data.height;
        this.width = this.data.width;
        this.heightPx = this.height * Settings.tileSize;
        this.widthPx = this.width * Settings.tileSize;
        this.tileset = Gfx.load(tilesetSrc);
        this.layers = this.data.layers;
        this.tilesPerRow = this.data.tilesets[0].imagewidth / Settings.tileSize;

        // Avoid "undefined" errors and a boat load of checks by creating boilerplate dummy objects where needed
        if (typeof(this.data.properties) == 'undefined') {
            this.data.properties = {};
        }

        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];

            if (typeof(layer.properties) == 'undefined') {
                layer.properties = {};
            }

            if (layer.properties.death == '1' && !this.isMurderRoom()) {
                layer.visible = false;
            }
        }

        // Calculate blocking tiles, teleports, etc
        this.prepareBlockMap();

        // Center the camera on the middle of the map to start out
        Camera.centerToMap();

        // Add the player, and spawn them in the correct position
        var player = new Player();
        this.configurePlayerSpawn(player);
        this.addPlayer(player);

        // Run ambient soundscapes
        Music.stopAll();

        var props = this.data.properties;
        if (props.ambience && !Settings.shutUpSoundscapes) {
            Music.loopSound(this.data.properties.ambience);
        }

        // Spawns (NPCs) as defined in the map data
        this.prepareMapSpawns();

        // Prepare tile animations
        this.prepareTidAnimations();

        // Update HUD
        $('#location').text(this.data.properties.name);
    },

    isMurderRoom: function () {
        return Story.murderRoom.mapId == this.id;
    },

    configurePlayerSpawn: function (playerEntity) {
        var spawnSource = 'initial';
        if (Game.lastMapId != null) {
            spawnSource = Game.lastMapId;
        }

        var spawnData = null;
        var spawnKey = 'spawn_' + spawnSource;

        if (typeof(this.data.properties['spawn_' + spawnSource]) != 'undefined') {
            spawnData = this.data.properties['spawn_' + spawnSource];
        } else if (typeof(this.data.properties['spawn_initial']) != 'undefined') {
            spawnData = this.data.properties['spawn_initial'];
        } else {
            spawnData = '5, 5'; // out of options here...
        }

        var dataBits = spawnData.split(',');

        var coordX = parseInt(dataBits[0]);
        var coordY = parseInt(dataBits[1]);
        var orientation = Direction.DOWN;

        if (dataBits.length >= 3) {
            orientation = parseInt(dataBits[2]);
        }

        playerEntity.setCoord(coordX, coordY);
        playerEntity.direction = orientation;
    },

    redeploy: function () {
        Camera.followEntity(this.player, true);

        this.player.isTeleporting = false;
        this.player.canControl = true;
    },

    blockedRects: [],
    teleRects: [],
    npcBlockedRects: [],

    prepareMapSpawns: function () {
        var layerCount = this.layers.length;

        for (var i = 0; i < layerCount; i++) {
            var layer = this.layers[i];
            var isDeathLayer = this.isMurderRoom() && layer.properties.death == '1';

            var spawnId = layer.properties.spawn;

            if (isDeathLayer) {
                spawnId = 'officer';
            }

            if (spawnId == null) {
                continue;
            }

            var layerDataLength = layer.data.length;

            var x = -1;
            var y = 0;

            for (var tileIdx = 0; tileIdx < layerDataLength; tileIdx++) {
                var tid = layer.data[tileIdx];

                x++;

                if (x >= this.width) {
                    y++;
                    x = 0;
                }

                if (tid === 0) {
                    // Invisible (no tile set for this position)
                    continue;
                }

                if (isDeathLayer) {
                    if (tid == 8) {
                        spawnId = 'medicalExaminer';
                    } else if (tid == 9) {
                        spawnId = 'officer';
                    } else {
                        continue;
                    }
                }

                var entity = null;

                // noinspection FallThroughInSwitchStatementJS
                switch (spawnId) {
                    default:
                        console.warn('[Entity] Unknown spawn type, have an Officer instead:', spawnId);
                    case 'medicalExaminer':
                        entity = new Officer();
                        entity.spriteHead = Gfx.load('head_male_3');
                        entity.getDisplayName = function () {
                            return 'Medical Examiner';
                        };
                        entity.interact = function (player) {
                            entity.lookAt(player);
                            entity.doBasicDialogue(player, [
                                { text: 'Hello, Detective. This is our victim, a ' + Story.victim.getDisplayName() + '.', name: 'Medical Examiner'},
                                { text: 'From what I can tell, they died just an hour ago or so before you arrived.'},
                                { text: 'It looks like the cause of death is a swift blunt blow to the head. No signs of struggle otherwise.' },
                                { text: 'There\'s not a lot to go by here unfortunately. It was a quick death.' },
                                { text: 'I think you should talk to our potential suspects. See if you can poke a hole through their stories.' }
                            ]);
                            Story.visitedScene = true;
                        }.bind(this);
                        break;
                    case 'officer':
                        entity = new Officer();
                        break;
                }

                entity.setCoord(x, y);
                Game.map.add(entity);
            }
        }
    },

    prepareBlockMap: function () {
        this.blockedRects = [];
        this.teleRects = [];
        this.npcBlockedRects = [];
        this.tidTranslations = {};

        var layerCount = this.layers.length;

        for (var i = 0; i < layerCount; i++) {
            var layer = this.layers[i];
            var layerDataLength = layer.data.length;

            var x = -1;
            var y = 0;

            var isBlocking = layer.properties.blocked == '1';
            var isNpcBlocking = layer.properties.npc_block == '1';
            var isTeleportingTo = layer.properties.teleport != null ? layer.properties.teleport : null;

            for (var tileIdx = 0; tileIdx < layerDataLength; tileIdx++) {
                var tid = layer.data[tileIdx];

                x++;

                if (x >= this.width) {
                    y++;
                    x = 0;
                }

                if (typeof this.tidTranslations[tid] == 'undefined') {
                    // Build the tid translations table, we use this for drawing
                    // Tile animations will mutate this table in update() where needed.
                    this.tidTranslations[tid] = tid;
                }

                if (tid === 0) {
                    // Invisible (no tile set for this position)
                    continue;
                }

                var rect = {
                    top: y * Settings.tileSize,
                    left: x * Settings.tileSize,
                    width: Settings.tileSize,
                    height: Settings.tileSize
                };
                rect.bottom = rect.top + rect.height;
                rect.right = rect.left + rect.width;

                if (isBlocking) {
                    this.blockedRects.push(rect);
                }

                if (isNpcBlocking) {
                    this.npcBlockedRects.push(rect);
                }

                if (isTeleportingTo != null) {
                    rect.teleportTo = isTeleportingTo;
                    this.teleRects.push(rect);
                }
            }
        }
    },

    isRectBlocked: function (ourRect, isNpc, ignoreEntity) {
        var blockedRectsLength = this.blockedRects.length;

        for (var i = 0; i < blockedRectsLength; i++) {
            if (Utils.rectIntersects(ourRect, this.blockedRects[i])) {
                return true;
            }
        }

        if (isNpc) {
            var npcBlockedRectsLength = this.npcBlockedRects.length;

            for (var j = 0; j < npcBlockedRectsLength; j++) {
                if (Utils.rectIntersects(ourRect, this.npcBlockedRects[j])) {
                    return true;
                }
            }
        }

        var entitiesLength = this.entities.length;
        for (var k = 0; k < entitiesLength; k++) {
            var entity = this.entities[k];

            if (!entity.causesCollision || entity === ignoreEntity || entity.causesDamage) {
                // If the entity does not collide...
                // or, if the entity is our ignore entity (e.g. the player checking)...
                // or, if the entity causes damage on touch (so not really solid, just causes bounceback)...
                // ...then we do not consider this entity for our collision detection.
                continue;
            }

            var theirRect = entity.getRect();

            if (Utils.rectIntersects(ourRect, theirRect)) {
                return true;
            }
        }

        return false;
    },

    getEntitiesInRect: function (ourRect, ignoreEntity) {
        var entitiesMatched = [];

        var entitiesLength = this.entities.length;
        for (var k = 0; k < entitiesLength; k++) {
            var entity = this.entities[k];

            if (entity === ignoreEntity) {
                continue;
            }

            var theirRect = entity.getRect();

            if (Utils.rectIntersects(ourRect, theirRect)) {
                entitiesMatched.push(entity);
            }
        }

        return entitiesMatched;
    },

    getTeleport: function (rect) {
        var teleportsLength = this.teleRects.length;

        for (var i = 0; i < teleportsLength; i++) {
            if (Utils.rectIntersects(rect, this.teleRects[i])) {
                return this.teleRects[i].teleportTo;
            }
        }

        return null;
    },

    clear: function () {
        this.entities = [];
    },

    pause: function () {
        this.paused = true;
        $('#hud').hide();
    },

    resume: function () {
        this.paused = false;
        $('#hud').show();
    },

    player: null,

    add: function (e) {
        e.map = this;
        this.entities.push(e);
    },

    addPlayer: function (e) {
        this.player = e;
        this.add(e);

        Camera.followEntity(e, true);
    },

    remove: function (e) {
        var idx = this.entities.indexOf(e);

        if (idx > 0) {
            this.entities.splice(idx, 1);
            return true;
        }

        return false;
    },

    draw: function (ctx) {
        if (!this.loaded) {
            return;
        }

        this.drawBackground(ctx);
        this.drawEntities(ctx);
    },

    drawBackground: function (ctx) {
        var layerCount = this.layers.length;

        for (var i = 0; i < layerCount; i++) {
            var layer = this.layers[i];
            var layerDataLength = layer.data.length;

            var x = -1;
            var y = 0;

            var isBlocking = Settings.drawCollisions && typeof(layer.properties) != 'undefined' && layer.properties.blocked == '1';
            var isDeathLayer = this.isMurderRoom() && layer.properties.death == '1';

            if (!Settings.drawCollisions && !layer.visible) {
                continue;
            }

            for (var tileIdx = 0; tileIdx < layerDataLength; tileIdx++) {
                var tidValue = layer.data[tileIdx];
                var tid = this.tidTranslations[tidValue];

                x++;

                if (x >= this.width) {
                    y++;
                    x = 0;
                }

                if (tid === 0) {
                    // Invisible (no tile set for this position)
                    continue;
                }

                if (isDeathLayer && (tid == 8 || tid == 9)) {
                    continue;
                }

                tid--; // tid is offset by one, for calculation purposes we need it to start at zero

                var fullRows = Math.floor(tid / this.tilesPerRow);

                var srcY = fullRows * Settings.tileSize;
                var srcX = (tid * Settings.tileSize) - (fullRows * this.tilesPerRow * Settings.tileSize);

                var destX = Camera.translateX(x * Settings.tileSize);
                var destY = Camera.translateY(y * Settings.tileSize);

                ctx.drawImage(this.tileset, srcX, srcY, Settings.tileSize, Settings.tileSize, destX, destY, Settings.tileSize, Settings.tileSize);

                if (isBlocking) {
                    ctx.beginPath();
                    ctx.rect(destX, destY, Settings.tileSize, Settings.tileSize);
                    ctx.strokeStyle = "#FCEB77";
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    },

    drawEntities: function (ctx) {
        var entityCount = this.entities.length;

        for (var i = 0; i < entityCount; i++) {
            var e = this.entities[i];

            if (e === this.player) {
                continue;
            }

            e.draw(ctx);
        }

        if (this.player != null) {
            this.player.draw(ctx);
        }
    },

    script: null,

    runScript: function (scriptObj) {
        scriptObj = new scriptObj(this);
        scriptObj.run();

        this.script = scriptObj;
    },

    update: function () {
        if (this.paused) {
            return;
        }

        this.updateEntities();
        this.updateTileAnimations();

        if (this.script != null) {
            this.script.update();
        }
    },

    updateEntities: function () {
        var entityCount = this.entities.length;

        for (var i = 0; i < entityCount; i++) {
            this.entities[i].update();
        }
    },

    updateTileAnimations: function () {
        var configuredAnims = this.tidAnimations.length;
        for (var i = 0; i < configuredAnims; i++) {
            var animObj = this.tidAnimations[i];

            if (animObj.delayTimer > 0) {
                animObj.delayTimer--;
            }

            if (animObj.delayTimer == 0 && animObj.animateTimer > 0) {
                animObj.animateTimer--;

                if (animObj.animateTimer == 0) {
                    animObj.index = (animObj.index == 1 ? 0 : 1);
                    animObj.animateTimer = animObj.animSpeed;

                    if (animObj.index == 0) {
                        animObj.delayTimer = animObj.animDelay;
                    }
                }
            }

            this.tidTranslations[animObj.fromTid] = (animObj.index == 1 ? animObj.toTid : animObj.fromTid);
        }
    },

    prepareTidAnimations: function () {
        var tileProps = this.data.tilesets[0].tileproperties;

        this.tidAnimations = [];

        if (tileProps == null) {
            return;
        }

        for (var tid in tileProps) {
            var propsForTid = tileProps[tid];

            if (propsForTid.animation != null) {
                var animDataRaw = propsForTid.animation;
                var animDataBits = animDataRaw.split(',');

                var animObj = { };
                animObj.fromTid = parseInt(tid) + 1;
                animObj.toTid = parseInt(animDataBits[0]) + 1;
                animObj.animSpeed = parseInt(animDataBits[1]);
                animObj.animDelay = parseInt(animDataBits[2]);
                animObj.index = 0;
                animObj.delayTimer = animObj.animDelay;
                animObj.animateTimer = animObj.animSpeed;

                this.tidAnimations.push(animObj);
            }
        }
    },
});