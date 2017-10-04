window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var cssn = 2,
	voicec1 = ["#0ff", "#0f8", "#0f0"],
	times = 0, lastTime, IID, zj
window.onload = function play(){
	var $_ = function(id){
		return document.getElementById(id);
	}
	$('#bg-shack').click(function () {
		this.checked
			? $('#img').addClass('ShakeAndBorder')
			: $('#img').removeClass('ShakeAndBorder')
	})
	$('#tit-show').click(function () {
		this.checked
			? $('#tit').fadeIn(1000)
			: $('#tit').fadeOut(1000)
	})
	$('#img-bg').click(function () {
		this.checked
			? insertImage(zj)
			: insertImage(DEFAULT_IMG)
	})
	$('#play').click(function(e) {
		var file = $_('file').files[0],
			reader = new FileReader();
		if(file == null) return;
		$('#cos').hide(500);
		$('#tit').focus();
		$('#tit').html(file.name.replace(/\.\w+$/, ''));
		var url = URL.createObjectURL(file);
		$_("audio").src = url;
		$_("audio").onerror = function () {
			msg('播放音频失败<3', 'red');
		}
		msg('开始播放'+$('#tit').html());
		reader.onloadend = function(e) {
			var result = this.result;
			if(result.slice(0, 3) === 'ID3') {
				var imgdata = getApic(result);
				if(typeof imgdata === 'string'){
					zj = 'data:image/jpeg;base64,' + btoa(imgdata);
					if($_('img-bg').checked) insertImage(zj)
					msg('图片加载成功！<3')
				}
			} else {
				msg('未能找到ID3 <3', 'red');
				insertImage(DEFAULT_IMG);
				return false;
			}
		};
		reader.readAsBinaryString(file);
	});
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
		if(event.which == 13)
			return $('#cos').toggle(500);
		if(event.which == 32){
			if(++times == 1){
				lastTime = new Date().getTime()
			}
			if(times == 10){
				msg('自动打节奏已开启^_^')
				IID = setInterval(boom, ((new Date().getTime())-lastTime)/9-3)
			}
			if(times == 11){
				msg('自动打节奏已关闭>_<', 'orange')
				times = 0
				clearInterval(IID);
			}
			if(times)boom();
		}
		// alert('down');
	}
	audio.onended = function () {
		msg('If you like this player, you can press Ctrl+S to save it.')
		$('#cos').show('slow');
	}
	setTimeout(function () {
		msg('按节奏敲十下空格有惊喜哦', '#66ccff')
	}, 20000)
}