var load_state = {
    preload: function(){
        //load any assets
        game.load.image("submit", "assets/icons/submit.png");
        game.load.image("backspace", "assets/icons/backspace.png");
        game.load.image("clear", "assets/icons/clear.png");
        game.load.image("dialogue_box", "assets/icons/dialogue_box.png");
        game.load.image("timer_ico", "assets/icons/time_bubble.png");
        game.load.image("mail", "assets/icons/mail_ico.png");
        game.load.image("twitter", "assets/icons/tw_ico.png");
        game.load.spritesheet("title_bg", "assets/bg/title_bg_anim.png", 800, 600);
        game.load.spritesheet("breakfast_bg", "assets/bg/breakfast_bg_anim.png", 800, 600);
        game.load.spritesheet("office_bg", "assets/bg/office_bg_anim.png", 800, 600);
        game.load.spritesheet("breakroom_bg", "assets/bg/breakroom_bg_anim.png", 800, 600);
		game.load.audio("gnossiene_2", "assets/music/gnossiene_2.mp3");
		game.load.audio("speech", "assets/SFX/speech.wav");
		game.load.audio("error", "assets/SFX/error.wav");
		game.load.audio("pushpop", "assets/SFX/push_pop_text.wav");
    },
    loadUpdate: function(){
    },
    loadRender: function(){
        game.stage.backgroundColor = "#ffff80";
		game.add.text(100, 200, "Loading...", { font: global_font_size + "px " + global_font});
    },
    create: function(){
		this.sounds = [];
		this.sounds.push(game.add.audio("gnossiene_2"));
		this.sounds.push(game.add.audio("speech"));
		this.sounds.push(game.add.audio("error"));
		this.sounds.push(game.add.audio("pushpop"));
    },
    update: function(){
		var i = 0;
		while (i < this.sounds.length){
			if (this.sounds[i].isDecoding){
				break;
			}
			i++;
		}
		if (i == this.sounds.length){
			game.state.start("intro");
            //game.state.start("test");
		}
    },
    resize: function(){
    },
    shutdown: function(){
    }
}
