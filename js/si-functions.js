(function() {
	var drawBoard = function() {
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
	};
	/*
	var drawBoard = function() {
		
	}
	*/
	var shoot = function() {
		var el = $('#spaceship').get(0);
		var checkcollision2 = function(a,b) {
			return !(
				((a.y + a.height) < (b.y)) ||
				(a.y > (b.y + b.height)) ||
				((a.x + a.width) < b.x) ||
				(a.x > (b.x + b.width))
			);
		}
		var checkcollision = function(el) {
			var c = $(el).collision('.invader');
			if(c.length) { return c; };
		}
		var touts = {};
		var elInView = function() {
			var rect = el.getBoundingClientRect();
			var p = { l: rect.left, t: rect.top }
			return p;
		};
		var rid = 'rand_'+parseInt(Math.random()*1000000);
		$('#base').before('<div id="'+rid+'" class="bullet" />');
		//touts[rid] = setInterval(function() { checkcollision($('#'+rid)) },50);
		touts[rid] = setInterval(function() {
			var a = checkcollision($('#invaders').get(0),$('#'+rid).get(0));
			console.log(a);
		}, 50);
		$('#'+rid).css({'left':(elInView()).l,'top':(elInView()).t}).animate({'top':'-'+window.innerHeight},2500, function() {
			$('#'+rid).remove();
			window.clearInterval(touts[rid]);
			touts[rid] = null;
		});
	}
	var moveSpaceship = function(dir) {
		if(!dir) {
			$('#spaceship').animate({ 'margin-left': '-=8' },100,'linear');
		} else {
			if(dir < 2) {
				$('#spaceship').animate({ 'margin-left': '+=8' },100,'linear')
			} else {
				$('#spaceship').stop(true,true);
			}
		}
	};
	
	var bindKeys = function() {
		$(document).keydown(function(evt) {
			if (evt.keyCode == 32) {
				evt.preventDefault();
				console.log('Space bar keydown');
				//shoot();
			} else if(evt.keyCode == 37) {
				console.log('Left arrow keydown');
				moveSpaceship(0)
			} else if(evt.keyCode == 39) {
				console.log('Right arrow keydown');
				moveSpaceship(1)
			}
		});
		$(document).keyup(function(evt) {
			if (evt.keyCode == 37) {
				moveSpaceship(2)
			} else if(evt.keyCode == 39) {
				moveSpaceship(2)
			}
		});
		$('html').on('click', function() { shoot() })
	};
	
	$(function() {
		console.log('space invaders DOM ready');
		//$('#spaceship').css('margin-left',($('#spaceship').position()).left)
		drawBoard();
		bindKeys()
	});
})();