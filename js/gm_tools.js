function messages(msgs) {
	output = [];
	for(i in msgs) {
		for(var j=0,len=msgs[i].length; j<len; j++) {
			output[output.length] = '<div class="'+ i +'_message">'+ msgs[i][j] +'</div>';
		}
	}
	$id("messages").innerHTML = output.join("");
}

function rand(i,j) {
	var max,min;
	if(typeof j != "undefined") {
		max = j;
		min = i;
	} else if(typeof i != "undefined") {
		max = i;
		min = 1;
	}
	return Math.floor((Math.random() * ((max + 1) - min)) + min);
}

function series(arr) {
	var output = [];
	if(typeof arr == "undefined") { return false; }
	for(var i=0,len=arr.length; i<len; i++) {
		output[output.length] = arr[i][rand(0,arr[i].length - 1)];
	}
	return output;
}



var Container = function(data,options) {
	var o = {};
	var options = options || {};
	o.type = options.type || 'general';
	o.data = data || [];
	o.count = options.count || 1;
	o.min = 1;
	o.max = 1;
	o.duplicates = options.duplicates || false;
	o.data_length = (typeof data.length != "undefined" ? data.length : Object.keys(data).length);
	o.range = options.range || o.data_length;
	if(typeof o.range == "string" && o.range.indexOf("-") != -1) {
		var pieces = o.range.split("-")
		o.min = parseInt(pieces[0]);
		o.max = parseInt(pieces[1]);
		if(o.max == "NaN" || o.max > o.data_length) {
			o.max = o.data_length;
		}
	} else if(o.range) {
		o.max = (o.range > o.data_length ? o.data_length : o.range);
	}
	if(o.type == "percentage") {
		sum = 0;
		for(k in data) {
			sum += data[k]
		}
		if(sum != 100) {
			console.log("Sum of percentages much equal 100 - your sum: "+ sum)
			return false;
		}
	}
	if(o.duplicates == false && o.count > o.data_length) {
		console.log("Your count of "+ o.count +" cannot be larger than the data count: "+ o.data_length)
		return false;
	}
	return o;
};


// x = validate_list()
// ContainerParse([x]). // <-- Note the array being sent

var ContainerParse = function(arr) {
	var output = [];
	var local,min,dups,val;
	if(typeof arr == "undefined") { return false; }
	if(!arr.length) { return false; }
	console.log("X?")
	for(var i=0,len=arr.length; i<len; i++) {
		a = arr[i]
		local = [];
		dups = {};
		if(a.type == "general") {
			min = 0;
			while(min++ < a.count) {
				val = a.data[rand(a.min, a.max) - 1];
				if(dups) {
					local[local.length] = val;
				} else {
					if(!dups[val]) {
						local[local.length] = val;	
						dups[val] = 1;
					} else {
						min--;
					}					
				}
			}
			
		} else if(a.type == "series") {
			min = 0;
			while(min++ < a.count) {
				val = recursive_options(a.data);
				if(!dups[val]) {
					local[local.length] = val;	
					dups[val] = 1;
				} else {
					min--;
				}	
			}

		} else if(a.type == "percentage") {
			for(var j=0; j<a.count; j++) {
				val = percentage(a.data);
				console.log("Val: "+ val +" - count: "+ j)
				if(!dups[val]) {
					local[local.length] = val;	
					dups[val] = 1;
				} else {
					j--;
				}	
			}

		} else {
			local = [a[rand(0,a.length - 1)]];	
		}
		output[output.length] = local;
	}

	function percentage(arr) {
		var sorted = [];
		var num,sum;
		for (var k in arr) { sorted.push([k, arr[k]]) }
		sorted.sort(function(a, b) { return a[1] - b[1] });
		num = rand(100);
		sum = 0;
		console.log(num)
		console.log(sorted)
		for(var i=0,len=sorted.length; i<len; i++) {
			sum += sorted[i][1];
			if(num < sum) {
				return sorted[i][0];
			}
		}
		return false;
	}

	function recursive_options(o,out) {
		var out = out || [];
		var keys = Object.keys(o);
		key = keys[rand(keys.length) - 1];
		out[out.length] = key;
		if(typeof o[key] == "object") {
			out = recursive_options(o[key],out);
		} else {
			out[out.length] = o[key];
		}
		return out;
	}


	return output;
};

function situtional_series(roll,arr) {
	
}




