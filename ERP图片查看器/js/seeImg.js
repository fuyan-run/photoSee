(function ($) {
    $.fn.extend({
        "photoSeeAll": function (options) {
        	
            var defaluts = {
            	//图片缩放倍率
            	ratio: 0.2,
            	//动态添加的模板
            	template :{
            		IMAGE: "<img id='img' ondragstart='return false;' style='position: absolute; top: 0; left: 0;' src='"+ options.src +"' />"
            	},
            	//showTip的显示timer定时器
            	showTimer : null
            	
            }
            var opts = $.extend({}, defaluts, options);
            // 动态的添加到iframe里面
            $('.photoSee').append(opts.template.IMAGE);
            
            //iframe里面的进行关闭操作
            $("#X > i").on("click",function(){
            	var _parent =  window.parent || window.top, // window.self,window.top,window.parent的区别
				_jg = _parent.document.getElementById("seeMore");
				$(_jg).remove();
            })
            
//          此时图片的属性如下opts.width, opts.height, opts.src
//          先获取window的宽高
			var wW = window.innerWidth,
				wH=window.innerHeight,
				$img = $('#img'),
				$imgR = opts.width/opts.height,// 用到原始图片的宽高比例
				$left,$top,$width,$height;
			
			//判断初始化屏幕和图片的位置
            function resetInit(){
            	$width = opts.width,
            	$height = opts.height;
            	// 无论是图片到底多大,先处理宽，再处理高
            	if(wW < $width){
            		$width = wW;
            		$height = $width/$imgR;
            	}
        		if(wH < $height){ //宽度已经处理，待处理高度
					$height = wH;
					$width = $height*$imgR;
            	}
            	$width-=20;
            	$height-=20;
            	
        		$img.css({'height':Math.floor($height),'width':Math.floor($width), 'left': Math.floor((wW-$width)/2), 'top': Math.floor((wH-$height)/2)})
            }
            resetInit();//demodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemo
            
            //设置图片位置
		  	function setImagePosition(){
		  		var w = $width,
		  	    	h = $height,
		  	    	left = (wW - w)/2,
					top = (wH - h)/2;
	  			$img.css({'width': w,'height': h, "left": left, "top": top});
		  	}
		  	//显示图片比例
		  	function showTip(num){
		  		var tip = $('#showTip');
		  		tip.text(""+ num +"").fadeIn();
		  		clearTimeout(opts.showTimer);
		  		opts.showTimer = setTimeout(function(){
		  			tip.fadeOut();
		  		}, 1000)
		  	}
		  	
            //由于是兼容移动端和pc端，所以这里要判断是不是移动端
            if('ontouchstart' in window){
				var downX,downY, dragFlag,oldLeft,oldTop;
            	//构造函数PhoneScale
            	function PhoneScale(obj){
            		this.dragFlag = false;
            		this.firstPint = null;
            		this.secondPint = null;
            		this.scale = 0;
            		this.newW = 0;
            		this.newH = 0;
            		this.defaluts = {
            			el: null,
            			startFn: null,
            			endFn: null,
            			moveFn: null,
            		}
            		this.opt = $.extend(this.defaluts, obj);
            		this.oInit();
            	}
            	PhoneScale.prototype.oInit = function(){
            		var _this = this;
            		if(!this.opt.el){ alert('没有挂载点'); return;}
            		this.Move(_this);
            	}
            	PhoneScale.prototype.Move = function(obj){
            		var _this = this;
            		function getDistance(p1, p2) {
					    var x = p2.pageX - p1.pageX,
					        y = p2.pageY - p1.pageY;
					    return Math.sqrt((x * x) + (y * y));
					};
            		document.addEventListener('touchstart',function(e){
            			if(e.touches.length>=2){
            				_this.firstPoint = e.touches;
            				_this.dragFlag = true;
            			}else{
            				downX = e.touches[0].pageX,
							downY = e.touches[0].pageY,
							oldLeft = $img.position().left,
							oldTop = $img.position().top,
							imgW = $img.width(),
							imgH = $img.height();
							dragFlag = true;
            			}
				        obj.opt.startFn&&obj.opt.startFn();
            		})
            		document.addEventListener("touchmove",function(e){
				        e.preventDefault();
				        if(e.touches.length>=2&&_this.dragFlag){
				            _this.secondPint = e.touches;
				            //缩放比例根据两手指的距离判断
				            var scale = getDistance(_this.secondPint[0],_this.secondPint[1])/getDistance(_this.firstPoint[0],_this.firstPoint[1]);
				            _this.scale = scale;
				            _this.newW = $width*_this.scale;
				            _this.newH = _this.newW/$imgR;
				            
				            // 重新定义图片的大小
	  						$img.css({'width': _this.newW,'height': _this.newH});
	  							  						
				        }else{
				        	if(dragFlag){
								var moveX = e.touches[0].pageX,
									moveY = e.touches[0].pageY,
									newLeft = moveX - downX + oldLeft,
									newTop = moveY - downY + oldTop;
									
								$img.css({'left': newLeft});
								$img.css({'top': newTop})
							}
				        }
				        _this.opt.moveFn&&_this.opt.moveFn();
				    },false);
				    document.addEventListener("touchend",function(e){
				        if(_this.dragFlag){
				        	$height = _this.newH;
				        	$width = _this.newW;
				        	if(wH > $height&&wW > $width){
				        		setImagePosition();
				        	}
				        	showTip(parseInt($width/opts.width*100)+'%');
				            _this.dragFlag=false;
							dragFlag = false;
				        };
				        _this.opt.endFn&&_this.opt.endFn();
				    },false);
            	}
            	var a = new PhoneScale({
            		el: $img,
            		startFn: function(){
            			//console.log('开始准备');
            		},
            		moveFn: function(){
            			//console.log('移动中');
            		},
            	})
            	
            	
            }else{
	            //编写pc端图片滚轮事件
				var isFirefox = navigator.userAgent.indexOf("Firefox") > -1 ;
				var MOUSEWHEEL_EVENT = isFirefox ? "DOMMouseScroll" : "mousewheel";
				document.addEventListener(MOUSEWHEEL_EVENT, function(e){
					mouseWheelScroll(e);
				}, false);
				function mouseWheelScroll(e){
					var _delta = parseInt(e.wheelDelta || -e.detail);
			    	//向上滚动
			  		if (_delta > 0) {
		        		biggerImage();
		        	}
		        	//向下滚动
		        	else {
		            	smallerImage();
		        	}
		        	e.preventDefault();
				}			
				//pc拖拽的编写
				//存储down的鼠标位置,允许拖拽与否,图片老位置
				var downX,downY, dragFlag,oldLeft,oldTop;
				$img.on("mousedown", function(event){
					downX = event.clientX,
					downY = event.clientY,
					oldLeft = $(this).position().left,
					oldTop = $(this).position().top,
					imgW = $(this).width(),
					imgH = $(this).height();
					dragFlag = true;
					$(this).on("mousemove",function(event){
						if(dragFlag){
							var moveX = event.clientX,
								moveY = event.clientY;
							if(wW < imgW){ //左右可以拖拽
								var newLeft = moveX - downX + oldLeft;
								if(newLeft > 0){
									newLeft = 0;
								}
								if(newLeft < (wW - imgW)){
									newLeft = (wW - imgW);
								}
								$(this).css({'left': newLeft});
							}
							if(wH < imgH){ //上下可以拖拽
								var newTop = moveY - downY + oldTop;
								if(newTop > 0){
									newTop = 0;
								}
								if(newTop < (wH - imgH)){
									newTop = (wH - imgH);
								}
								$(this).css({'top': newTop})
							}
						}
					})
				})
				.on('mouseup mouseout',function(){
					dragFlag = false;
				})
				
            }
            
			//双击相对于浏览器窗口大小重新显示
			$img.dblclick(function(){
				resetInit();
			})
            function biggerImage(){
            	$width = $width * (1 + defaluts.ratio);
            	$height = $height * (1 + defaluts.ratio);
            	
            	if($width > opts.width*16){
            		$width = opts.width*16;
            		$height = $width/$imgR;
            	}else if($width > opts.width*0.9 && $width < opts.width*1.1){
            		$width = opts.width;
            		$height = $width/$imgR;
            	}
            	
            	showTip(parseInt($width/opts.width*100)+'%');
              	setImagePosition();
            }
            function smallerImage(){
            	$width = $width *  (1 - defaluts.ratio);
            	$height =  $height * (1 - defaluts.ratio);
            	
            	if($width < opts.width*0.05){
            		$width = opts.width*0.05;
            		$height = $width/$imgR;
            	}else if($width > opts.width*0.9 && $width < opts.width*1.1){
            		$width = opts.width;
            		$height = $width/$imgR;
            	}
            	showTip(parseInt($width/opts.width*100)+'%');
              	setImagePosition();
            }
        }
    });
    
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