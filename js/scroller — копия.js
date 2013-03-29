var Scroller = {
	posX : 0,
	posY : 0,
	content : null,
	sizeX : 0,
	sizeY : 0,
	w:0,
	h:0,

	updatePosition : function(){
		with (this) {
			console.log(posX*w, posY*h)
			content.style.left=-posX*w+'px';
			content.style.top=-posY*h+'px';
		}	
	},

	left : function(){
		with (this) {
			posX -= 1;
			posX = (posX<0) ? 0 : posX;
			updatePosition()
		}
	},

	right : function(){
		with (this) {
			posX += 1;
			posX = (posX>sizeX-1) ? sizeX-1 : posX;
			updatePosition()
		}
	},

	up : function(){
		with (this) {
			posY -= 1;
			posY = (posY<0) ? 0 : posY;
			updatePosition()
		}		
	},

	down : function(){
		with (this) {
			posY += 1;
			posY = (posY>sizeY-1) ? sizeY-1 : posY;
			updatePosition()
		}
	},

	moveto : function(x,y) {
		with (this) {
			posY = y
			posY = (posY<0) ? 0 : posY
			posY = (posY>sizeY-1) ? sizeY-1 : posY
			posX = x
			posX = (posX<0) ? 0 : posX
			posX = (posX>sizeX-1) ? sizeX-1 : posX
			updatePosition()
		}
	},

	init : function(x,y,sx,sy,width,height,contentSelector){
		with (this) {
			posX = x;
			posY = y;
			sizeX = sx;
			sizeY = sy;
			content = document.querySelector(contentSelector);
			content.style.position='relative'
			w=width
			h=height
		}
		return this;

	}
}

var scroll = null;

window.onload = function(){
	scroll = Scroller.init(0,0,3,1,410,416,"#scrollerContent")
	//document.querySelector('#leftBtn').addEventListener('click',function(){ scroll.left() })
	document.querySelector('#navigationBar').addEventListener('click',function(){ scroll.right() })
	//document.querySelector('#botBtn').addEventListener('click',function(){ scroll.down() })
	//document.querySelector('#topBtn').addEventListener('click',function(){ scroll.up() })
}