// Global variables
// Make dynamic eventually
var game_w = 800;
var game_h = 600;
var game_fps = 60;
// Math
var tau = Math.PI / 2;
var circle = Math.PI * 2;
var G = 4;
var L1_correctness = 70;
var L2_correctness = 85;
// See wikipedia entry for Comparison Sort
// Wait am I using this lmao. This looks useful though
var minimum_sort = [0, 1, 3, 5, 7, 10, 13, 16, 19, 22, 26, 30, 34, 38, 42];
//font config stuff
var global_font = "press_start_2pregular";
// var global_font = "Conv_IndieFlower";
var global_font_size = 15;
// Timer lengths 
var normal_timer_len = 20;
var pressure_timer_length = 10;
var backup_dialogue_time = 7;
// Timer positions
var timer_icon_x = 10;
var timer_icon_y = 515;
var timer_icon_w = 35;
var timer_icon_h = 30;
// dialogue box dimensions
var dialogue_box_w = 800;
var dialogue_box_h = 125;
var dialogue_text_w = 45;
// location of dialogue boxes
var dialogue_box_x = 0;
var dialogue_box_1_y = 25;
var dialogue_box_2_y = 540;
// In context of dialogue box dimensions
var text_offset = 10;
var query_text_w = 30;
var query_y_height = 25;
var button_y = 485;
var submit_button_x = 83;
var backspace_button_x = 48;
var clear_button_x = 13;
var bg_audio = null;
// Start the game!
function StartGame(){
	if(click_to_play){
		click_to_play = null;
		game.state.start("breakfast");
		//game.state.start("office");
		//game.state.start("breakroom");
	}
}
// Go back to the main menu
function MainMenu(){
    // set all event variables t ofalse if you go back to the main menu
    // whenever I get arround to making them lmao
    var skip_to_tutorial = false;
    // Destroy the current game's layers.
    var currstate = game.state.states[game.state.current];
    if (currstate.manager){
        DestroyLayers(currstate);
    }
    // Start main menu state
    game.state.start("intro");
}
// Functions for getting random numbers
function RandomInt(min, max) {
    // DOn't call another function. reduces function overhead.
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function RandomFloat(min, max) {
	return Math.random() * (max - min + 1) + min
}
// Create layers
// Design protocol for background. Probably not very complicated.
// state.background = game.add.group();
function InitializeLayers(state){
    state.background_layer = game.add.group();
    state.floating_text_layer = game.add.group();
    state.dialogue_ui_layer = game.add.group();
    state.dialogue_text_layer = game.add.group();
    state.general_ui_layer = game.add.group();
}
// Destroys layers. I think this increases memory performance.
// idk its fucking javascript
function DestroyLayers(state){
    state.background_layer.destroy(true);
    state.floating_text_layer.destroy(true);
    state.dialogue_ui_layer.destroy(true);
    state.dialogue_text_layer.destroy(true);
    state.general_ui_layer.destroy(true);
}
// Global variable for player anxiety
var anxiety = 60;
// Other global variables for certain events.
// For example checking whether you accepted
// an invitation to a party.
// TODO ACTUALLY ADD THESE
var click_to_play = false;
var skip_to_tutorial = false;
var event_happened = false; //example
var game = new Phaser.Game(game_w, game_h, Phaser.AUTO, "Phaser-Game");

game.state.add("boot", boot_state);
game.state.add("load", load_state);
game.state.add("intro", intro_state);
game.state.add("breakfast", breakfast_state);
game.state.add("office", office_state);
game.state.add("breakroom", breakroom_state);
game.state.add("end", end_state);

game.state.start("boot");
