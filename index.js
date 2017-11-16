
//transform兼容性测试
function getTransform(){
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
}
function getStyle(elem,property){
    return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(elem,false)[property] : elem.currentStyle[property] ;
}
function getTargetPos(elem){
    var pos = {x:0,y:0};
    var transform = getTransform();
    if(transform){
        var transformValue = getStyle(elem,transform);
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
        if(getStyle(elem,'position') == 'static'){
            elem.style.position = 'relative';
            return pos;
        }
        else{
            var x = parseInt(getStyle(elem,'left') ? getStyle(elem,'left') : 0);
            var y = parseInt(getStyle(elem,'top')? getStyle(elem,'top') : 0);
            return pos={
                x: x,
                y: y 
            }
        }
    }
}
function setTargetPos(elem,pos){
    var transform = getTransform();
    if(transform){
        elem.style[transform] = 'translate(' + pos.x +'px,' + pos.y + 'px)';
    }else{
        elem.style.left = pos.x + 'px';
        elem.style.top = pos.y + 'px';
    }
    return elem;
}

var oElem = document.getElementById('moveBox');
var startX = 0;
var startY = 0;
var sourceX = 0;
var sourceY = 0;
oElem.addEventListener('mousedown', start, false);
function start(event){
    startX = event.pageX;
    startY = event.pageY;
    var pos = getTargetPos(oElem);
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
    setTargetPos(oElem,{
        x: (sourceX + distanceX).toFixed(),
        y: (sourceY + distanceY).toFixed()
    })
}
function end(event){
    document.removeEventListener('mousemove',move);
    document.removeEventListener('mouseup',end);
}