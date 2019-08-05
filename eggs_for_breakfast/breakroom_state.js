var breakroom_state = {
    color_light: "#f6cfff",
    color_medium: "#eb9ff",
    color_heavy: "rgba(194, 7, 240, 1.0)",
    color_contrast: "#ecff3c",
    preload: function(){
    },
    loadUpdate: function(){
    },
    loadRender: function(){
    },
    create: function(){
        InitializeLayers(this);
		// this will be pre-defined per level state
        var sprite = game.add.sprite(0, 0, "breakroom_bg");
        var anim = sprite.animations.add("flick", [0, 1], 6, true);
        sprite.animations.play("flick");
        this.background_layer.add(sprite);
        document.body.style.background = "#EB99FF";
        game.stage.backgroundColor = "#EB99FF";
        this.manager = new SceneManager(
                this,
                breakroom_scene,
                "end");
    },
    update: function(){
        this.manager.Update();
    },
    resize: function(){
    },
    shutdown: function(){
        DestroyLayers(this);
    }
}
