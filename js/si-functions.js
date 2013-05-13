(function() {
	function drawBoard() {
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
	/*
	var drawBoard = function() {
		
	}
	*/
	
	
	
	
	
	$(function() {
		console.log('space invaders DOM ready');
		drawBoard();
	});
})();