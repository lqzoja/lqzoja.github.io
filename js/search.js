// Copy form https://github.com/PaicHyperionDev/hexo-generator-search
// I fixed lots of bugs ......
// Who can tell me who wrote this f**king code???
// Now there will not be any bugs... If you find out one, please tell me.
// it need jquery
// path       -> search.xml 的位置
// search_id  -> 搜索输入的 文本框 的 id
// content_id -> 搜索输出的 div 的 id
// regex_id   -> 是否正则表达式的 checkbox 的 id
// search_id  -> 是否忽略大小写的 checkbox 的 id
// 这个再出问题我就去吃 htr 了！
var searchFunc = function(path, search_id, content_id, regex_id, case_id) {
	'use strict';
	document.getElementById(content_id).innerHTML = '<p class="search-failed">Preloading ...</p>'
	var randomString = function () {
		return String.fromCharCode(Math.floor(Math.random()*10000)+545155) 
	}
	function htmlEncode (value) {
		return $('<div/>').text(value).html();
	}
	function htmlDecode (value) {
		return $('<div/>').html(value).text();
	}
	var fuck = randomString();
	$.ajax({
		url: path,
		dataType: "xml",
		success: function( xmlResponse ) {
			// get the contents from search data
			var datas = $( "entry", xmlResponse ).map(function() {
				return {
					title: $("title", this).text(),
					content: $("content", this).text(),
					url: $("url", this).text()
				};
			}).get();

			var $input = document.getElementById(search_id);
			var $regex = document.getElementById(regex_id);
			var $case = document.getElementById(case_id)
			if (!$input || !$regex || !$case) return;
			var $resultContent = document.getElementById(content_id);
			var $fun = function(){
				var str = '<ul class="search-result-list">';                
				var keywords = $regex.checked
					? [$input.value.trim()]
					: ($case.checked
						? $input.value.trim().toLowerCase()
						: $input.value.trim()).split(/[\s\-]+/);
				if ($input.value.trim().length <= 0)
					return $resultContent.innerHTML = '';
				if ($regex.checked)
					try {
						var k = new RegExp(keywords[0]);
						if (k.test(''))
							return $resultContent.innerHTML = '<p class="search-failed">Everything is Matched</p>';
					} catch (e) {
						return $resultContent.innerHTML = '<p class="search-failed">Regular Was Wrong</p>';
					}
				$resultContent.innerHTML = "";
				var flag = 0;
				// perform local searching
				datas.forEach(function(data) {
					var isMatch = true;
					var content_index = [];                                                       
					if (!data.title || data.title.trim() === '') {
						data.title = "Untitled";
					}
					var data_title = $case.checked
						? data.title.trim().toLowerCase()
						: data.title.trim();     
					var data_content = $case.checked
						? data.content.trim().replace(/<[^>]+>/g,"").toLowerCase()
						: data.content.trim().replace(/<[^>]+>/g,"");
					data_title = htmlDecode(data_title);
					data_content = htmlDecode(data_content);
					var data_url = data.url;
					var index_title = -1;
					var index_content = -1;
					var first_occur = -1;
					// only match artiles with not empty contents
					if (data_content !== '') {
						keywords.forEach(function(keyword, i) {
							if ($regex.checked) {
								var reg = new RegExp(keyword, $case.checked ? 'i' : '');
								index_title = (data_title.match(reg) || {index:-1}).index;
								index_content = (data_content.match(reg) || {index:-1}).index;
							} else {
								index_title = data_title.indexOf(keyword);
								index_content = data_content.indexOf(keyword);
							}

							if( index_title < 0 && index_content < 0 ){
								isMatch = false;
							} else {
								if (index_content < 0) {
									index_content = 0;
								}
								if (i == 0) {
									first_occur = index_content;
								}
								// content_index.push({index_content:index_content, keyword_len:keyword_len});
							}
						});
					} else {
						isMatch = false;
					}
					// show search results
					if (isMatch) {
						flag = 1;
						str += '<li><a href="' + data_url + '">';
						var content = data_content;
						if (first_occur >= 0) {
							// cut out 100 characters
							var start = first_occur - 20;
							var end = first_occur + 80;

							if(start < 0){
								start = 0;
							}

							if(start == 0){
								end = 100;
							}

							if(end > content.length){
								end = content.length;
							}

							var match_content = content.substr(start, end); 

							// highlight all keywords
							keywords.forEach(function(keyword){
								if ($regex.checked) {
									match_content = htmlEncode(match_content);
									data_title = htmlEncode(data_title)
									keyword = htmlEncode(keyword).replace(/&[^;]*;/g, (s) => '('+s+')');
									var regS = new RegExp(keyword, $case.checked ? "gi" : "g");
									match_content = match_content.replace(regS,
										(s) => '<span class="search-keyword">'+s+'</span>');
									data_title = data_title.replace(regS,
										(s) => '<span class="search-keyword">'+s+'</span>');
								} else {
									while (fuck.indexOf(keyword) > 0 || match_content.indexOf(fuck) > 0
											|| data_title.indexOf(fuck) > 0)
										fuck = randomString();
									while (match_content.indexOf(keyword) > -1)
										match_content = match_content.replace(keyword, fuck);
									while (data_title.indexOf(keyword) > -1)
										data_title = data_title.replace(keyword, fuck);
									data_title = htmlEncode(data_title);
									match_content = htmlEncode(match_content);
									while (match_content.indexOf(fuck) > -1)
										match_content = match_content.replace(fuck,
											'<span class="search-keyword">'+htmlEncode(keyword)+'</span>');
									while (data_title.indexOf(fuck) > -1)
										data_title = data_title.replace(fuck,
											'<span class="search-keyword">'+htmlEncode(keyword)+'</span>');
								}
							});
							str += '<p class="search-result-title">'+ data_title +'</p>'
							str += '<p class="search-result">' + match_content +'...</p>'
						}
						str += "</a></li>";
					}
				});
				str += "</ul>";
				$resultContent.innerHTML = flag ? str : '<p class="search-failed">Nothing Matched</p>';
			}
			$input.addEventListener('input', $fun);
			$regex.addEventListener('click', $fun);
			$case.addEventListener('click', $fun);
			$resultContent.innerHTML = '';
			if ($input.value) $fun();
		}
	});
}
