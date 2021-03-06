define(function(require, o, e) {
	function t() {
		return navigator.userAgent.toLowerCase().indexOf("samsung gt-i9505") > -1
	}
	function i(o) {
		function e(o) {
			o.header && r.dialogBox.append(r.header), o.body && r.dialogBox.append(r.body), o.okBtn && r.footer.append(r.okBtn), o.cancelBtn && r.footer.append(r.cancelBtn), o.footer && r.dialogBox.append(r.footer)
		}
		function i() {
			var o = a(".dialog-box").height(),
				e = (r.oh - o) / 3;
			a(".dialog-box").css({
				top: e
			})
		}
		function d(o) {
			o.preventDefault()
		}
		function l() {
			r.body.html(a('<span class="dialog-message">' + r.body.html() + "</span>")).prepend(r.icon), "center" === s.align && "" === s.mood && r.body.find(".dialog-message").css("display", "inline-block"), r.body.css("text-align", s.align)
		}
		var n = {
			type: "confirm",
			title: "",
			message: "",
			style: "",
			width: "",
			messageSize: "1.8rem",
			okText: "确认",
			cancelText: "取消",
			mood: "",
			iconW: "70px",
			align: "center",
			okCallback: function() {},
			cancelCallback: function() {},
			onload: function() {}
		};
		a(".dialog-box").length && (a("#dialogStyle").remove(), a(".dialog-mask").remove(), a(".dialog-box").remove(), clearTimeout(showtimeout), clearTimeout(hidetimeout));
		var s = a.extend({}, n, o);
		showtimeout = void 0, hidetimeout = void 0;
		var r = {
			ow: document.documentElement.clientWidth,
			oh: document.documentElement.clientHeight,
			fontSize: "1.5rem",
			color: "#666",
			mask: a('<div class="dialog-mask"></div>'),
			dialogBox: a('<div class="dialog-box ' + s.style + '"></div>'),
			header: a('<div class="dialog-header"></div>'),
			body: a('<div class="dialog-body"></div>'),
			footer: a('<div class="dialog-footer"></div>'),
			okBtn: a('<div class="dialog-ok"></div>'),
			cancelBtn: a('<div class="dialog-cancel"></div>'),
			icon: a('<span class="' + ("positive" === s.mood ? "dialog-icon icon-tk-tick" : "negative" === s.mood ? "dialog-icon icon-tk-X" : "") + '"></span>')
		};
		r.maskCss = ".dialog-mask{position:fixed;top:0;left:0;right:0;bottom:0;width: 100%;height: 100%;background-color: rgba(0,0,0,0.3);z-index: 999;}", r.dialogCss = ".dialog-box{position: fixed;border:2px solid #505050;z-index: 100001;font-size:" + r.fontSize + ";color:" + r.color + ";width:" + (s.width || "60%") + ";left:50%;-webkit-transform: translateX(-50%);transform: translateX(-50%);opacity:0;-webkit-transition: opacity 0.6s; transition: opacity 0.6s;background-color:#363636;color:#fff;text-shadow:0 0 3px #000;" + (t() ? "" : "-webkit-box-shadow:0 2px 3px rgba(0,0,0,0.5);border-radius:12px;") + "}.dialog-header{height: 50px; border-bottom:1px solid #4b4b4b;}.dialog-body{max-height: 560px;overflow-y:auto;padding:20px;font-size:" + s.messageSize + ";}.dialog-footer{height: 80px; border-top: 1px solid #4b4b4b;font-size:" + s.messageSize + ";}.dialog-ok{width: 50%;text-align: center;float: left;line-height: 80px;}.dialog-cancel{width: 49%;border-left: 1px solid #4b4b4b;text-align: center;float: right;line-height: 80px;}.dialog-box.show{opacity:1;}.dialog-icon{font-size:3.0rem; padding-right:20px; vertical-align:middle;display:table-cell;width:" + s.iconW + ";text-align:right;color:#ddd;}.dialog-message{display:table-cell;text-align:left;}.dialog-open{overflow:hidden}.dialog-box.ios{background-color: #fff;color:#333;text-shadow: none;border:none}.dialog-box.ios .dialog-footer{color:#187EFB;border-color:#d4d4d4;}.dialog-box.ios{}", r.header.html(s.title), r.body.html(s.message), r.okBtn.html(s.okText), r.cancelBtn.html(s.cancelText);
		var c = {};
		switch (c.show = function() {
			a(".dialog-box").addClass("show"), "info" === s.type ? showtimeout = setTimeout(c.hide, 2e3) : "alert" === s.type ? a("body").addClass("dialog-open") : a(".dialog-mask").show().on({
				mousewheel: d,
				touchstart: d
			})
		}, c.hide = function() {
			a("body").removeClass("dialog-open"), "info" === s.type ? (a(".dialog-box").removeClass("show"), hidetimeout = setTimeout(function() {
				a("#dialogStyle").remove(), a(".dialog-mask").remove(), a(".dialog-box").remove()
			}, 800)) : (a("#dialogStyle").remove(), a(".dialog-mask").remove(), a(".dialog-box").remove())
		}, s.type) {
		case "confirm":
			l(), e({
				body: r.body,
				footer: r.footer,
				okBtn: r.okBtn,
				cancelBtn: r.cancelBtn
			});
			break;
		case "info":
			l(), e({
				body: r.body
			}), r.mask = "", r.dialogBox.css({
				"background-color": "rgba(0,0,0,0.6)",
				color: "#fff",
				border: "none",
				"border-radius": "5px",
				"text-align": "center"
			});
			break;
		case "alert":
			l(), e({
				body: r.body,
				footer: r.footer,
				okBtn: r.okBtn
			}), r.okBtn.css("width", "100%");
			break;
		case "custom":
			e({
				header: r.header,
				body: r.body,
				footer: r.footer,
				okBtn: r.okBtn,
				cancelBtn: r.cancelBtn
			});
			break;
		case "loading":
			l(), e({
				body: r.body
			}), r.dialogBox.css({
				"background-color": "rgba(0,0,0,0.6)",
				color: "#fff",
				border: "none",
				"border-radius": "5px",
				"text-align": "center"
			})
		}
		r.okBtn.click(function() {
			var o = s.okCallback();
			"stop" != o && c.hide()
		}), r.cancelBtn.click(function() {
			s.cancelCallback(), "stop" != stop && c.hide()
		}), a(document).find("head").append('<style id="dialogStyle"></style>'), a("#dialogStyle").text(r.maskCss + r.dialogCss), a("body").append(r.mask).append(r.dialogBox), i(), c.show(), "loading" == s.type && s.onload(c)
	}
	var a = require("zepto");
	e.exports = i
});