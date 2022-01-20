
function getArray_onHeadersReceived()
{     
    var raw       = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    var chromever = parseInt(raw[2], 10);
    
    // https://developer.chrome.com/docs/extensions/reference/webRequest/
	// Starting from Chrome 72, if you need to modify responses before Cross Origin Read Blocking (CORB) can block the response, you need to specify 'extraHeaders' in opt_extraInfoSpec.
	
    // 如果是72以上版本，必须加入extraHeaders，否则Ajax无法正常抓取
    if (chromever >= 72)
    {
    	return ["blocking", "responseHeaders", "extraHeaders"];
    }

    // 如果是68版本，必须不加入extraHeaders，否则函数会添加失败
   	return ["blocking", "responseHeaders"];
}

chrome.webRequest.onHeadersReceived.addListener(
	function(r_details)
	{
		// AJAX 跨域访问
		let url     = r_details.url;
		let urltype = r_details.type;
		
		if (url.indexOf("github.com") != -1)
		{
			var is_find = false;
			var headers = r_details.responseHeaders;
			for (var i=0;i<headers.length;i++)
			{
				if (headers[i].name.toLowerCase() == "access-control-allow-origin")
				{
					is_find = true;
					headers[i].value = "*";
				}
			}
			
			if (is_find == false)
			    headers.push({name:'access-control-allow-origin', value:'*'});
	
			var blockingResponse = {};
			    blockingResponse.responseHeaders = headers;
			
			return blockingResponse;	
		}

		return {};
	},
{urls: ["*://github.com/*", "*://*.github.com/*"]}, getArray_onHeadersReceived());
