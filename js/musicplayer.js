window.AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
var cssn = 2;
var voicec1 = ["#0f0", "#f00", "#f0f"];
function cgcolor(){
	  voicec1[0] = document.getElementById('startc').value;
	  voicec1[1] = document.getElementById('startc').value;
	  voicec1[2] = document.getElementById('startc').value;
}
window.onload = function play(){
	var $ = function(id){
		return document.getElementById(id);
	}
	var canvas = $('canvas');
	var audio = $('audio');
	var ctr = $('ctr');
	var ctx = canvas.getContext('2d');
	var actx = new AudioContext();
	color = ctx.createLinearGradient(canvas.width*.5, 0, canvas.width*.5, 300);
	color.addColorStop(0, voicec1[0]);
	color.addColorStop(.5, voicec1[1]);
	color.addColorStop(1, voicec1[2]);
	colort = ctx.createLinearGradient(canvas.width*.5, 300, canvas.width*.5, 600);
	colort.addColorStop(0, "rgba(125,225,133,0.7)");
	colort.addColorStop(.5, "rgba(225,225,0,0.1)");
	colort.addColorStop(1, "rgba(125,0,133,0)");
	canvas.width = window.innerWidth-5;
	canvas.height = window.innerHeight*.7;
	var analyser = actx.createAnalyser();
	var audioSrc = actx.createMediaElementSource(audio);
	audioSrc.connect(analyser);
	analyser.connect(actx.destination);
	var num = 80;
	function draw(){
		var voicehigh = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(voicehigh);
		var step = Math.round(voicehigh.length/num);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		for(var i = 1; i < num; i++){
			var value = voicehigh[step*i];
			ctx.fillStyle = color;
			ctx.fillRect(i*10+canvas.width*.5, 250, 7, -value+1);
			ctx.fillRect(canvas.width*.5-(i-1)*10, 250, 7, -value+1);
			ctx.fill();
			ctx.fillStyle = colort;
			ctx.fillRect(i*10+canvas.width*.5, 250, 7, value+1);
			ctx.fillRect(canvas.width*.5-(i-1)*10, 250, 7, value+1);
		}
		requestAnimationFrame(draw);
	}
	draw();
}