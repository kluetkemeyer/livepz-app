(function(p) {
	var undefined;
	var dummy = function() {};
	
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
	
	TT.LivePZ.List = {};
	
	TT.LivePZ.List.values = [];
	
	TT.LivePZ.List._sortByValue = function(a, b) {
		return b.value - a.value;
	};
	
	TT.LivePZ.List.loadFromWeb = function(callback) {
		$.get('api/livepz-all.json', function(data) {
			TT.LivePZ.List.clear();
			
			$.each(data, function(unused, record) {
				var player = {
					playerId: record['id'],
					name: record['name'],
					isMember: record['isMember'],
					club: record['isMember'] ? 'TSV Uetersen' : null,
					value: record['points']};
				TT.LivePZ.List.values.push(player);
			});
			TT.LivePZ.List.values.sort(TT.LivePZ.List._sortByValue);
			
			TT.LivePZ.List.saveToMemory(callback);
		});
	}
	
	TT.LivePZ.List.loadFromStorage = function(callback) {
		TT.LivePZ.List.clear();
		
		if (window.localStorage != undefined && window.JSON != undefined) {
			var data = JSON.parse(window.localStorage.getItem("livepz-data"));
			$.each(data, function(unused, record) {
				if (record != undefined) {
					TT.LivePZ.List.values.push({
						playerId: record["i"],
						name: record["n"],
						isMember: record["m"],
						club: record["c"],
						value: record["v"]});
				}
			});
		}
	
		callback();
	}
	
	TT.LivePZ.List.saveToMemory = function(callback) {
		if (window.localStorage != undefined && window.JSON != undefined) {
			var data = [];
			$.each(TT.LivePZ.List.values, function(unused, record) {
				data.push({
					"i": record.playerId,
					"n": record.name,
					"m": record.isMember,
					"c": record.club,
					"v": record.value});
			});
			window.localStorage.setItem("livepz-data", window.JSON.stringify(data));
		}
		callback();
	}
	
	TT.LivePZ.List.clear = function() {
		TT.LivePZ.List.values = [];
	}
	
	TT.UI = {};
	
	TT.UI.LivePZDiff = function(ui) {
		if (ui == undefined) {
			ui = $('<div />');
		}
		
		ui.addClass('livepz_diff');
		
		this.ui_ = ui;
		this.setValue(null);
	};
	TT.UI.LivePZDiff.CLS_PLUS = 'livepz_diff_plus';
	TT.UI.LivePZDiff.CLS_MINUS = 'livepz_diff_minus';
	TT.UI.LivePZDiff.CLS_NEUTRAL = 'livepz_diff_neutral';
	TT.UI.LivePZDiff.CLS_UNKNOWN = 'livepz_diff_unknown';
	TT.UI.LivePZDiff.CLS_ALL = [TT.UI.LivePZDiff.CLS_PLUS,
		TT.UI.LivePZDiff.CLS_MINUS,
		TT.UI.LivePZDiff.CLS_NEUTRAL,
		TT.UI.LivePZDiff.CLS_UNKNOWN];
	TT.UI.LivePZDiff.prototype.ui_;
	TT.UI.LivePZDiff.prototype.setValue = function(value) {
		var _this = this;
		$.each(TT.UI.LivePZDiff.CLS_ALL, function(unused, cls) {
			_this.ui_.removeClass(cls);
		});
		
		var cls = TT.UI.LivePZDiff.CLS_UNKNOWN;
		var text = '???';
		
		if (value == undefined) {
			text = '???';
		} else if (value == null) {
			text = '';
		} else if (value == 0) {
			cls = TT.UI.LivePZDiff.CLS_NEUTRAL;
			text = '0';
		} else if (value > 0) {
			cls = TT.UI.LivePZDiff.CLS_PLUS;
			text = '+' + value;
		} else {
			cls = TT.UI.LivePZDiff.CLS_MINUS;
			text = '' + value;
		}
		
		_this.ui_.text(text);
		_this.ui_.addClass(cls);
	};
	
	TT.UI.LivePZPage = function(id, club) {
		this.page_ = $('<div data-role="page"/>');
		this.title_ = $('<h1 />');
		this.list_ = $('<ul data-role="listview" data-filter="true" data-filter-placeholder="Suche..."/>');
		this.norecords_ = $('<p>Keine Einträge gefunden!</p>');
		this.norecords_.hide();
		
		this.page_.attr('id', id);
		
		var header = $('<div data-role="header" />');
		var reloadBtn = $('<a data-role="button" data-icon="refresh" class="ui-btn-right" href="#">update</a>');
		var body = $('<div role="main" class="ui-content" />');
		var filterField = $('<input type="text"  data-type="search" />');
		
		var thiz = this;
		
		var makeFilterCallback = function(list) {
			var lastDivider = null;
			var lastIndex;
			var items;
			
			return function(index, searchValue) {
				if (index == 0) {
					items = $('> li', list);
					lastDivider = null;
					lastIndex = items.length - 1;
				}
				searchValue = searchValue.trim().toLowerCase();
				
				// disable filter on empty search value
				if (searchValue == "") return false;
				
				
				var item = $(items[index]);
				if (item.attr('data-role') == 'list-divider') {
					if (lastDivider != null) {
						lastDivider.hide();
					}
					item.show();
					lastDivider = item;
				} else {
					var name = $('h3', item).text().trim().toLowerCase();
					if (name.indexOf(searchValue) >= 0) {
						lastDivider = null;
						return false;
					} else {
						if (index == lastIndex && lastDivider != null) {
							lastDivider.hide();
						}
						return true;
					}
				}
			};
		};
		
		this.list_.filterable({
			"children": "> li",
			"filterPlaceholder": "Suche...",
			"input": filterField,
			"filterCallback": makeFilterCallback(this.list_)});
		this.list_.listview({
			"inset": true,
			"autodividers": true,
			"autodividersSelector": function(elt) {
				var points = parseInt(elt.attr('data-livepz'));
				if (isNaN(points)) {
					return '???';
				} else {
					var hundreds = Math.floor(points / 100);
					return hundreds + '00 bis ' + hundreds + '99 Punkte';
				}
			}});
		this.page_
			.append(header.append(this.title_).append(reloadBtn))
			.append(body.append($('<p />').append(filterField))
				.append($('<p />').append(this.list_)).append(this.norecords_));
		
		this.title_.text('LivePZ List');
		this.page_.page();
		this.page_.appendTo($('body'));
		this.refresh();
		
		
		var _refresh = $.proxy(this.refresh, this);
		reloadBtn.click(function() {
			TT.LivePZ.List.loadFromWeb(_refresh);
		});
	};
	TT.UI.LivePZPage.prototype.records_;
	TT.UI.LivePZPage.prototype.page_;
	TT.UI.LivePZPage.prototype.title_;
	TT.UI.LivePZPage.prototype.norecords_;
	TT.UI.LivePZPage.prototype.show = function() {
		$.mobile.changePage(this.page_.attr('id'));
	};
	TT.UI.LivePZPage.prototype._matchesFilter = function(record) {
		return record.isMember;
	};
	TT.UI.LivePZPage.prototype.refresh = function() {
		this.list_.empty();
		this.records_ = [];
		
		var filter = this._matchesFilter;
		var records = this.records_;
		$.each(TT.LivePZ.List.values, function(unused, record) {
			if (record != undefined && filter(record)) {
				records.push(record);
			}
		});
		this.records_.sort(TT.LivePZ.List._sortByValue);
		
		if (this.records_.length == 0) {
			this.norecords_.show();
		} else {
			var list = this.list_;
			$.each(this.records_, function(index, record) {
				$('<li />')
					.append($('<p class="ui-li-aside ui-li-desc" data-role="livepz"/>').text('LivePZ: ' + record.value))
					.append($('<h3 class="ui-li-heading" />').text('#' + (index+1) + ': ' + record.name))
					.append($('<p class="ui-li-desc" />').text('' + record.club))
					.attr("data-livepz", record.value)
					.appendTo(list);
				
			});
			list.listview("refresh");
			this.norecords_.hide();
		}
	}
	
	TT.start = function() {
		TT.LivePZ.List.loadFromStorage(dummy);
	
		var page = new TT.UI.LivePZPage('ttlive0');
		page.show();
	};
	
	TT["start"] = TT.start;
		
	
	p["TT"] = TT;
})(window);
