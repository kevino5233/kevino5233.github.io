var names = [
{
	name: "Don Quixote",
	used: false
},
{
	name: "King Arthur",
	used: false
},
{
	name: "Ted Cruz",
	used: false
},
{
	name: "Sir Lancelot",
	used: false
},
{
	name: "Davy Crockett",
	used: false
},
{
	name: "Gandhi",
	used: false
},
{
	name: "Resident Sleeper",
	used: false
},
{
	name: "Plato",
	used: false
}
];

var scenes = [
{
	name: "Sudden Encounter",
	encountered: false
},
{
	name: "Out of Food",
	encountered: false
},
{
	name: "Running in Circles",
	encountered: false
}
];

var bios = {
	experience: ["He is a relative newcomer. He is not as battle-hardened as the rest of your partners and is more prone to making mistakes. ",
				"",
				"He has been with you since the formation of the team. He has developed a tried-and-true sense of intuition. "],
	mercy: ["He is borderline sadist. He holds contempt for the weak and feels that life should be a prize worthy only of the greatest. ",
			"",
			"He is magnanimous. He believes that all creatures of all races are naturally good and that all should have the chance to manifest this. "],
	greed: ["He is benevolent. He is a well-to-do individual and is even willing to forego his cut for this adventure.",
			"",
			"He lusts for wealth. Prior to the expedition he shamelessly argued for an enormous share in the loot. "],
	bravery: ["He is a coward. He jumps at every twist and creak of a dungeon and has developed a reputation of running away from hard fights. ",
			"",
			"He is courageous. He is a role model to the rest of your group as he is often the last to run away from a fight. "],
	wit: ["He is a dumbass. Last expedition you were nearly scalded by a trap that he failed to avoid, his excuse being that it had offered free candy. ",
		"",
		"He is crafty. You have managed to avoid many fights altogether because of his attention to alternate routes as well as his sharp wits. "],
	paranoia: ["He is laid back. He easily trusts others and believes in your ability to manage the inner politics of the team. ",
			"",
			"He is paranoid. He believes that the creatures of the dark and his peers alike are out to get him. "]
};

var party = [
{
	name: "",
	bio: "",
	alive: true,
	acted: false,
	experience: 0,
	mercy: 0,
	greed: 0,
	bravery: 0,
	wit: 0,
	suspicion: 0,
	paranoia: 0
},
{
	name: "",
	bio: "",
	alive: true,
	acted: false,
	experience: 0,
	mercy: 0,
	greed: 0,
	bravery: 0,
	wit: 0,
	suspicion: 0,
	paranoia: 0
},
{
	name: "",
	bio: "",
	alive: true,
	acted: false,
	experience: 0,
	mercy: 0,
	greed: 0,
	bravery: 0,
	wit: 0,
	suspicion: 0,
	paranoia: 0
},
{
	name: "",
	bio: "",
	alive: true,
	acted: false,
	experience: 0,
	mercy: 0,
	greed: 0,
	bravery: 0,
	wit: 0,
	suspicion: 0,
	paranoia: 0
}
];

var seed = 0;
var traitor = -1;

function nextRand(){
	var rand = Math.sin(seed++) * 10000;
	return rand - Math.floor(rand);
};

function getVariable(arg){
	return state.history[0].variables[arg.substring(1)];
};

function setVariable(arg, val){
	state.history[0].variables[arg.substring(1)] = val;
};

//<<seedify $name>>
macros['seedify'] = {
	handler: function(place, macroName, params, parser) {
		var name = getVariable(params[0]);
		seed = 0;
		for (var i = 0; i < name.length; i++){
			seed += name.charCodeAt(i);
		}
		//instantiate party members
		for (var i = 0; i < party.length; i++){
			//instantiate name
			var randNameIndex = nextRand();
			randNameIndex = Math.floor(randNameIndex * names.length);
			var nameObj = names[randNameIndex];
			while (nameObj.used){
				randNameIndex++;
				randNameIndex %= names.length;
				nameObj = names[randNameIndex];
			}
			party[i].name = nameObj.name;
			nameObj.used = true;
			
			//instantiate other stuff
			var randall;
			var bio = "";
			
			//instantiate experience
			randall = Math.floor(nextRand() * 3);
			bio += bios.experience[randall]
			randall = (randall + 1) * 25;
			party[i].experience = randall;
			
			//instantiate greed
			randall = Math.floor(nextRand() * 3);
			bio += bios.greed[randall]
			randall = (randall + 1) * 25;
			party[i].greed = randall;
			
			//instantiate mercy
			randall = Math.floor(nextRand() * 3);
			bio += bios.mercy[randall]
			randall = (randall + 1) * 25;
			party[i].mercy = randall;
			
			//instantiate bravery
			randall = Math.floor(nextRand() * 3);
			bio += bios.bravery[randall]
			randall = (randall + 1) * 25;
			party[i].bravery = randall;
			
			//instantiate wit
			randall = Math.floor(nextRand() * 3);
			bio += bios.wit[randall]
			randall = (randall + 1) * 25;
			party[i].wit = randall;
			
			//instantiate paranoia
			randall = Math.floor(nextRand() * 3);
			bio += bios.paranoia[randall]
			randall = (randall + 1) * 25;
			party[i].paranoia = randall;
			
			party[i].bio = bio;
			
			console.log(JSON.stringify(party[i]));
		}
	}
};	

