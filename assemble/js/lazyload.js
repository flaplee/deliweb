define(function() {
	var t = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDQzA1MTVGNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDQzA1MTYwNkE2MjExRTRBRjEzODVCM0Q0NEVFMjFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkNDMDUxNUQ2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkNDMDUxNUU2QTYyMTFFNEFGMTM4NUIzRDQ0RUUyMUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6p+a6fAAAAD0lEQVR42mJ89/Y1QIABAAWXAsgVS/hWAAAAAElFTkSuQmCC",
		i = $("html").css("font-size").replace("px", "") - 0,
		n = [];
	return {
		init: Hnb.common.one(function() {
			var t = this;
			t.initUI(), t.registerEvent()
		}),
		registerEvent: function() {
			var t = this;
			setTimeout(function() {
				t.initImg(), t.loadImg()
			}, 0), $(window).on("scroll touchmove", Hnb.common.throttle(function() {
				t.loadImg()
			}, 300)), setInterval(function() {
				t.intImgSize(), t.loadImg()
			}, 500)
		},
		initImg: function(e) {
			e = e || $("body");
			for (var r = this, h = e.find("img"), o = h.length, c = 0; c < o; c++) {
				var A = $(h[c]),
					l = A.attr("hnb-src"),
					m = (A.attr("src"), A.attr("hnb-w") || A.attr("hnb-wrem") * i || A.parent().width() || 0),
					a = A.attr("hnb-r");
				l && !r.isInList(A) && (a ? (height = m * a, A.css({
					width: m,
					height: height
				}), A.removeClass("vh")) : A.addClass("vh"), A.attr("src", t), n.push({
					el: A,
					loaded: !1,
					src: l
				}))
			}
		},
		intImgSize: function() {
			for (var t in n) {
				var e = n[t].el;
				if (!e.width()) {
					var r = e.attr("hnb-w") || e.attr("hnb-wrem") * i || e.parent().width() || 0,
						h = e.attr("hnb-r");
					h && r && (height = r * h, e.css({
						width: r,
						height: height
					}), e.removeClass("vh"))
				}
			}
		},
		isInList: function(t) {
			for (var i in n) if (n[i].el[0] == t[0]) return !0;
			return !1
		},
		loadImg: function() {
			var t = n,
				i = window.pageYOffset || document.documentElement.scrollTop,
				e = window.innerHeight || document.documentElement.clientHeight,
				r = i + e;
			n = t.filter(function(t) {
				var n = t.src;
				if (!t.loaded) {
					var e = t.el,
						h = e.offset().top,
						o = e.offset().top + e.height();
					if (h < r && o > i) return e.attr("src", n), e.removeClass("vh"), t.loaded = !0, !1
				}
				return !0
			})
		},
		initUI: function() {}
	}
});