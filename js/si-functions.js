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
		$('#spaceship').css('left',313)
	};
	/*
	var drawBoard = function() {
		
	}
	*/
	var shoot = function() {
		var elPos = function(el) {
			var rect = el.getBoundingClientRect();
			var p = { x: rect.left, y: rect.top }
			return p;
		};
		var checkcollision = function(b) {
			var all = $('.invader.alive');
			var l = all.length;
			for(var i=0;i<l;i++) {
				var _a = all[i];
				var a = {
					x: (elPos(_a)).x,
					y: (elPos(_a)).y,
					width: $(_a).width(),
					height: $(_a).height()
				}
				var c = !(
					((a.y + a.height) < (b.y)) ||
					(a.y > (b.y + b.height)) ||
					((a.x + a.width) < b.x) ||
					(a.x > (b.x + b.width))
				);
				if(c) {
					console.log(_a);
					console.log(i);
					console.log(a);
					console.log(b);
					$(_a).removeClass('alive');
					return c;
					break;
				}
			}
		}
		// random id
		var rid = 'rand_'+parseInt(Math.random()*1000000);
		$('#base').before('<div id="'+rid+'" class="bullet" />');
		//touts[rid] = setInterval(function() { checkcollision($('#'+rid)) },50);
		
		var _b = $('#'+rid);
		var _bh = $(_b).height();
		var _bw = $(_b).width();
		var _ss = $('#spaceship').get(0);
		var _ssp = elPos(_ss);
		$('#'+rid).css({'left':_ssp.x,'top':_ssp.y}).animate(
			{
				'top':'-'+window.innerHeight
			},
			{
				duration: 2500,
				progress: function(now, fx) {
					//console.log(now);
					var b = {
						x: (elPos(this)).x,
						y: (elPos(this)).y,
						width: _bw,
						height: _bh
					}
					if(checkcollision(b)) { $(this).stop().remove(); };
					//console.log(fx);
				},
				complete: function() {
					$('#'+rid).remove();
				}
			}
		)
	}
	var spPending = 0;
	var moveSpaceship = function(dir) {
		if(!spPending) {
			var currPos = parseInt($('#spaceship').css('margin-left'));
			var spaceshipSpeed = 12000;
			var maxLeft = parseInt($('#base').width() - $('#spaceship').width());
			// time for animating 1px
			var animStep = spaceshipSpeed / maxLeft;
			// time for animating current action default assumes starting from the middle
			var currSpeed = spaceshipSpeed / 2;
			var moveTo = maxLeft / 2;
			if(dir) {
				currSpeed = ((maxLeft / 2) - currPos) * animStep
			} else {
				currSpeed = ((maxLeft / 2) + currPos) * animStep;
				moveTo = -moveTo;
			}
			spPending = 1;
			$('#spaceship').animate({ 'margin-left': moveTo },currSpeed,'linear');
		}
	};
	
	var stopSpaceship = function() {
		$('#spaceship').stop(true,false);
		spPending = 0;
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
			if (evt.keyCode == 37 || evt.keyCode == 39) {
				stopSpaceship();
			}
		});
		$('html').on('click', function() { shoot() })
	};
	
	$(function() {
		drawBoard();
		bindKeys()
	});
})();