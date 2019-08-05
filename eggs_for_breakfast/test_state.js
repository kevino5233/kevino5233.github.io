var test_state = {
    preload: function(){
    },
    loadUpdate: function(){
    },
    loadRender: function(){
    },
    create: function(){
        // Eventually move to initialize layer function
        game.stage.backgroundColor = "#EB99FF";
        InitializeLayers(this);
        var thing = new Timer(this, 5, this.testo, this);
    },
    testo: function() {
        console.log(this);
    },
    update: function(){
    },
    resize: function(){
    },
    shutdown: function(){
    }
}