var names = [
	"Abaet"
	,"Abarden"
	,"Aboloft"
	,"Acamen"
	,"Achard"
	,"Ackmard"
	,"Adeen"
	,"Aerden"
	,"Afflon"
	,"Aghon"
	,"Agnar"
	,"Ahalfar"
	,"Ahburn"
	,"Ahdun"
	,"Aidan"
	,"Airen"
	,"Airis"
	,"Albright"
	,"Aldaren"
	,"Alderman"
	,"Aldren"
	,"Alkirk"
	,"Allso"
	,"Amerdan"
];

var sex = ["male","female","unknown"];

var plots = [
	"Any Old Port in a Storm"
	,"Better Late Than Never"
	,"Breaking and Entering"
	,"Capture the Flag"
	,"Clearing the Hex"
];

var fumbles = {
	"melee": {
		"Distracted": "Enemy roll against you at advantage until next turn" // 1
		,"Clumsy": "Drop Weapon, STR (DC 12) or drop weapon" // 2
		,"Klutz": "Trip, DEX (DC 12) or fall prone" // 3
		,"Wild Miss": "Massive swing unbalances you - Switch places with target" // 4
		,"Hesitation": "You miss your turn" // 5
		,"Slippery Footwork": "You step on your own feet and move to an adjacent available square" // 6
		,"Tangled Weapons": "STR (DC 12) for both you AND enemy to drop weapon or shield" // 7
		,"Hit Yourself": "Half Damage to yourself (no modifiers)" // 8
		,"Adrenaline Rush": "Hit an ally if adjacent" // 9
		,"Big Opening": "Enemy rolls at advantage to grapple against you" // 10
		,"Pinned": "Lose any movement actions left" // 11
		,"Intimidated": "CHA (DC 12) or do half damage on next attack (if successful)" // 12
		,"Terrible Defense": "Enemy gets oportunity attack against you" // 13
		,"Off Balance": "DEX (DC 12) or miss next attack" // 14
		,"Bad Placement": "Ranged allies roll at disadvantage to your opponent" // 15
		,"Focused": "No attack of opportunities until next round" // 16
		,"Second Guess": "Wis (DC 12) " // 17
		,"Instinct": "Next successful attack against you half damage, but you dive away and are prone" // 18
		,"Obvious": "Enemy can move away without triggering an opportunity attack from you" // 19
		,"Recovery": "Nothing bad happened" // 20
	}
}

var fractions = {
	"quarter": 25
	,"eight-2": 13
	,"half": 50
	,"eight-1": 12
}


// one,a,1
// one,b
// one,c
// two,z
// three,p
// three,l
// three,m
// two,j
			

// function combine_many_to_one() {
// 	var output = {};
// 	var pieces,key,val,tmp;
// 	var pieces_nl = $id('inputs').value.trim().split("\n");
// 	console.log(pieces_nl)
// 	for(var i=0, len=pieces_nl.length; i<len; i++) {
// 		// parse Titles
// 		if(i == 0) {

// 		}
// 		pieces = pieces_nl[i].split(",");
// 		tmp = output;
// 		for(var j=0, len2=pieces.length - 1; j<len2; j++) {
// 			key = pieces[j].trim().toLowerCase();
// 			if(typeof pieces[j+1] == "undefined") {
// 				output[key] = pieces[j+1].trim();
// 			} else if(typeof output[key] == "undefined") {
// 				output[key] = {};
// 			}
// 			if(j > 0 && typeof output[pieces[j-1]] != "object") {
// 				output[pieces[j-1]] = {};
// 				output[pieces[j-1]][key] = val;
// 			} else {
// 				output[key] = output[key][val];
// 			}
// 		}
// 		console.log(output);
// 	}
// }


function validate_list() {
	var msgs = {}
	var output = {}
	var pieces = $id('inputs').value.trim().split("\n");
	var hund_perc = 0;
	var end_with_nums = 0;
	var line_pieces, num;
	for(var i=0, len=pieces.length; i<len; i++) {
		line_pieces = pieces[i].split(',');
		num = 0;
		if(line_pieces.length > 1 && is_numeric(line_pieces[line_pieces.length - 1])) {
			end_with_nums += 1;
			hund_perc += parseFloat(line_pieces[line_pieces.length - 1]);
			num = parseFloat(line_pieces[line_pieces.length - 1])
		}
		line_pieces.pop();
		output[line_pieces.join(',')] = num;
	}
	console.log(output)
	if(end_with_nums > (len/2)) {
		if(hund_perc < 99.0 || hund_perc > 101.0) {
			messages({error: ["ERROR! Percentages don't match up"]});
			return;
		} else {
			messages({info: ["Making Container"]});
			return Container(output,{type:"percentage"})
		}
	}
	console.log(hund_perc)
	return Container(Object.keys(output))
}

function is_numeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}