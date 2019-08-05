var breakfast_state = {
    color_light: "#ffeae5",
    color_medium: "#ff6944",
    color_heavy: "rgba(204, 41, 0, 1.0)",
    color_contrast: "#008234",
    preload: function(){
    },
    loadUpdate: function(){
    },
    loadRender: function(){
    },
    create: function(){
        InitializeLayers(this);
        var sprite = game.add.sprite(0, 0, "breakfast_bg");
        var anim = sprite.animations.add("flick", [0, 1], 6, true);
        sprite.animations.play("flick");
        this.background_layer.add(sprite);
        document.body.style.background = this.color_medium;
        game.stage.backgroundColor = this.color_medium;
		// this will be pre-defined per level state
        this.manager = new SceneManager(
                this,
                breakfast_scene,
                "office");
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
