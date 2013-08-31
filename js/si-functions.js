(function() {
	
	
	var __shootTO; // shooter timeout
	var __spaceshipSpeed = 12000;
	var __maxLeft = parseInt($('#base').width() - $('#spaceship').width());
	var __animStep = __spaceshipSpeed / __maxLeft; // time for animating 1px
	var __stop = false;
	var __live = 3;
	var gameOver = function(win) {
		var msg = (win) ? 'YOU WON!!' : 'YOU LOST!!!';
		var gameover_s = (win) ? 'won' : 'lost';
		$('.bullet').remove();
		sfx(98273928374, gameover_s);
		setTimeout(function() {
			alert(msg);
			window.location.reload(true);
		}, 900);
	}
	var killSpaceship = function(goFlag) {
		//console.log('kill space ship');
		//console.log('game over flag: '+goFlag)
		__stop = true;
		__live--;
		$('#spaceship').css('opacity',0);
		$('.bullet').remove();
		if(!__live || goFlag) {
			gameOver(0)
		} else {
			setTimeout(function() { sfx(81276318,'humandie'+__live); }, 800)
			setTimeout(function() {
				$('#spaceship').css('margin-left', __maxLeft / 2);
				$('#spaceship').css('opacity',1);
				__stop = false;
			}, 2500)
		}
	}
	var shoot = function(alienFlag, aPos) { // alien pos used only with alienflag 0
		
			
			if(__stop) { return }
			
			var elPos = function(el) {
				var rect = el.getBoundingClientRect();
				var p = { x: rect.left, y: rect.top }
				return p;
			};
			var checkcollision = function(b) {
			
			
				var all = (alienFlag) ? $('.invader.alive') : $('#spaceship');
				var l = all.length;
				//console.log(l)
				for(var i=0;i<l;i++) {
					var _a = all[i];
					
					//console.log(_a)
					
					var a = { // every invader or spaceship
						x: (elPos(_a)).x,
						y: (elPos(_a)).y,
						width: $(_a).width(),
						height: $(_a).height()
					}
					var c = !( // collision object
						((a.y + a.height) < (b.y)) ||
						(a.y > (b.y + b.height)) ||
						((a.x + a.width) < b.x) ||
						(a.x > (b.x + b.width))
					);
					if(c) {
						var rid = 'rand_'+parseInt(Math.random()*1000000);
						
						
						if(alienFlag) {
							$(_a).removeClass('alive');
							sfx(rid,'aliendie');
							if(l <= 1) { gameOver(1) }
						} else {
							sfx(rid,'humanexpl');
							killSpaceship(0)
						}
						
						return c;
						break;
					}
				}
				
				
			}
		// random id
		var rid = 'rand_'+parseInt(Math.random()*1000000);
		
		var bulletClass = (alienFlag) ? 'bullet': 'bullet alien-bullet';
		
		$('#base').before('<div id="'+rid+'" class="'+bulletClass+'" />');
		
		var _b = $('#'+rid); // bullet
		var _bh = $(_b).height(); // bullet height
		var _bw = $(_b).width(); // bullet width
		var _ss = $('#spaceship').get(0); // spaceship as js object
		var _ssp = (alienFlag) ? elPos(_ss) : aPos; // spaceship current position
		var _sspycorr = (alienFlag) ? _ssp.y - 1 : _ssp.y + 40; // correction for placing bullet at the top of spaceship or bottom of alien
		
		
		$('#'+rid).css({'left':_ssp.x,'top':_sspycorr}).animate(
			{
				'top': (alienFlag) ? '-'+window.innerHeight : window.innerHeight
			},
			{
				duration: (alienFlag) ? 4000 : 2000,
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
		var soundType = (alienFlag) ? 'humanShoot' : 'alienShoot';
		sfx(rid, soundType);
	}
	
	var drawBoard = function() {
		var destroyHumanity = function() {
			var tMax = 1000;
			var tMin = 400;
			var rt = Math.floor(Math.random() * (tMax - tMin) + tMin);
			__shootTO = setTimeout(shootHuman, rt);
		};
		var shootHuman = function() {
			var invaders = $('.invader.alive');
			var invadersL = invaders.length;
			if(invadersL) {
				var randomInvader = invaders.get(Math.floor(Math.random()*invadersL));
				//console.log(randomInvader);
				var randomInvaderRect = randomInvader.getBoundingClientRect();
				var p = { x: randomInvaderRect.left, y: randomInvaderRect.top };
				shoot(0,p);
				destroyHumanity();
			} else {
				console.log('clear killer');
				window.clearTimeout(__shootTO)
			}
		}
		var checkBase = function() {
			var basePosTop = ($('#base').position()).top - 25;
			var invaders = $('#invaders');
			var invadersPosTop = parseInt(invaders.height()) + parseInt(invaders.css('margin-top'));
			//console.log('basePosTop: '+basePosTop);
			//console.log('invadersPosTop: '+invadersPosTop);
			if(basePosTop <= invadersPosTop) { killSpaceship(1) }
		}
		var invade = function() {
			
			var _invaders = $('#invaders').get(0);
			var animIteration = 0;
			var animIterHandler = function(e) {
				animIteration++;
				//(animIteration%2 == 0) ? console.log('left') : console.log('right');
				//console.log(e);
				if(!__stop) {
					$(_invaders).css('margin-top','+=10px');
					checkBase();
				};
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
			
			destroyHumanity()
			
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
		// console.log('sound disabled'); return;
		
		var sound_id = 'sfx_'+n;
		var alienshootHTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/alienshoot_sfx1.mp3"></source>'+
					'<source src="audio/alienshoot_sfx1.ogg"></source>'+
					'</audio>';
		var humanshootHTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/humanshoot_sfx1.mp3"></source>'+
					'<source src="audio/humanshoot_sfx1.ogg"></source>'+
					'</audio>';
		var aliendieHTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/aliendie_sfx2.mp3"></source>'+
					'<source src="audio/aliendie_sfx2.ogg"></source>'+
					'</audio>';
		var humandie1HTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/humandie_sfx3.mp3"></source>'+
					'<source src="audio/humandie_sfx3.ogg"></source>'+
					'</audio>';
		var humandie2HTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/humandie_sfx1.mp3"></source>'+
					'<source src="audio/humandie_sfx1.ogg"></source>'+
					'</audio>';
		var humanexplHTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/humanexplode_sfx1.mp3"></source>'+
					'<source src="audio/humanexplode_sfx1.ogg"></source>'+
					'</audio>';
		var wonHTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/won_sfx1.mp3"></source>'+
					'<source src="audio/won_sfx1.ogg"></source>'+
					'</audio>';
		var lostHTML = '<audio id="'+sound_id+'" preload="auto">'+
					'<source src="audio/lost_sfx1.mp3"></source>'+
					'<source src="audio/lost_sfx1.ogg"></source>'+
					'</audio>';
		var destroy_sound = function(sid) {
			setTimeout(function() {
				$('#'+sid).remove();
			}, 2500)
		}
		//console.log(type);
		var s; switch(type) {
			case 'alienShoot':
				s = alienshootHTML
			break;
			case 'humanShoot':
				s = humanshootHTML
			break;
			case 'aliendie':
				s = aliendieHTML
			break;
			case 'humandie1':
				s = humandie2HTML
			break;
			case 'humandie2':
				s = humandie2HTML
			break;
			case 'humanexpl':
				s = humanexplHTML
			break;
			case 'won':
				s = wonHTML
			break;
			case 'lost':
				s = lostHTML
			break;
		}
		$('#sounds').append(s);
		var s = $('#'+sound_id).get(0);
		s.volume = 0.2;
		s.play();
		destroy_sound(sound_id);
	}
	var moveSpaceship = function(dir) {
		if(__stop) { return }
		var currPos = parseInt($('#spaceship').css('margin-left'));
		var currSpeed = (dir) ? (__maxLeft - currPos) * __animStep: currPos * __animStep;
		var moveTo = (dir) ? __maxLeft : 0;
		$('#spaceship').animate({ 'margin-left': moveTo },currSpeed,'linear');
	}     
	
	var stopSpaceship = function() {
		$('#spaceship').stop(true,false);
	};
	
	var bindKeys = function() {
		var shootLimiter = 0;
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
				shootLimiter++;
				if(shootLimiter%2 == 0) { shoot(1) };
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