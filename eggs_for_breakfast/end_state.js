var end_state = {
    preload: function(){
    },
    loadUpdate: function(){
    },
    loadRender: function(){
    },
    create: function(){
        document.body.style.background = "#ffff80";
        game.stage.backgroundColor = "#ffff80";
		var style = {
            font: global_font_size + "px " + global_font
        };
		game.add.text(110, 270, "hello@kevino-is.me", style);
		game.add.text(110, 340, "@kevino_is_me", style);
		game.add.sprite(50, 250, "mail");
		game.add.sprite(50, 325, "twitter");
		var style_2 = {
            font: global_font_size * 2 + "px " + global_font,
            fill: "green"
        };
		var play_again_text = game.add.text(50, 100, "Play again?", style_2);
		play_again_text.inputEnabled = true;
		play_again_text.events.onInputUp.add(
			function(item){
                skip_to_tutorial = true;
                click_to_play = false;
				game.state.start("intro");
			}, this);
    },
    update: function(){
    },
    resize: function(){
    },
    shutdown: function(){
    }
}

