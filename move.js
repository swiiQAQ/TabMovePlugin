;(function(){
    function initMove(props){
        this.widthOrHeight = props.widthOrHeight;
        this.startX = 0;
        this.startY = 0;
        this.sourceX = 0;
        this.sourceY = 0;
        this.oElem = document.querySelector(props.selector);
        this.direction = props.direction;
        this.i = 1;
        this.nextNode = '';
        this.init();
    }

    initMove.prototype={
        constructor: initMove,
        init: function(){
            var _this = this;
            this.oElem.addEventListener('mousedown',start,false);
            function start(event){
                _this.startX = event.pageX;
                _this.startY = event.pageY;
                var pos = _this.getTargetPos(_this.oElem);
                sourceX = pos.x;
                sourceY = pos.y;
                document.addEventListener('mousemove',move,false);
                document.addEventListener('mouseup',end,false);
            }
            function move(event){
                var node = _this.oElem;
                node.style['z-index'] = '999';
                node.style['transition'] = '0s';
                var currentX = event.pageX;
                var currentY = event.pageY;
                var distanceY = currentY - _this.startY;
                var distanceX = currentX - _this.startX;
                var transform = _this.getTransform();
                if(_this.direction == "vertical"&&_this.limitedMove()){
                    if(distanceY>(node.offsetHeight/2)*_this.i){
                        if(_this.i>1) {
                            _this.nextNode = _this.getNextSiblings(_this.nextNode);
                        }
                        else{
                            _this.nextNode = _this.getNextSiblings(node);
                        }
                        if(_this.nextNode){
                            _this.nextNode.style[transform] = 'translateY(-'+node.offsetHeight+'px)';
                        }
                        _this.i = _this.i + 2;
                    }
                    if(distanceY<-(node.offsetHeight/2)*_this.i){
                        if(_this.i>1) {
                            _this.prevNode = _this.getPreviousSiblings(_this.prevNode);
                        }
                        else{
                            _this.prevNode = _this.getPreviousSiblings(node);
                        }
                        if(_this.prevNode){
                            _this.prevNode.style[transform] = 'translateY('+node.offsetHeight+'px)';
                        }
                        _this.i = _this.i + 2;
                    }
                    _this.setTargetPos(node,{
                        y: (sourceY + distanceY).toFixed()
                    })
                }
                else if(_this.limitedMove()){
                    if(distanceX>(node.offsetWidth/2)*_this.i){
                        //判断是跨越一个还是多个
                        _this.nextNode = _this.i>1 ? _this.getNextSiblings(_this.nextNode) : _this.getNextSiblings(node);
                        //如果存在下个节点，下个节点向前移动
                        if(_this.nextNode){
                            _this.nextNode.style[transform] = 'translateX(-'+node.offsetWidth+'px)';
                        }
                        _this.i = _this.i + 2;
                    }
                    if(distanceX<-(node.offsetWidth/2)*_this.i){
                        _this.prevNode = _this.i >1?_this.getPreviousSiblings(_this.prevNode) : _this.getPreviousSiblings(node);
                        if(_this.prevNode){
                            _this.prevNode.style[transform] = 'translateX('+node.offsetWidth+'px)';
                        }
                        _this.i = _this.i+2;
                    }
                    _this.setTargetPos(node,{
                        x: (sourceX + distanceX).toFixed(),
                    })
                }
            }
            //松手时，dom插入当前位置，translate属性取消
            function end(event){
                _this.backToPosition(event);
                document.removeEventListener('mousemove',move);
                document.removeEventListener('mouseup',end);
                _this.oElem.style['z-index'] = '';
                _this.i = 1;
            }
        },

        //获取后一个节点，排除textnode
        getNextSiblings:function(ele){
            var nextNode = ele.nextSibling;
            if(nextNode&&nextNode.nodeType!==3){
                return nextNode;
            }
            else if(nextNode){
                return nextNode.nextSibling
            }
            else{
                return null;
            }
        },
        getPreviousSiblings: function(ele){
            var prevNode = ele.previousSibling;
            if(prevNode&&prevNode.nodeType!==3){
                return prevNode;
            }
            else if(prevNode){
                return prevNode.previousSibling;
            }
            else{
                return null;
            }
        },
        //松手后，移动位置嵌入位置中
        backToPosition: function(event){
            var transform = this.getTransform();
            var translateDirection = this.translateDirection();
            var pageDirection = this.pageDirection();
            var startDirection = this.startDirection();
            var temp = (event[pageDirection]-this[startDirection])/(this.widthOrHeight/2)%2;
            var backDistance = event[pageDirection]-this[startDirection]-(event[pageDirection]-this[startDirection])%(this.widthOrHeight/2);
            if(backDistance>0){
                var goDistance = backDistance + this.widthOrHeight/2;
            }
            else{
                var goDistance = backDistance - this.widthOrHeight/2;
            }
            // if(temp>1||(temp<0&&temp>-1)){
            if(temp>1||temp<-1){
                this.oElem.style[transform] = `${translateDirection}(${goDistance}px)`;
                this.moveNode(goDistance);
            // }else if(temp<1&&temp>0){
            }else{
                this.oElem.style[transform] = `${translateDirection}(${backDistance}px)`;
                this.moveNode(backDistance);
            }
            // else if(temp<-1){
            //     debugger;
            //     this.oElem.style[transform] = `${translateDirection}(${goDistance}px)`;
            // }
            // else{

            // }
        },
        //松手后，更改节点位置
        moveNode:function(distance){
            var id = parseInt(this.oElem.id);
            var parent = this.oElem.parentNode;
            var children = parent.children;
            if(distance<0){
                var moveLength = distance / this.widthOrHeight +id;
            }
            else{
                var moveLength = distance / this.widthOrHeight + 1 +id;
            }
            var beforeNode = parent.children[moveLength];
            parent.insertBefore(this.oElem,beforeNode);
            
            for(var i = 0; i<children.length;i++){
                children[i].id = i;
                children[i].style.transform = '';
            }
            
        },
        //限制不能超过最外部的盒子
        limitedMove: function(){
            var thisRect = this.oElem.getBoundingClientRect();
            var parentRect = this.oElem.parentNode.getBoundingClientRect();
            if(this.direction == 'vertical'){
                return thisRect.bottom < parentRect.bottom ? true : false;
            }
            else{
                return thisRect.right < parentRect.right ? true : false;
            }
        },
        //transform兼容性
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
        //getstyle兼容性
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
        //移动的点跟着鼠标
        setTargetPos: function(elem,pos){
            var transform = this.getTransform();

            if(transform){
                if(this.direction == "vertical"){
                    elem.style[transform] = 'translateY(' + pos.y + 'px)';
                }
                else if(this.direction == "horizon"){
                    elem.style[transform] = 'translateX(' + pos.x + 'px)';
                }
            }else{
                if(this.direction == "vertical"){
                    elem.style.left = pos.x + 'px';
                }
                else if(this.direction == "horizon")
                elem.style.top = pos.y + 'px';
            }
            return elem;
        },
        translateDirection:function(){
            if(this.direction == 'vertical') return 'translateY'
            if(this.direction == 'horizon') return 'translateX'
        },
        pageDirection:function(){
            if(this.direction == 'vertical') return 'pageY'
            if(this.direction == 'horizon') return 'pageX'
        },
        startDirection:function(){
            if(this.direction == 'vertical') return 'startY'
            if(this.direction == 'horizon') return 'startX'
        }
    }
    window.initMove = initMove;
})();