$(function(J) {
	"use strict";
	var fileUpoader = $('#file');

	fileUpoader.on('change', function(e) {
		var file = this.files[0],
			reader = new FileReader();
		if(file == null) return;
		$('#tit').html(file.name.replace(/\.\w+$/, ''));
		var url = URL.createObjectURL(file);
		$("#audio")[0].src = url;

		reader.onloadend = function(e) {
			var result = this.result;
			
			if(result.slice(0,3) === 'ID3') {
				var imgdata = getApic(result);
				typeof imgdata === 'string' && insertImage(btoa(imgdata));
			} else {
				alert('Error???');
			}
		};

		reader.readAsBinaryString(file);
	});
	function getTagSize (str) {
		if(typeof str === 'string' && str.length === 4) {
			var total = (str.charCodeAt(0)&0x7f)*0x200000 
					  + (str.charCodeAt(1)&0x7f)*0x400
					  + (str.charCodeAt(2)&0x7f)*0x80
					  + (str.charCodeAt(3)&0x7f);
				return total;
		} else {
			throw Error('鍙傛暟閿欒!');
		}
	}
	function getFrameSize (str) {
		if(typeof str === 'string' && str.length === 4) {
			var total = str.charCodeAt(0)*0x100000000
			+ str.charCodeAt(1)*0x10000
			+ str.charCodeAt(2)*0x100
			+ str.charCodeAt(3);
			return total;
		
		} else {
			throw Error('鍙傛暟閿欒锛�');
		}
	}
	var Frames = {
		'TPE1' :'浣滆€�',
		'TIT2' :'鏍囬',
		'TYER' :'骞翠唬',
		'APIC' :'涓撹緫鍥剧墖',
		'TALB' :'涓撹緫'
	};
	function insertImage(a) {
		var img = $('#img');
		img[0].src = 'data:image/jpeg;base64,' + a;
		setTimeout(function () {
			img.css('top', (window.innerHeight-img.height())/2)
			img.css('left', (window.innerWidth-img.width())/2)
		}, 10);
	}
	function getApic(result) {
		var index = result.indexOf('APIC');
		
		if(index < 0) {
			alert('鎵句笉鍒颁笓杈戝浘鐗�');
			return false;
		}
		var picsize = getFrameSize(result.substr(index+4, 4)),
			pic1 = result.substr(index+10 , picsize),
			pic2 = pic1.slice(pic1.indexOf('\xff\xd8'));
			
		return pic2;
	}
	function eachStr(a) {
		J.each(a.split(''), function(i, e){
			console.log('绗�%d涓瓧绗�%s, 缂栫爜涓�%d', i, e, e.charCodeAt(0));
		});
	}
});