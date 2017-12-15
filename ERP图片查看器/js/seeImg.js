(function ($) {
    $.fn.extend({
        "photoSeeAll": function (options) {
        	//由于项目就是单页面的应用，所以在此，我就不用处理遍历问题了
			var isFirefox = navigator.userAgent.indexOf("Firefox") > -1 ;
			var MOUSEWHEEL_EVENT = isFirefox ? "DOMMouseScroll" : "mousewheel";
            var defaluts = {
            	//图片缩放倍率
            	ratio: 1.5,
            	//动态添加的模板
            	template :{
            		IMAGE: "<img ondragstart='return false;' style='position: absolute; top: 0; left: 0;' src='"+ options.src +"' />"
            	}
            	
            }
            var opts = $.extend({}, defaluts, options);
            // 动态的添加到iframe里面
            $('.photoSee').append(opts.template.IMAGE);
            
            //在这里区别pc端和移动端
            var CLIKC;
			if("ontouchend" in document) CLIKC = "touchstrat";
			else CLIKC = "click";
            //iframe里面的进行关闭操作
            $("#X > i").on(CLIKC,function(){
            	var _parent =  window.parent || window.top, // window.self,window.top,window.parent的区别
				_jg = _parent.document.getElementById("seeMore");
				$(_jg).remove();
            })
            
//          此时图片的属性如下opts.width, opts.height, opts.src
//          先获取window的宽高
			var wW = window.innerWidth,
				wH=window.innerHeight,
				$img = $('img'),
				$imgR = opts.width/opts.height,// 用到原始图片的宽高比例
				$left,$top,$width,$height;
            function resetInit(){
            	var minWidth = Math.min(wW, opts.width);
            	var maxWidth = Math.max(wW, opts.width);
            	
            	if(wW > opts.width){
            		
            	}else{
            		$img.width(minWidth);
            	}
            	
        		$img.css({'left': (wW-opts.width)/2, 'top': (wH-opts.height)/2})
            }
            resetInit();
            
            

        }
    });
    //默认参数
    var defaluts = {
        foreground: 'red',
        background: 'yellow'
    };
    
    $.extend({
    	
		viewerSee : function(obj){
			//低版本的浏览器
			if( !window.applicationCache ){
				alert("抱歉您的浏览器版本太低,请更换高版本浏览器或切换到高速模式,建议使用火狐浏览器或者谷歌chrome浏览器");
				return;}
			//判断图片路径的正确
			var thisImg = $(obj),
				thisImgSrc = $(obj)[0].src;
			if(!thisImgSrc){ 
				alert('您图片的路径不正确，请检查');
				return;}
			//获取图片的原始大小
			var natureWidth,natureHeight;
			natureWidth = thisImg[0].naturalWidth;
			natureHeight = thisImg[0].naturalHeight;
			//浏览器可视区的大小
//			var oLW = document.documentElement.clientWidth;
//			var oLH = document.documentElement.clientHeight;
			var oLW = window.innerWidth, //为什么没用document.documentElement.clientWidth呢，因为这个会包含滚动条
				oLH = window.innerHeight;
				
			//讲图片的信息存到localStorage
			localStorage["getImgId"] = JSON.stringify({
				'width'  : natureWidth,
				'height' : natureHeight,
				'src'    : thisImgSrc
			})
			
			var _parent =  window.parent || window.top, // window.self,window.top,window.parent的区别
				_jg = _parent.document.getElementById("seeMore");
			$(_jg).remove();
			//调出iframe去显示图片的大小
			$("<iframe></iframe").appendTo("body")
			.attr("id", "seeMore")
			.attr("src", "extendSeeImg/photoSee.html")
			.css({
				position : "fixed",
				left : 0,
				top : 0,
				width : oLW,
				height : oLH,
				overflow : 'hidden',
				zIndex : Math.pow(10,20),
				'border-radius': '4px'
			});
		},
		initViewerSee : function(){
        	var getImgId = JSON.parse(localStorage["getImgId"]);
			$(".photoSee").photoSeeAll(getImgId);
		}
	})
    
})(jQuery);