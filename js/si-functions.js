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
		var elInView = function(el) {
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
					x: (elInView(_a)).x,
					y: (elInView(_a)).y,
					width: $(_a).width(),
					height: $(_a).height()
				}
				var c = !(
					((a.y + a.height) < (b.y)) ||
					(a.y > (b.y + b.height)) ||
					((a.x + a.width) < b.x) ||
					(a.x > (b.x + b.width))
				);
				
					//console.log(i);
				if(c) {
					console.log(_a);
					console.log(i);
					$(_a).removeClass('alive');
					return c;
					break;
				}
			}
		}
		
		var rid = 'rand_'+parseInt(Math.random()*1000000);
		$('#base').before('<div id="'+rid+'" class="bullet" />');
		//touts[rid] = setInterval(function() { checkcollision($('#'+rid)) },50);
		
			var _b = $('#'+rid);
			var _bh = $(_b).height();
			var _bw = $(_b).width();
			//console.log(a);
			
		$('#'+rid).css({'left':(elInView($('#spaceship').get(0))).x,'top':(elInView($('#spaceship').get(0))).y})
		.animate(
			{
				'top':'-'+window.innerHeight
			},
			{
				duration: 2500,
				step: function(now, fx) {
					//console.log(now);
					var b = {
						x: (elInView(this)).x,
						y: (elInView(this)).y,
						width: _bh,
						height: _bw
					}
					if(checkcollision(b)) { console.log('stop'); $(this).stop().remove(); };
					//console.log(fx);
				},
				complete: function() {
					$('#'+rid).remove();
				}
			}
		)
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