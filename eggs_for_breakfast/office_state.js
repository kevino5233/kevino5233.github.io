var office_state = {
    color_light: "#e6f0ff",
    color_medium: "#3385ff",
    color_heavy: "rgba(4, 71, 169, 1.0)",
    color_contrast: "#ffa100",
    preload: function(){
    },
    loadUpdate: function(){
    },
    loadRender: function(){
    },
    create: function(){
        InitializeLayers(this);
        var sprite = game.add.sprite(0, 0, "office_bg");
        var anim = sprite.animations.add("flick", [0, 1], 6, true);
        sprite.animations.play("flick");
        this.background_layer.add(sprite);
        document.body.style.background = this.color_medium;
        game.stage.backgroundColor = this.color_medium;
        this.manager = new SceneManager(
                this,
				office_scene,
                "breakroom");
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
