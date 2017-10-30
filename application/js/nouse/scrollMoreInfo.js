define(function() {
	function t(t, e, r, a, n) {
		this.$wraper = t, this.loadDataFunc = e, this.originIds = r, this.tpl = n, this.isAppendIng = !1, this.perNum = a, this.leftData = []
	}
	return t.prototype = new Hnb.event, $.extend(t.prototype, {
		init: function() {
			var t = this;
			t.initData(), t.register()
		},
		initData: function() {
			var t = this;
			t.start = t.originIds.length, t.isEnd = !1, t.idRef = {};
			for (var e in t.originIds) t.originIds[e] && (t.idRef[t.originIds[e] + "_"] = !0)
		},
		register: function() {
			var t = this;
			$(window).scroll(function() {
				var e = $(window).height(),
					r = $(window).scrollTop(),
					a = t.$wraper.height();
				t.$wraper.hasClass("dn") || e + r > a + t.$wraper.offset().top - 100 && t.appendMoreData()
			}), $(window).trigger("scroll")
		},
		appendMoreData: function() {
			var t = this;
			if (!t.isAppendIng) if (t.leftData.length >= t.perNum) {
				var e = t.leftData.splice(0, t.perNum);
				t.renderData(e)
			} else if (t.isEnd) {
				if (0 == t.leftData.length) return void t.renderNoMore();
				var e = t.leftData.splice(0, t.perNum);
				t.renderData(e), 0 == t.leftData.length && t.renderNoMore()
			} else t.isAppendIng = !0, t._loadData().fail(function() {
				t.isEnd = !0
			}).always(function() {
				t.isAppendIng = !1, t.appendMoreData()
			})
		},
		renderNoMore: function() {
			var t = this;
			t.$wraper.find(".c-data-no-more").removeClass("dn"), t.$wraper.find(".c-data-loading").addClass("dn")
		},
		renderData: function(t) {
			var e = this,
				r = Hnb.ui.tmpl(e.tpl, {
					arr_infoList: t
				});
			e.$wraper.find(".c-data-loading").before(r), e.trigger("after:render:more:data")
		},
		_loadData: function() {
			var t = this,
				e = $.Deferred();
			return t.loadDataFunc(t.start, t.perNum).done(function(r) {
				r.state ? e.reject(-1) : (r.data.infoList.length < t.perNum && (t.isEnd = !0), t._storeData(r.data.infoList), e.resolve())
			}).fail(function() {
				e.reject(-1)
			}), t.start += t.perNum, e
		},
		_storeData: function(t) {
			var e = this;
			for (var r in t) t[r].id && !e.idRef[t[r].id + "_"] && (e.leftData.push(t[r]), e.idRef[t[r].id + "_"] = !0)
		}
	}), {
		create: function(e, r, a, n, i) {
			var o = new t(e, r, a, n, i);
			return o.init(), o
		}
	}
});