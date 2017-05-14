var x = 0;
function mz_gif(){
	x = (x+1)%27;
	$(".mz").each(function(){
		$(this).attr("src", "/img/mz/mz"+x+".png");
	});
	setTimeout('mz_gif()', 100);
}
$(document).ready(function(){
	if($("img").hasClass("mz"))
		mz_gif();
});