SceneManager = function(state, scene_data, nextscene){
    this.scenes = [];
    for (var i = 0; i < scene_data.scenes.length; i++){
        this.scenes.push(new Scene(this, scene_data.scenes[i]));
    }
    // make global?
	this.deadzone = 100;
	this.floating_text = [];
	this.floating_text_paths = [];
	this.query = {
		words: [],
		linewidths: [],
		len: 0,
		x: 0,
		y: 0
	};
	this.speechsound = game.add.audio("speech");
	this.errorsound = game.add.audio("error");
	this.pushpopsound = game.add.audio("pushpop");
    this.nextscene = nextscene;
    this.state = state;
	// this.state.dialogue_ui_layer.add(
    //     game.add.sprite(dialogue_box_x, dialogue_box_1_y, "dialogue_box"));
	// this.state.dialogue_ui_layer.add(
    //     game.add.sprite(dialogue_box_x, dialogue_box_2_y, "dialogue_box"));
	this.dialogue_obj = game.add.text(
		dialogue_box_x + text_offset,
		dialogue_box_1_y + text_offset, "");
    this.dialogue_obj.fill = state.color_light;
    this.dialogue_obj.font = global_font;
    this.dialogue_obj.fontSize = global_font_size;
    this.state.dialogue_text_layer.add(this.dialogue_obj);
    this.just_finished = false;
	// Initial x values of these buttons don't really matter
	// since they'll be invisible and the values will be
	// corrected as soon as words are pushed
	this.button_back = game.add.button(backspace_button_x, button_y, "backspace",
			this.PopWordFromQuery, this);
	this.button_submit = game.add.button(submit_button_x, button_y, "submit",
			this.EvaluateQuery, this);
	this.button_clear = game.add.button(clear_button_x, button_y, "clear",
			this.ClearQuery, this);
    this.state.general_ui_layer.add(this.button_back);
    this.state.general_ui_layer.add(this.button_submit);
    this.state.general_ui_layer.add(this.button_clear);
    this.state.general_ui_layer.visible = false;
	this.error_timer_len = 60;
	this.error_timer_pos = 60;
    this.timer_sprites = [];
    this.timer_len = normal_timer_len * game_fps;
    this.timer_curr = this.timer_len;
    this.LoadScene(scene_data.start, -1);
}
SceneManager.prototype.ClearQuery = function(){
    this.pushpopsound.play();
    while (this.query.words.length > 0){
        var text = this.query.words.pop();
        var orig = text.orig;
        this.query.x -= text.text.length + 1;
        orig.visible = true;
        orig.fill = this.state.color_light;
        text.destroy();
    }
    this.query.x = 0;
    this.query.y = 0;
}
SceneManager.prototype.LoadScene = function(scene_num, correctness){
    if (this.currscene){
        while (this.query.words.length > 0){
            var text = this.query.words.pop();
            text.destroy();
        }
        this.query.x = 0;
        this.query.y = 0;
        while (this.floating_text.length > 0){
            var text = this.floating_text.pop();
            text.destroy();
        }
        game.input.onDown.remove(this.ContinueMaybe, this);
    }
    if (this.scenes[scene_num].Load(correctness)){
        this.currscene = this.scenes[scene_num];
        this.state.general_ui_layer.visible = false;
        this.state.floating_text_layer.visible = false;
        this.just_finished = false;
        while (this.timer_sprites.length > 0){
            var timer_sprite = this.timer_sprites.pop();
            timer_sprite.destroy();
        }
		return true;
    }
	return false;
}
SceneManager.prototype.EvaluateSentence = function(query, sentence) {
	var CUP = sentence.CUP;
	var EUP = sentence.EUP;
	var words = [];
	for (var i = 0; i < sentence.words.length; i++){
		words.push(sentence.words[i].toUpperCase());
	}
	var query_words = [];
	for (var i = 0; i < query.length; i++){
		query_words.push(query[i].toUpperCase());
	}
    // count crucial words
	var n_crucial_words = 0;
	var crucial_words = sentence.crucial_words;
	var crucial_words_pos = new Array(crucial_words.length);
	crucial_words_pos.fill(-1);
	for (var i = 0; i < query_words.length && crucial_words; i++) {
		for (var j = 0; j < crucial_words.length; j++) {
			if (query_words[i] == words[crucial_words[j]]) {
				crucial_words_pos[j] = i;
				n_crucial_words++;
			}
		}
	}
	var k = 0;
	while (k < crucial_words_pos.length) {
		if (crucial_words_pos[k] == -1) {
			crucial_words_pos.splice(k, 1);
		} else {
			k++;
		}
	}
    // determine order
	var crucial_words_order = crucial_words_pos.sort();
	var n_crucial_wo3 = 0;
	for (var i = 0; i < crucial_words_pos.length; i++) {
		if (crucial_words_pos[i] != crucial_words_order[i]) {
			n_crucial_wo3++;
		}
	}
	n_crucial_wo3 *= 2;
    // count non crucial words
	var n_non_crucial_words = 0;
	var non_crucial_words = sentence.non_crucial_words;
	var non_crucial_words_pos = new Array(non_crucial_words.length);
	non_crucial_words_pos.fill(-1);
	for (var i = 0; i < query_words.length && non_crucial_words; i++) {
		for (var j = 0; j < non_crucial_words.length; j++) {
			if (query_words[i] == words[non_crucial_words[j]]) {
				non_crucial_words_pos[j] = i;
				n_non_crucial_words++;
			}
		}
	}
	k = 0;
	while (k < non_crucial_words_pos.length) {
		if (non_crucial_words_pos[k] == -1) {
			non_crucial_words_pos.splice(k, 1);
		} else {
			k++;
		}
	}
    // determine order
	var non_crucial_words_order = non_crucial_words_pos.sort();
	var n_non_crucial_wo3 = 0;
	for (var i = 0; i < non_crucial_words_pos.length; i++) {
		if (non_crucial_words_pos[i] != non_crucial_words_order[i]) {
			n_non_crucial_wo3++;
		}
	}
	n_non_crucial_wo3 *= 2;
    // count articles and trivial words
	var n_trivial_words = 0;
	var trivial_words = sentence.trivial_words;
	var trivial_words_pos = new Array(trivial_words.length);
	trivial_words_pos.fill(-1);
	for (var i = 0; i < query_words.length && trivial_words; i++) {
		for (var j = 0; j < trivial_words.length; j++) {
			if (query_words[i] == words[trivial_words[j]]) {
				n_trivial_words++;
				trivial_words_pos[j] = i;
			}
		}
	}
	k = 0;
	while (k < trivial_words_pos.length) {
		if (trivial_words_pos[k] == -1) {
			trivial_words_pos.splice(k, 1);
		} else {
			k++;
		}
	}
    // count random words in between CW and outside CW
	var non_random_words = crucial_words_order.concat(
		non_crucial_words_order.concat(trivial_words_pos)).sort();
    // remove duplicates
	k = 0;
	while (k + 1< non_random_words.length) {
		if (non_random_words[k] == non_random_words[k + 1]) {
			non_random_words.splice(k, 1);
		} else {
			k++;
		}
	}
	var random_words_in = 0;
	var random_words_out = 0;
	k = 0;
	for (var i = 0; i < query_words.length; i++) {
		if (i == non_random_words[k]){
			k++;
		} else if (i < crucial_words_order[0] ||
			i > crucial_words_order[crucial_words_order.length - 1]) {
			random_words_out++;
		} else {
			random_words_in++;
		}
	}
	// calculate final correctness
	var crucial_error =
        (crucial_words.length - n_crucial_words + n_crucial_wo3)
        / crucial_words.length;
	var extra_error = non_crucial_words.length == 0 ?
        1 :
        (non_crucial_words.length - n_non_crucial_words + n_non_crucial_wo3)
        / non_crucial_words.length;
	var trivial_error = trivial_words.length == 0 ?
        0 :
        trivial_words.length - n_trivial_words;
	var random_error = 
		(random_words_in * CUP / crucial_words.length)
         + (non_crucial_words.length == 0 ?
               random_words_out * EUP :
               random_words_out * EUP / non_crucial_words.length);
	var score = Math.max(100
                    - Math.floor(crucial_error * CUP)
                    - Math.floor(extra_error * EUP)
                    - trivial_error
                    - random_error, 0);
	return score;
}
SceneManager.prototype.PushWordOnQuery = function(item){
	this.pushpopsound.play();
	item.visible = false;
	var word = item.text;
	if (this.query.x + word.length + 1 > query_text_w){
		this.query.linewidths.push(this.query.x);
		this.query.x = 0;
		this.query.y += 1;
	}
	var text = game.add.text(
		dialogue_box_x + text_offset + this.query.x * global_font_size,
		dialogue_box_2_y + text_offset + this.query.y * query_y_height,
		word);
    text.orig = item;
    text.fill = this.state.color_light;
	text.font = global_font;
	text.fontSize = global_font_size;
	text.inputEnabled = true;
    this.state.dialogue_text_layer.add(text);
	this.query.words.push(text);
	this.query.x += word.length + 1;
}
SceneManager.prototype.PopWordFromQuery = function(item){
	this.pushpopsound.play();
	var text = this.query.words.pop();
    var orig = text.orig;
	this.query.x -= text.text.length + 1;
    orig.visible = true;
    orig.fill = this.state.color_light;
    text.destroy();
	if (this.query.x <= 0 && this.query.words.length != 0){
		this.query.y -= 1;
		this.query.x = this.query.linewidths.pop();
	}
}
SceneManager.prototype.EvaluateQuery = function(key){
	var sentences = this.currscene.sentences;
    var query = [];
    if (this.query.words.length == 0) {
        if (this.LoadScene(this.currscene.fallback_scene, 0)){
            return;
        } else {
            this.retries--;
            this.errorsound.play();
            this.error_timer_pos = 0;
            this.button_submit.loadTexture("backspace");
            this.currscene.LoadDialogueText(this.currscene.fall_in);
        }
    }
	for (var i = 0; i < this.query.words.length; i++){
        query.push(this.query.words[i].text);
    }
	var next_scene = {sentence: -1, scene: -1, correctness: -1};
    for (var i = 0; i < sentences.length; i++){
        var correctness = this.EvaluateSentence(query, sentences[i]);
		if (correctness > next_scene.correctness){
			next_scene.sentence = i;
			next_scene.scene = sentences[i].response;
			next_scene.correctness = correctness;
		}
    }
    if (next_scene.correctness >= 70){
		//if (septences[next_scene.sentence].OnCorrect){
		//	sentences[next_scene.sentence].OnCorrect(next_scene.correctness);
		//}
        this.LoadScene(next_scene.scene, next_scene.correctness);
    } else {
		this.retries--;
		this.errorsound.play();
		this.error_timer_pos = 0;
		this.button_submit.loadTexture("backspace");
		this.currscene.LoadDialogueText(this.currscene.fall_in);
	}
}
SceneManager.prototype.ContinueMaybe = function(){
    if (this.currscene.retries == -1){
        this.LoadScene(this.currscene.fallback_scene, 0);
    } else if (this.currscene.retries == -2){
        game.state.start(this.nextscene);
    }
}
SceneManager.prototype.Update = function(){
	if (this.dialogue_pos < this.dialogue_chars.length){
		if (this.dialogue_frames % 2 == 0){
			if (this.dialogue_pos == 0){
				this.dialogue_obj.setText(this.dialogue_chars[this.dialogue_pos]);
			} else {
				this.dialogue_obj.setText(
					this.dialogue_obj.text
					+ this.dialogue_chars[this.dialogue_pos]);
			}
			if (this.dialogue_pos % 4 == 0){
				this.speechsound.play();
			}
			this.dialogue_pos++;	
            if (this.dialogue_pos == this.dialogue_chars.length){
                this.just_finished = true;
            }
		}
		this.dialogue_frames++;
	} else {
        if (this.just_finished && this.currscene.retries < 0){
            var text = game.add.text(
				dialogue_box_x + text_offset,
				dialogue_box_2_y + text_offset,
				"Click anywhere to continue.");
            text.fill = this.state.color_light;
			text.font = global_font;
			text.fontSize = global_font_size;
            this.state.dialogue_text_layer.add(text);
            this.query.words.push(text);
            game.input.onDown.add(this.ContinueMaybe, this);
        }
        if (!this.state.floating_text_layer.visible && this.currscene.retries >= 0){
			this.state.general_ui_layer.visible = true;
            this.state.floating_text_layer.visible = true;
            this.timer_curr = this.timer_len;
            for (var i = 0; i < normal_timer_len; i++){
                var timer_sprite = game.add.sprite(
                    timer_icon_x + timer_icon_w * i,
                    timer_icon_y,
                    "timer_ico");
                this.state.general_ui_layer.add(timer_sprite);
                this.timer_sprites.push(timer_sprite);
            }
        } else if (this.currscene.retries >= 0){
            this.timer_curr--;
            if (this.timer_curr < this.timer_len
                    && this.timer_curr >= 0
                    && this.timer_curr % game_fps == 0){
                this.timer_sprites.pop().destroy();
                if (this.timer_curr == backup_dialogue_time * game_fps){
                    this.currscene.LoadDialogueText(this.currscene.fallback);
                } else if (this.timer_curr <= 0
                        && !this.LoadScene(
                                this.currscene.fallback_scene, 0)){
                    console.log("shit fucked up");
                }
            }
        }
        if (this.just_finished){
            this.just_finished = false;
        }
    }

	if (this.error_timer_pos < this.error_timer_len){
		this.error_timer_pos++;
		if (this.error_timer_pos == this.error_timer_len){
			this.button_submit.loadTexture("submit");
		}
	}
    for (var i = 0; i < this.floating_text.length; i++){
        var path = this.floating_text_paths[i];
        var pos = path[path["pos"]];
        path["pos"]++;
        path["pos"] %= path.length;
        this.floating_text[i].x = pos.x;
        this.floating_text[i].y = pos.y;
    }
}