//<nextscene $scene>>
macros['nextscene'] = {
	handler: function(place, macroname, params, parser) {
		var randSceneIndex = nextRand();
		randSceneIndex = Math.floor(randSceneIndex * scenes.length);
		var sceneObj = scenes[randSceneIndex];
		var timesLooped = 0;
		while (sceneObj.used && timesLooped < scenes.length){
			timesLooped++;
			randSceneIndex++;
			randSceneIndex %= scenes.length;
			sceneObj = scenes[randSceneIndex];
		}
		if (sceneObj.used && timesLooped >= scenes.length){
			state.history[0].variables[params[0].substring(1)] = "Final Encounter";
		} else {
			sceneObj.used = true;
			state.history[0].variables[params[0].substring(1)] = sceneObj.name;
		}
	}
};

//<<nextrand $dest [$low] $high>>
macros['nextrand'] = {
	handler: function(place, macroname, params, parser) {
		var randall = nextRand();
		if (params[2]){
			randall *= params[2] - params[1];
			randall += params[1];
		} else {
			randall *= params[1];
		}
		setVariable(params[0], Math.floor(randall));
	}
};

//<<resetactors>>
macros['resetactors'] = {
	handler: function(place, macroname, params, parser) {
		for (var i = 0; i < party.length; i++) {
			party[i].acted = false;
		}
	}
};

//<<nextactor $dest $trait $low>>
macros['nextactor'] = {
	handler: function(place, macroname, params, parser) {
		var i = 0;
		var trait = params[1];
		var low = params[2];
		for (i = 0; i < party.length; i++){
			if (party[i].acted) continue;
			var isTraitor = traitor == i;
			var traitCheck = party[i][trait];
			if (low){
				if (isTraitor && traitCheck == 75) {
					break;
				} else if (!isTraitor && traitCheck == 25) {
					break;
				}
			} else {
				if (isTraitor && traitCheck == 25) {
					break;
				} else if (!isTraitor && traitCheck == 75){
					break;
				}
			}
		}
		if (i == traitor) console.log("Up to no good...");
		if (i == party.length){
			console.log("Ayy lmao");
			setVariable(params[0], -1);
		} else {				
			console.log(party[i].name);
			party[i].acted = true;
			setVariable(params[0], i);
		}
	}
};

//<<nexttraitor [$dest]>>
macros['nexttraitor'] = {
	handler: function(place, macroName, params, parser) {
		var rando = nextRand();
		rando = Math.floor(rando * party.length);
		while (!party[rando].alive){
			rando++;
			rando %= party.length;
		}
		traitor = rando;
		if (params[0]) setVariable(params[0], traitor);
	}
};

//<<printname $partymember>>
macros['printname'] = {
	handler: function(place, macroName, params, parser) {
		var name;
		var paramscheck = "" + params[0];
		if (paramscheck.charAt(0) == "$"){
			var arg = state.history[0].variables[params[0].substring(1)];
			name = party[arg]["name"];
		} else {
			name = party[params[0]]["name"];
		}
		insertText(place, name);
	}
};

//<<printbio $index>>
macros['printbio'] = {
	handler: function(place, macroName, params, parser) {
		var bio;
		var paramscheck = "" + params[0];
		if (paramscheck.charAt(0) == "$"){
			var arg = state.history[0].variables[params[0].substring(1)];
			bio = party[arg]["bio"];
		} else {
			bio = party[params[0]]["bio"];
		}
		insertText(place, bio);
	}
};

