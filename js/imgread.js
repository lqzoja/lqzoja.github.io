var DEFAULT_IMG = '/img/pic0.jpg'
function msg(massage, color) {
	var p = $('<div/>').appendTo($('#msg-box'));
	p.addClass('msg-text');
	p.html(massage);
	p.show(500);
	if(typeof color === 'string')
		p.css('background-color', color)
	setTimeout(function () {
		p.hide(500, function () {
			p.remove()
		})
	}, 3000)
}
function getFrameSize (str) {
	if(typeof str === 'string' && str.length === 4) {
		var total = str.charCodeAt(0)*0x100000000
				  + str.charCodeAt(1)*0x10000
				  + str.charCodeAt(2)*0x100
				  + str.charCodeAt(3);
		return total;
	} else {
		msg('获取图片大小时出了点问题<3', 'red')
		return 0;
	}
}
function insertImage(a) {
	var img = $('#img');
	img[0].src = a;
	setTimeout(function () {
		if(window.innerWidth/window.innerHeight < img.width()/img.height())
			img.height(window.innerHeight+10),
			img.css('left', (window.innerWidth-img.width())/2),
			img.css('top', -5);
		else
			img.width(window.innerWidth+10),
			img.css('top', (window.innerHeight-img.height())/2),
			img.css('left', -3);
	}, 10)
	img[0].onerror = function () {
		msg('骗你的，图片加载失败了<3', 'red');
		if(a !== DEFAULT_IMG)
			insertImage(DEFAULT_IMG);
	}
	return false;
}
function getApic(result) {
	var index = result.indexOf('APIC');

	if(index < 0) {
		alert('没有专辑图像<3', 'red');
		insertImage(DEFAULT_IMG)
		return false;
	}

	var picsize = getFrameSize(result.substr(index+4, 4)),
		pic1 = result.substr(index+10 , picsize),
		pic2 = pic1.slice(pic1.indexOf('\xff\xd8'));

	return pic2;
}