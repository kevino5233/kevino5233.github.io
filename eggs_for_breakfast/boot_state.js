var boot_state = {
    preload: function(){
    },
    loadUpdate: function(){
    },
    loadRender: function(){
    },
    create: function(){
        //maybe not needed?
        //game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start("load");
    },
    update: function(){
    },
    resize: function(){
    },
    shutdown: function(){
    }
}
