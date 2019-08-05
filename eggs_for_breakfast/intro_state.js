var intro_state = {
	MENU: 0,
	PLAY: 1,
	menu_layers: [],
	floating_obj: [],
	floating_obj_paths: [],
	Menu: function(){
		this.menu_layers[this.MENU].visible = true;
		this.menu_layers[this.PLAY].visible = false;
	},
	PlayGame: function(){
		click_to_play = true;
		this.menu_layers[this.MENU].visible = false;
		this.menu_layers[this.PLAY].visible = true;
	},
    preload: function(){
    },
    loadUpdate: function(){
    },
    loadRender: function(){
    },
    create: function(){
        document.body.style.background = "#ffff80";
        game.stage.backgroundColor = "#ffff80";
        var sprite = game.add.sprite(0, 0, "title_bg");
        var anim = sprite.animations.add("flick", [0, 1], 6, true);
        sprite.animations.play("flick");
		this.menu_layers = [game.add.group(), game.add.group(), game.add.group()];
		var style = { font: global_font_size + "px " + global_font};
		// Menu layer
		//this.menu_layers[this.MENU].add(game.add.text(200, 250,
		//	"Eggs for Breakfast",
		//	{ font: 2 * global_font_size + "px " + global_font}));
		var centerx = game_w / 2;
		var centery = game_h / 2;
        var title = ["By", "Kevino"];
		for (var i = 0; i < title.length + 1; i++){
            var randx = RandomFloat(-100, 100);
            var randy = RandomFloat(-100, 100);
			var text = game.add.text(0, 0,
				i == title.length ? "Play" : title[i]);
			text.manager = this.manager;
			text.font = global_font;
			text.fontSize = global_font_size * 2;
			text.inputEnabled = true;
            if (i == title.length) {
                text.events.onInputUp.add(this.PlayGame, this);
                text.events.onInputOver.add(
                    function(item){
                        item.fill = "#CBCB4B";
                    }, this);
                text.events.onInputOut.add(
                    function(item){
                        item.fill = "#8E5AAA";
                    }, this);
                text.fill = "#8E5AAA";
            } else {
                text.fill = "#000000";
            }
			this.menu_layers[this.MENU].add(text);
			this.floating_obj.push(text);
			var T = Math.ceil(Math.sqrt(150 / G) * Math.PI * 150);
			var theta = (tau * i) % circle; //initialize as actual angle
			var dtheta = circle / T * (2 * RandomInt(0, 1) - 1);
			var h_radius = 100;
			var v_radius = Math.sqrt(200) * 5;
			var path = [];
			path["pos"] = 0;
			for (var j = 0; j < T; j++){
				var pos = [];
				var text_x = h_radius * Math.cos(theta)
                    + centerx
                    + randx
                    - 20
                    - text.text.length / 2 * text.fontSize;
				var text_y = v_radius * Math.sin(theta)
                    + centery
                    + randy
                    - 10
                    - text.fontSize / 2;
				if (text_x < 0) {
					text_x = 0;
				} else if (text_x + 6 * text.fontsize > game_w) {
					text_x = game_w - 6 * text.fontsize;
				}
				if (text_y < dialogue_box_1_y + dialogue_box_h) {
					text_y = dialogue_box_1_y + dialogue_box_h + 10;
				} else if (text_y + text.fontSize + 10 > timer_icon_y) {
					text_y = timer_icon_y - text.fontSize - 10;
				}
				pos["x"] = text_x;
				pos["y"] = text_y;
				path.push(pos);
				theta += dtheta;
				theta %= circle;
			}
			this.floating_obj_paths.push(path);
		}
        // this.game.sound.volume = 0;
		// Play layer
		this.menu_layers[this.PLAY].add(game.add.text(50, 100,
            "The following prototype represents a work in\n" +
            "progress.\n\n" +
			"Talk by clicking on individual words that float\n" +
            "around in the middle of the screen to make\n" +
            "sentences.", style));
		// Play layer
		this.menu_layers[this.PLAY].add(game.add.text(100, 250,
			"If you add a word you didn't mean to, simply\n" +
			"click the delete button.", style));
		this.menu_layers[this.PLAY].add(game.add.text(100, 300,
			"If you've added a lot of words you didn't want to,\n" +
			"hit the clear button.", style));
		this.menu_layers[this.PLAY].add(game.add.text(100, 350, 
			"When you're ready to speak,\n" +
			"hit the submit button.", style));
		this.menu_layers[this.PLAY].add(game.add.text(50, 450,
			"Click anywhere to start.", style));
		this.menu_layers[this.PLAY].add(game.add.sprite(50, 250, "backspace"));
		this.menu_layers[this.PLAY].add(game.add.sprite(50, 300, "clear"));
		this.menu_layers[this.PLAY].add(game.add.sprite(50, 350, "submit"));
		if (!(bg_audio && bg_audio.isPlaying)){
            bg_audio = game.add.audio("gnossiene_2", 1, false).play();
            bg_audio.onStop.add(function(){
                bg_audio.play();
            });
        }
		// Hide layers
		this.menu_layers[this.PLAY].visible = false;
    },
    update: function(){
		for (var i = 0; i < this.floating_obj.length; i++){
			var path = this.floating_obj_paths[i];
			var pos = path[path["pos"]];
			path["pos"]++;
			path["pos"] %= path.length;
			this.floating_obj[i].x = pos.x;
			this.floating_obj[i].y = pos.y;
		}
    },
    resize: function(){
    },
    shutdown: function(){
    }
}
