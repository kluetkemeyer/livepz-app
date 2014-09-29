(function(p) {
	var TT = {};
	TT.LivePZ = {};
	
	TT.LivePZ.calcExpectation = function(ttrA, ttrB) {
		return 1/(1 + Math.pow(10, (ttrB - ttrA) / 150));
	}
	
	TT.LivePZ.calcDiff = function(oldValue, Ak, opponentValue, hasWon) {
		var expectation = TT.LivePZ.calcExpectation(oldValue, opponentValue);
		var result = hasWon ? 1.0 : 0.0;
		
		return Math.round((result - expectation) * Ak);
	}
	
	TT.start = function() {
		console.log("OK");
		console.log(TT.LivePZ.calcDiff(1198, 24, 1375, false));
	};
	
	TT["start"] = TT.start;
		
	
	p["TT"] = TT;
})(window);
