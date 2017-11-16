;(function(){
    function initMove(selector){
        this.oElem = document.querySelector(selector);
        this.startX = 0;
        this.startY = 0;
        this.sourceX = 0;
        this,sourceY = 0;
        this.init();
    }

    function end(event){
        document.removeEventListener('mousemove',move);
        document.removeEventListener('mouseup',end);
    }
    initMove.prototype={
        constructor: initMove,
        init: function(){
            var _this = this;
            this.oElem.addEventListener('mousedown',start,false);
            function start(event){
                startX = event.pageX;
                startY = event.pageY;
                var pos = _this.getTargetPos(_this.oElem);
                sourceX = pos.x;
                sourceY = pos.y;
                document.addEventListener('mousemove',move,false);
                document.addEventListener('mouseup',end,false);
            }
            function move(event){
                var currentX = event.pageX;
                var currentY = event.pageY;
                var distanceX = currentX - startX;
                var distanceY = currentY - startY;
                _this.setTargetPos(_this.oElem,{
                    x: (sourceX + distanceX).toFixed(),
                    y: (sourceY + distanceY).toFixed()
                })
            }
            function end(event){
                document.removeEventListener('mousemove',move);
                document.removeEventListener('mouseup',end);
            }
        },
        getTransform: function(){
            var transform = '';
            var divStyle = document.createElement('div').style;
            var transformArr = ['transform','webkitTransform','MozTransform','msTransform','Otransform'];
            var len = transformArr.length;
            for(var i =0;i<len;i++){
                if(transformArr[i] in divStyle){
                    return transform = transformArr[i];
                }
            }
            return transform;
        },
        getStyle: function(elem,property){
            return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(elem,false)[property] : elem.currentStyle[property] ;
        },
        getTargetPos: function(elem){
            var pos = {x:0,y:0};
            var transform = this.getTransform();
            if(transform){
                var transformValue = this.getStyle(elem,transform);
                if(transformValue == 'none'){
                    elem.style[transform] = 'translate(0,0)' ;
                    return pos;
                }
                else{
                    var temp = transformValue.match(/-?\d+/g);
                    return pos = {
                        x: parseInt(temp[4].trim()),
                        y: parseInt(temp[5].trim())
                    }
                }
            }
            else{
                if(this.getStyle(elem,'position') == 'static'){
                    elem.style.position = 'relative';
                    return pos;
                }
                else{
                    var x = parseInt(this.getStyle(elem,'left') ? this.getStyle(elem,'left') : 0);
                    var y = parseInt(this.getStyle(elem,'top')? this.getStyle(elem,'top') : 0);
                    return pos={
                        x: x,
                        y: y 
                    }
                }
            }
        },
        setTargetPos: function(elem,pos){
            var transform = this.getTransform();
            if(transform){
                elem.style[transform] = 'translate(' + pos.x +'px,' + pos.y + 'px)';
            }else{
                elem.style.left = pos.x + 'px';
                elem.style.top = pos.y + 'px';
            }
            return elem;
        }
    }
    window.initMove = initMove;
})();