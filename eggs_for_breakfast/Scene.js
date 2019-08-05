Scene = function(manager, scene_data){
	this.manager = manager;

	//Phaser.Group.call(this, game);

	this.id = scene_data.id;
	this.dialogue = scene_data.dialogue;
	this.retries = scene_data.retries; 
    this.OnLoad = scene_data.OnLoad;
	this.fallback = scene_data.fallback;
	this.fall_in = scene_data.fall_in;
	this.fallback_scene = scene_data.fallback_scene;
	this.wordbank = scene_data.wordbank;
	this.sentences = scene_data.sentences;
	this.speaker = scene_data.speaker;
}

Scene.prototype = Object.create(Phaser.Group.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.LoadDialogueText = function(text){
	var dialogue_chars_array = [];
	var currlen = 0;
    var dialogue_speaker_array = this.speaker.split(" ");
	for (var i = 0; i < dialogue_speaker_array.length; i++){
		var newlen = currlen + dialogue_speaker_array[i].length;
		if (newlen < dialogue_text_w){
			currlen = newlen;
		} else {
			dialogue_chars_array.push("\n");
			currlen = 0;
		}
		dialogue_chars_array =
			dialogue_chars_array.concat(dialogue_speaker_array[i].split(""));
		if (i + 1 < dialogue_speaker_array.length){
            dialogue_chars_array.push(" ");
            currlen += 1;
        } else if (text != ""){
            dialogue_chars_array.push(": ");
            currlen += 2;
        }
	}
    if (text == ""){
        this.manager.dialogue_chars = dialogue_chars_array;
        this.manager.dialogue_frames = 0;
        this.manager.dialogue_pos = 0;
        return;
    }
	var dialogue_words_array = text.split(" ");
	for (var i = 0; i < dialogue_words_array.length; i++){
		var newlen = currlen + dialogue_words_array[i].length + 1;
		if (newlen < dialogue_text_w){
			currlen = newlen;
		} else {
			dialogue_chars_array.push("\n");
			currlen = 0;
		}
		dialogue_chars_array =
			dialogue_chars_array.concat(dialogue_words_array[i].split(""));
		dialogue_chars_array.push(" ");
	}
	this.manager.dialogue_chars = dialogue_chars_array;
	this.manager.dialogue_frames = 0;
	this.manager.dialogue_pos = 0;
}

Scene.prototype.Load = function(correctness){
	var index = 0;
    if (correctness == -1){
        this.LoadDialogueText("");
        return true;
    } else if (correctness < L1_correctness){
		if (this.dialogue.length == 3){
            index = 2;
		} else if (this.dialogue.length == 1){
            index = 0;
        } else {
			return false;
		}
	} else if (correctness < L2_correctness){
		index = 1;
	}
	this.LoadDialogueText(this.dialogue[index]);
	var centerx = game_w / 2;
	var centery = game_h / 2;
	var deadzone = this.manager.deadzone;
    var scene = this.manager.state;
	for (var i = 0; i < this.wordbank.length; i++){
		var word = this.wordbank[i];
		var a = word.anxiety * 4;
		var randx = RandomFloat(-deadzone, deadzone);
		var randy = RandomFloat(-deadzone, deadzone);
		var text = game.add.text(
                centerx +
				randx +
				Math.cos(tau * RandomFloat(0, 4)) * a * 2,
                centery +
				randy +
				Math.sin(tau * RandomFloat(0, 4)) * a * 2,
			word.text);
		text.manager = this.manager;
		text.font = global_font;
		text.fontSize = Math.ceil(((100 - word.anxiety) * (100 - word.anxiety)) / 10000 * 15 + 10);
        text.fill = scene.color_light;
		text.setShadow(1, 1, scene.color_heavy, 10);
		text.inputEnabled = true;
		text.events.onInputUp.add(this.manager.PushWordOnQuery, this.manager);
		text.events.onInputOver.add(
			function(item){
				item.fill = scene.color_contrast;
			}, this);
		text.events.onInputOut.add(
			function(item){
                item.fill = scene.color_light;
			}, this);
        this.manager.state.floating_text_layer.add(text);
		this.manager.floating_text.push(text);
		var T_hack_lol = 20 + (a / 100) * 80;
		var T = Math.ceil(Math.sqrt(3 * T_hack_lol / G) * Math.PI * T_hack_lol);
		var theta = (tau * i) % circle; //initialize as actual angle
		var dtheta = circle / T * (2 * RandomInt(0, 1) - 1);
		var h_radius = a / 2;
		var v_radius = Math.sqrt(a) * 5;
		var path = [];
		path["pos"] = 0;
		for (var j = 0; j < T; j++){
			var pos = [];
            var text_x = h_radius * Math.cos(theta)
				+ centerx
				+ randx
                - 20
				- word.text.length / 2 * text.fontSize;
            var text_y = v_radius * Math.sin(theta)
				+ centery
				+ randy
                - 10 // LMAOOOO HACK HACK HACK HACK
				- text.fontSize / 2;
            if (text_x < 0) {
                text_x = 0;
            } else if (text_x + word.text.length * text.fontsize > game_w) {
                text_x = game_w - word.text.length * text.fontsize;
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
		this.manager.floating_text_paths.push(path);
	}
    return true;
}
