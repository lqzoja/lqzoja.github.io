window.AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
var cssn = 2;
var voicec1 = ["#0ff", "#0f8", "#0f0"];
var times = 0
var lastTime, IID
window.onload = function play(){
	var rand = function () {
		var str = "0123456789ABCDEF";
		return str.charAt(Math.floor(Math.random()*16));
	}
	// setInterval(function(){document.body.style.background = '#'+rand()+rand()+rand()+rand()+rand()+rand();}, 5000)
	var $_ = function(id){
		return document.getElementById(id);
	}
	var canvas = $_('canvas');
	canvas.width = window.innerWidth;
	canvas.height = 250;
	var audio = $_('audio');
	var ctx = canvas.getContext('2d');
	var actx = new AudioContext();
	color = ctx.createLinearGradient(canvas.width*.5, 0, canvas.width*.5, 300);
	color.addColorStop(0, voicec1[0]);
	color.addColorStop(.5, voicec1[1]);
	color.addColorStop(1, voicec1[2]);
	var analyser = actx.createAnalyser();
	var audioSrc = actx.createMediaElementSource(audio);
	audioSrc.connect(analyser);
	analyser.connect(actx.destination);
	var num = 150;
	var singlewidth = 1.*canvas.width/num; 
	function draw(){
		var voicehigh = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(voicehigh);
		var step = Math.round(voicehigh.length*.85/num);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		for(var i = 0; i < num; i++){
			var value = voicehigh[step*i];
			ctx.fillStyle = color;
			ctx.fillRect(i*singlewidth, 250, singlewidth-2, -value);
			// ctx.fillRect(canvas.width*.5-(i-1)*10, 250, 7, -value);
			ctx.fill();
			// ctx.fillStyle = colort;
			// ctx.fillRect(i*10+canvas.width*.5, 250, 7, value+1);
			// ctx.fillRect(canvas.width*.5-(i-1)*10, 250, 7, value+1);
		}
		requestAnimationFrame(draw);
	}
	draw();
	var boom = function () {
		$('#tit').animate({fontSize: '4em'}, 50, function () {
			$('#tit').animate({fontSize: '3em'}, 500);
		})
	}
	document.body.onkeydown = function () {
		if(++times == 1){
			lastTime = new Date().getTime()
		}
		if(times == 10){
			IID = setInterval(boom, ((new Date().getTime())-lastTime)/9-3)
		}
		if(times == 11){
			times = 0
			clearInterval(IID);
		}
		if(times)boom();
		// alert('down');
	}
}