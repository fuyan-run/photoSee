function setGesture(el){
    var obj={}; //定义一个对象
    var istouch=false;
    var start=[];
    el.addEventListener("touchstart",function(e){
        if(e.touches.length>=2){  //判断是否有两个点在屏幕上
            istouch=true;
            start=e.touches;  //得到第一组两个点
            obj.gesturestart&&obj.gesturestart.call(el); //执行gesturestart方法
        };
    },false);
    document.addEventListener("touchmove",function(e){
        e.preventDefault();
        if(e.touches.length>=2&&istouch){
            var now=e.touches;  //得到第二组两个点
            var scale=getDistance(now[0],now[1])/getDistance(start[0],start[1]); //得到缩放比例，getDistance是勾股定理的一个方法
            var rotation=getAngle(now[0],now[1])-getAngle(start[0],start[1]);  //得到旋转角度，getAngle是得到夹角的一个方法
            e.scale=scale.toFixed(2);
            e.rotation=rotation.toFixed(2);
            obj.gesturemove&&obj.gesturemove.call(el,e);  //执行gesturemove方法
        };
    },false);
    document.addEventListener("touchend",function(e){
        if(istouch){
            istouch=false;
            obj.gestureend&&obj.gestureend.call(el);  //执行gestureend方法
        };
    },false);
    return obj;
};
function getDistance(p1, p2) {
    var x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
    return Math.sqrt((x * x) + (y * y));
};
function getAngle(p1, p2) {
    var x = p1.pageX - p2.pageX,
        y = p1.pageY- p2.pageY;
    return Math.atan2(y, x) * 180 / Math.PI;
};