//<<getvalue $destination $member $key>>
macros['getvalue'] = {
	handler: function(place, macroname, params, parser) {
		var member;
		var key;
		var paramscheck = "" + params[1];
		if (paramscheck.charAt(0) == "$"){
			member = getVariable(params[1]);
		} else {
			member = params[1];
		}
		if (member == -1){
			setVariable(params[0], -1);
			return;
		}
		paramscheck = "" + params[2];
		if (paramscheck.charAt(0) == "$"){
			key = getVariable(params[2]);
		} else {
			key = params[2];
		}
		setVariable(params[0], party[member][key]);
	}
};

//<<kill $member>>
macros['kill'] = {
	handler: function(place, macroname, params, parser) {
		var i = getVariable(params[0]);
		party[i].alive = false;
	}
};

//<<incsuspicion $source $dest>>
macros['incsuspicion'] = {
	handler: function(place, macroname, params, parser) {
		party[params[1]].suspicion += party[params[0]].paranoia;
	}
};

//someone else's sound code
(function () {
  "use strict";
  version.extensions['soundMacros'] = {
    major: 1,
    minor: 1,
    revision: 2
  };
  var p = macros['playsound'] = {
    soundtracks: {},
    handler: function (a, b, c, d) {
      var loop = function (m) {
          if (m.loop == undefined) {
            m.loopfn = function () {
              this.play();
            };
            m.addEventListener('ended', m.loopfn, 0);
          } else m.loop = true;
          m.play();
          };
      var s = eval(d.fullArgs());
      if (s) {
        s = s.toString();
        var m = this.soundtracks[s.slice(0, s.lastIndexOf("."))];
        if (m) {
          if (b == "playsound") {
            m.play();
          } else if (b == "loopsound") {
            loop(m);
          } else if (b == "pausesound") {
            m.pause();
          } else if (b == "unloopsound") {
            if (m.loop != undefined) {
              m.loop = false;
            } else if (m.loopfn) {
              m.removeEventListener('ended', m.loopfn);
              delete m.loopfn;
            }
          } else if (b == "stopsound") {
            m.pause();
            m.currentTime = 0;
          } else if (b == "fadeoutsound" || b == "fadeinsound") {
            if (m.interval) clearInterval(m.interval);
            if (b == "fadeinsound") {
              if (m.currentTime>0) return;
              m.volume = 0;
              loop(m);
            } else {
              if (!m.currentTime) return;
              m.play();
            }
            var v = m.volume;
            m.interval = setInterval(function () {
              v = Math.min(1, Math.max(0, v + 0.005 * (b == "fadeinsound" ? 1 : -1)));
              m.volume = Math.easeInOut(v);
              if (v == 0 || v == 1) clearInterval(m.interval);
              if (v == 0) {
                m.pause();
                m.currentTime = 0;
                m.volume = 1;
              }
            }, 10);
          }
        }
      }
    }
  }
  macros['fadeinsound'] = p;
  macros['fadeoutsound'] = p;
  macros['unloopsound'] = p;
  macros['loopsound'] = p;
  macros['pausesound'] = p;
  macros['stopsound'] = p;
  macros['stopallsound'] = {
    handler: function () {
      var s = macros.playsound.soundtracks;
      for (var j in s) {
		if (s.hasOwnProperty(j)) {
          s[j].pause();
          if (s[j].currentTime) {
		    s[j].currentTime = 0;
		  }
		}
      }
    }
  }
  var div = document.getElementById("storeArea").firstChild;
  var fe = ["ogg", "mp3", "wav", "webm"];
  while (div) {
    var b = String.fromCharCode(92);
    var q = '"';
    var re = "['" + q + "]([^" + q + "']*?)" + b + ".(ogg|mp3|wav|webm)['" + q + "]";
    k(new RegExp(re, "gi"));
    div = div.nextSibling;
  }

  function k(c, e) {
    do {
      var d = c.exec(div.innerHTML);
      if (d) {
        var a = new Audio();
        if (a.canPlayType) {
          for (var i = -1; i < fe.length; i += 1) {
            if (i >= 0) d[2] = fe[i];
            if (a.canPlayType("audio/" + d[2])) break;
          }
          if (i < fe.length) {
            a.setAttribute("src", d[1] + "." + d[2]);
            a.interval = null;
            macros.playsound.soundtracks[d[1]] = a;
          } else console.log("Browser can't play '" + d[1] + "'");
        }
      }
    } while (d);
  }
}());