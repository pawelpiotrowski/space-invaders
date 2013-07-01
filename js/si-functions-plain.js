/** DOMReady v2.0.1 - MIT license - https://github.com/freelancephp/DOMReady */
(function(a){a.DOMReady=function(){var b=[],c=false,d=null,e=function(a,b){try{a.apply(this,b||[])}catch(c){if(d)d.call(this,c)}},f=function(){c=true;for(var a=0;a<b.length;a++)e(b[a].fn,b[a].args||[]);b=[]};this.setOnError=function(a){d=a;return this};this.add=function(a,d){if(c){e(a,d)}else{b[b.length]={fn:a,args:d}}return this};if(a.addEventListener){a.document.addEventListener("DOMContentLoaded",function(){f()},false)}else{(function(){if(!a.document.uniqueID&&a.document.expando)return;var b=a.document.createElement("document:ready");try{b.doScroll("left");f()}catch(c){setTimeout(arguments.callee,0)}})()}return this}()})(window);
/*
function invade() {
	var invRows = document.querySelectorAll('.invaders-row');
	for(var i = 0; i < invRows.length; i++) {
		var invader = invRows[i].querySelector('.invader'), j = 0;
		invRows[i].removeChild(invader);
		do {
			var invClone = invader.cloneNode(true);
			invRows[i].appendChild(invClone);
			j += 1;
		} while (j < 10);
	}
}
*/
SI = {
  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(480, 320);
    Crafty.background('green');
  }
}

DOMReady.add(function(){ SI.start() });