(function() {
	
	var __spaceshipSpeed = 12000;
	var __maxLeft = parseInt($('#base').width() - $('#spaceship').width());
	var __animStep = __spaceshipSpeed / __maxLeft; // time for animating 1px
	var drawBoard = function() {
		var invade = function() {
			var _invaders = $('#invaders').get(0);
			var animIteration = 0;
			var animIterHandler = function(e) {
				animIteration++;
				(animIteration%2 == 0) ? console.log('left') : console.log('right');
				console.log(e);
				$(_invaders).css('margin-top','+=10px');
			}
			var pfx = ["webkit", "moz", "MS", "o", ""];
			var prefAnimListener = function(type, clbk) {
				for (var p = 0; p < pfx.length; p++) {
					if (!pfx[p]) type = type.toLowerCase();
					_invaders.addEventListener(pfx[p]+type, clbk, false);
				}
			}
			prefAnimListener('AnimationIteration',animIterHandler)
			$(_invaders).addClass('invade');
		};
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
		$('#spaceship').css('margin-left', __maxLeft / 2);
		invade();
	};
	var sfx = function(n,type) {
		var sound_id = 'sfx_'+n;
		var shootHTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/shoot_sfx.mp3"></source>'+
					'<source src="audio/shoot_sfx.ogg"></source>'+
					'</audio>';
		var dieHTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/scream_1.mp3"></source>'+
					'<source src="audio/scream_1.ogg"></source>'+
					'</audio>';
		var destroy_sound = function(sid) {
			setTimeout(function() {
				$('#'+sid).remove();
			}, 1000)
		}
		var s = (type == 'shoot') ? shootHTML : dieHTML;
		$('#sounds').append(s);
		var s = $('#'+sound_id).get(0);
		s.volume = 0.2;
		s.play();
		destroy_sound(sound_id);
	}
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
					var rid = 'rand_'+parseInt(Math.random()*1000000);
					$(_a).removeClass('alive');
					sfx(rid,'die');
					return c;
					break;
				}
			}
		}
		// random id
		var rid = 'rand_'+parseInt(Math.random()*1000000);
		$('#base').before('<div id="'+rid+'" class="bullet" />');
		var _b = $('#'+rid); // bullet
		var _bh = $(_b).height(); // bullet height
		var _bw = $(_b).width(); // bullet width
		var _ss = $('#spaceship').get(0); // spaceship as js object
		var _ssp = elPos(_ss); // spaceship current position
		var _sspycorr = _ssp.y - 1; // correction for placing bullet at the top of spaceship
		$('#'+rid).css({'left':_ssp.x,'top':_sspycorr}).animate(
			{
				'top':'-'+window.innerHeight
			},
			{
				duration: 2500,
				easing: 'linear',
				progress: function(now, fx) {
					var b = {
						x: (elPos(this)).x,
						y: (elPos(this)).y,
						width: _bw,
						height: _bh
					}
					if(checkcollision(b)) { $(this).stop().remove(); };
				},
				complete: function() {
					$('#'+rid).remove();
				}
			}
		);
		sfx(rid,'shoot');
	}
	var moveSpaceship = function(dir) {
		var currPos = parseInt($('#spaceship').css('margin-left'));
		var currSpeed = (dir) ? (__maxLeft - currPos) * __animStep: currPos * __animStep;
		var moveTo = (dir) ? __maxLeft : 0;
		$('#spaceship').animate({ 'margin-left': moveTo },currSpeed,'linear');
	}     
	
	var stopSpaceship = function() {
		$('#spaceship').stop(true,false);
	};
	
	var bindKeys = function() {
		$(document).keydown(function(evt) {
			if(evt.keyCode == 37) {
				moveSpaceship(0)
			} else if(evt.keyCode == 39) {
				moveSpaceship(1)
			}
		});
		$(document).keyup(function(evt) {
			evt.preventDefault();
			if (evt.keyCode == 37 || evt.keyCode == 39) {
				stopSpaceship();
			} else if(evt.keyCode == 32) {
				shoot();
			}
		});
		/*
		$('html').on('click', function() { shoot() })
		*/
	};
	
	$(function() {
		drawBoard();
		bindKeys()
	});
})();