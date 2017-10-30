define(["mod/ui/scrollMoreInfo"], function(a) {
	return {
		init: function() {
			var a = this;
			a.isSearching = !1, a.registerEvent()
		},
		registerEvent: function() {
			var e = this;
			$(".referBoxForm-i").click(function() {
				$("#id-search").val(""), $("#id-search").trigger("input")
			}), $("#id-search").on("input", function() {
				/\s*\d+\s*/.test($(this).val()) ? (Hnb.common.ajaxPost(WEB_ROOT + "/Australia_Tech/search", {
					type: "id",
					words: $(this).val()
				}).done(e.callback_search), history.replaceState("", "", WEB_ROOT + "/Australia_Tech?words=" + $(this).val())) : "" != $(this).val() ? (Hnb.common.ajaxPost(WEB_ROOT + "/Australia_Tech/search", {
					type: "chinese",
					words: $(this).val()
				}).done(e.callback_search), history.replaceState("", "", WEB_ROOT + "/Australia_Tech?words=" + $(this).val())) : (history.replaceState("", "", WEB_ROOT + "/Australia_Tech"), $(".category").removeClass("dn"), $(".searchBox").addClass("dn"))
			}), $("#id-search").trigger("input");
			var t = [];
			$.each($("#id-category").find("a"), function(a, e) {
				t.push($(this).attr("hnb-id"))
			}), e.scrollMore = a.create($("#id-category"), e.loadData, t, 10, $("#id-category-tmpl").html())
		},
		loadData: function(a, e) {
			var t = {
				start: a,
				num: e
			};
			return Hnb.common.ajaxPost(WEB_ROOT + "/australia_tech/scrollMore.html", t)
		},
		callback_search: function(a) {
			var e, t;
			if ($(".category").addClass("dn"), $(".searchBox").removeClass("dn"), $("#id-searchBox").children().remove(), 0 == a.data.length) $("#id-searchBox").append($("#id-errpage").children().clone()), $(".color-ff3e3e").html($("#id-search").val().replace(/</g, "&lt;").replace(/>/g, "&gt;")), $("#id-search-text").html("没有找到");
			else {
				var r = 0,
					i = 0;
				$(a.data).each(function() {
					t = [], t.push(this), "f_cn_job_description" in this ? (e = Hnb.ui.tmpl($("#id-profession-tmpl").html(), {
						arr_infoList: t
					}), r++) : (e = Hnb.ui.tmpl($("#id-category-tmpl").html(), {
						arr_infoList: t
					}), i++), $("#id-searchBox").append(e), $("#id-search-text").html("职业：" + r + "个，分类：" + i + "个。")
				})
			}
		}
	}
});