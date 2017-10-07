// A local search script with the help of [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
// Copyright (C) 2015 
// Joseph Pan <http://github.com/wzpan>
// Shuhao Mao <http://github.com/maoshuhao>
// This library is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 2.1 of the
// License, or (at your option) any later version.
// 
// This library is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
// 
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
// 02110-1301 USA
// 

var searchFunc = function(path, search_id, content_id, regex_id) {
	'use strict';
	document.getElementById(content_id).innerHTML = '<p class="search-failed">Preloading ...</p>'
	$.ajax({
		url: path,
		dataType: "xml",
		success: function( xmlResponse ) {
			// get the contents from search data
			var datas = $( "entry", xmlResponse ).map(function() {
				return {
					title: $( "title", this ).text(),
					content: $("content",this).text(),
					url: $( "url" , this).text()
				};
			}).get();

			var $input = document.getElementById(search_id);
			var $regex = document.getElementById(regex_id);
			if (!$input || !$regex) return;
			var $resultContent = document.getElementById(content_id);
			var $fun = function(){
				var str = '<ul class=\"search-result-list\">';                
				var keywords = $regex.checked ? [$input.value] : $input.value.trim().toLowerCase().split(/[\s\-]+/);
				if ($regex.checked) {
					try {
						var k = new RegExp(keywords[0]);
					} catch (e) {
						return $resultContent.innerHTML = '<p class="search-failed">Regex Was Wrong</p>';
					}
				}
				$resultContent.innerHTML = "";
				if ($input.value.trim().length <= 0) {
					return;
				}
				var flag = 0;
				// perform local searching
				datas.forEach(function(data) {
					var isMatch = true;
					var content_index = [];                                                       
					if (!data.title || data.title.trim() === '') {
						data.title = "Untitled";
					}
					var data_title = data.title.trim().toLowerCase();     
					var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
					var data_url = data.url;
					var index_title = -1;
					var index_content = -1;
					var first_occur = -1;
					// only match artiles with not empty contents
					if (data_content !== '') {
						keywords.forEach(function(keyword, i) {
							if ($regex.checked) {
								var reg = new RegExp(keyword, 'i');
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
						str += "<li><a href=" + data_url + ">";
						var content = data.content.trim().replace(/<[^>]+>/g,"");
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
								var regS = new RegExp(keyword, "gi");
								match_content = match_content.replace($regex.checked ? regS : keyword, (s) => s ? "<span class=\"search-keyword\">"+s+"</span>" : "");
								data_title = data_title.replace($regex.checked ? regS : keyword, (s) => s ? "<span class=\"search-keyword\">"+s+"</span>" : "");
							});
							str += "<p class='search-result-title'>"+ data_title +"</p>"
							str += "<p class=\"search-result\">" + match_content +"...</p>"
						}
						str += "</a></li>";
					}
				});
				str += "</ul>";
				$resultContent.innerHTML = flag ? str : "<p class='search-failed'>Nothing Matched</p>";
			}
			$input.addEventListener('input', $fun);
			$regex.addEventListener('click', $fun);
			$resultContent.innerHTML = '';
			if ($input.value)
				$fun();
		}
	});
}