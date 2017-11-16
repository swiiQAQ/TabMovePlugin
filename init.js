
;(function(){
    function initEntr(props){
        var defaultProps={
            direction: 'vertical',
        };
        this.oElem = document.querySelector(props.selector);
        this.direction = props.direction ? props.direction : defaultProps.direction;
        this.length = this.oElem.children.length;
        
        if(this.length>1){
            for(var i=0;i<this.length;i++){
                new initMove({
                    selector:props.selector+" ."+(this.oElem.children[i].className).replace(" ","."),
                    direction:this.direction,
                    widthOrHeight: props.widthOrHeight
                })
            }
        }
    }
    window.initEntr = initEntr;
})()
// function initEntr(props){
//     var defaultProps={
//         direction: 'vertical',
//     };
//     var oElem = document.querySelector(props.selector);
//     var direction = props.direction ? props.direction : defaultProps.direction;
//     var length = oElem.children.length;
    
//     if(length>1){
//         for(var i=0;i<length;i++){
//             window.initMove("."+oElem.children[i].className,direction);
//         }
//     }
// }

