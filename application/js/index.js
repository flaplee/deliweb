seajs.config({
    base: '/',
    alias: {
        zepto: 'js/zepto.min.js',
        fastclick: 'js/fastclick.js',
        swiper: 'js/swiper.jquery.min.js',
        pointerevents: 'js/pointerevents.js',
        touchguesture: 'js/touchguesture.js',
        touchslider: 'js/touchslider.js'
    }
});
seajs.use(['zepto', 'fastclick', 'swiper', 'pointerevents', 'touchguesture', 'touchslider'], function($, fastclick, swiper, pointerevents, touchguesture, touchslider) {
    var Page = {
        init: function() {


            function setupWebViewJavascriptBridge(callback) {
                if (window.WebViewJavascriptBridge) {
                    return callback(WebViewJavascriptBridge);
                }
                if (window.WVJBCallbacks) {
                    return window.WVJBCallbacks.push(callback);
                }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() {
                    document.documentElement.removeChild(WVJBIframe)
                }, 0)
            };
            setupWebViewJavascriptBridge(function(bridge) {});


            var self = this;
            FastClick.attach(document.body);
            self.bindEvt();
        },
        bindEvt: function() {
            var self = this;
            var kernel = {};
            var browser = (function() {
                'use strict';
                var M, browser = {
                    platform: 'unknown',
                    name: 'unsupported',
                    version: 0
                };
                if (navigator.userAgent.match(/Android/)) {
                    browser.platform = 'Android';
                    if (M = navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/)) {
                        browser.name = M[1];
                        browser.version = M[2];
                    }
                } else if (M = navigator.userAgent.match(/(iPhone|iPad|iPod)(?: Touch)?; CPU(?: iPhone)? OS ([\d_\.]+)/)) {
                    browser.platform = M[1];
                    browser.name = 'IOS';
                    browser.version = M[2].replace(/_/g, '.');
                } else if (navigator.userAgent.match(/Windows/)) {
                    browser.platform = 'Windows';
                    if (M = navigator.userAgent.match(/(Trident)\/([\d\.]+).+Touch/)) {
                        browser.name = M[1];
                        browser.version = M[2];
                    } else if ((navigator.maxTouchPoints || window.TouchEvent) && (M = navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/))) {
                        browser.name = M[1];
                        browser.version = M[2];
                    }
                }
                if (navigator.userAgent.match(/QQ\/[\d\.]+/i)) {
                    browser.app = 'QQ';
                } else if (navigator.userAgent.match(/micromessenger\/[\d\.]+/i)) {
                    browser.app = 'WeChat';
                } else if (navigator.userAgent.match(/WeiBo/i)) {
                    browser.app = 'WeiBo';
                }
                if (window.top === window) {
                    var s, t, sw, ww;
                    if (browser.name === 'Firefox') {
                        s = calcRato(Math.min(screen.width, screen.height));
                        document.write('<meta name="viewport" content="user-scalable=no, width=' + 100 / s + '%, initial-scale=' + s + ', maximum-scale=' + s + ', minimum-scale=' + s + '"/>');
                    } else if (browser.name === 'Trident') {
                        document.write('<meta name="viewport" content="width=device-width, user-scalable=no"/>');
                        document.documentElement.style.zoom = calcRato(Math.min(screen.width, screen.height));
                    } else {
                        t = document.createElement('meta');
                        t.name = 'viewport';
                        t.content = 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1';
                        document.head.appendChild(t);
                        sw = Math.min(screen.width, screen.height);
                        ww = Math.min(window.innerWidth, window.innerHeight);
                        if (sw >= ww * devicePixelRatio) {
                            document.documentElement.style.zoom = calcRato(sw / devicePixelRatio);
                        } else {
                            s = calcRato(sw);
                            t.content = 'user-scalable=no, width=' + 100 / s + '%, initial-scale=' + s + ', maximum-scale=' + s + ', minimum-scale=' + s;
                        }
                    }
                }
                return browser;

                function calcRato(sw) {
                    var step = 0.125;
                    var zoom = sw / 320;
                    //放大时不使用线性算法
                    if (zoom > 1) {
                        zoom = Math.floor(Math.sqrt(zoom) / step) * step;
                    }
                    return zoom;
                }
            })();
            // fix ios 
            ! function() {
                kernel.scrollReload = function(dom, func) {
                    kernel.fixIosScrolling(dom);
                    var y, st, reloadHint, scrolled;
                    var events = pointerevents(dom, function(evt) {
                        if (evt.type === 'start') {
                            if (events.pointers.length === 0 && ((dom.classList.contains('iosScrollFix') && dom.scrollTop === 1) || (!dom.classList.contains('iosScrollFix') && dom.scrollTop === 0))) {
                                y = evt.y;
                                window.addEventListener('scroll', scrolling, true);
                                return true;
                            }
                        } else {
                            if (scrolled) {
                                scrolled = false;
                                return true;
                            } else {
                                var h;
                                if (evt.y > y + 5) {
                                    if (!st) {
                                        st = true;
                                        end();
                                    }
                                    evt.domEvent.preventDefault();
                                    if (!reloadHint) {
                                        reloadHint = document.createElement('div');
                                        reloadHint.className = 'reloadHint';
                                        reloadHint.appendChild(kernel.makeSvg('refresh'));
                                        dom.appendChild(reloadHint);
                                    }
                                    h = reloadHint.offsetHeight || reloadHint.clientHeight;
                                    if (evt.y - y < h * 2) {
                                        reloadHint.style.top = evt.y - y - h + 'px';
                                        reloadHint.classList.remove('pin');
                                        reloadHint.style.opacity = (evt.y - y) / h / 2;
                                        reloadHint.style[kernel.names.transform] = 'rotate(' + 360 * reloadHint.style.opacity + 'deg)';
                                    } else {
                                        reloadHint.style.top = h + 'px';
                                        reloadHint.style.opacity = 1;
                                        reloadHint.classList.add('pin');
                                        reloadHint.style[kernel.names.transform] = '';
                                    }
                                } else {
                                    if (evt.y < y && !st) {
                                        return true;
                                    } else if (reloadHint) {
                                        dom.removeChild(reloadHint);
                                        reloadHint = undefined;
                                    }
                                }
                                if (evt.type === 'end' || evt.type === 'cancel') {
                                    if (reloadHint) {
                                        dom.removeChild(reloadHint);
                                        if (reloadHint.classList.contains('pin')) {
                                            if (typeof func === 'function') {
                                                func();
                                            } else {
                                                kernel.reloadPage();
                                            }
                                        }
                                        reloadHint = undefined;
                                    }
                                    st = false;
                                }
                            }
                        }

                        function scrolling(evt) {
                            if (evt.target !== dom) {
                                scrolled = true;
                                end();
                            }
                        }

                        function end() {
                            window.removeEventListener('scroll', scrolling, true);
                        }
                    });
                };
                //fix ios overscrolling on viewport issue
                kernel.fixIosScrolling = function(o) {
                    var s, c;
                    if (browser.name === 'IOS') {
                        o.style.webkitOverflowScrolling = 'touch';
                        o.addEventListener('touchmove', stopEvent);
                        c = getComputedStyle(o);
                        if (c.overflowY === 'auto') {
                            o.classList.add('iosScrollFix');
                            if (c.display === 'none') {
                                s = o.style.display;
                                o.style.display = 'block';
                                o.scrollTop = 1;
                                o.style.display = s;
                            } else {
                                o.scrollTop = 1;
                            }
                            o.addEventListener('scroll', onscroll);
                        }
                    }
                };

                kernel.getScrollHeight = function(o) {
                    return o.classList.contains('iosScrollFix') ? o.scrollHeight - 1 : o.scrollHeight;
                };

                if (browser.name === 'IOS') {
                    window.addEventListener('touchmove', function(evt) {
                        evt.preventDefault();
                    });
                }

                //禁止各种scroll
                window.addEventListener('scroll', noscroll, false);
                document.documentElement.addEventListener('scroll', noscroll, false);
                document.body.addEventListener('scroll', noscroll, false);
                document.getElementById('page').addEventListener('scroll', noscroll, false);

                function onscroll(evt) {
                    if (this.scrollTop === 0) {
                        this.scrollTop = 1;
                    } else if (this.scrollTop + this.clientHeight === this.scrollHeight) {
                        this.scrollTop -= 1;
                    }
                }

                // 重置scroll
                function noscroll(evt) {
                    if (evt.target === this) {
                        if (this.scrollTo) {
                            this.scrollTo(0, 0);
                        } else {
                            this.scrollLeft = this.scrollTop = 0;
                        }
                    }
                }
            }();

            function cancelEvent(evt) {
                evt.preventDefault();
            }

            function stopEvent(evt) {
                evt.stopPropagation();
            }
            var dom = document.querySelector('#page>.content>.appdetail');
            kernel.scrollReload(dom);

            var token = self.getQuery('token');
            var swiper = new Swiper('.appdetail-device.swiper-container', {
                loop: false,
                pagination: '.swiper-pagination',
                slidesPerView: 3,
                paginationClickable: false,
                spaceBetween: 15, //30
                freeMode: false,
                onClick: function(swiper) {
                    var index = swiper.clickedIndex + 1;
                    var current = index ? index : 1;
                    deli.common.image.preview({
                        current: current,
                        urls: ["http://192.168.0.104:3001/images/device1.jpg", "http://192.168.0.104:3001/images/device2.jpg", "http://192.168.0.104:3001/images/device3.jpg", "http://192.168.0.104:3001/images/device1.jpg", "http://192.168.0.104:3001/images/device2.jpg"]
                    }, function(data) {}, function(resp) {});
                },
                onInit: function(swiper) {},
                onSlideChangeEnd: function(swiper) {}
            });
            var swiperDev = new Swiper('.equdetail-device.swiper-container', {
                loop: true,
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
            // 处理多种形态对话框
            ! function() {
                var hintmo, callback,
                    loadingRT = 0,
                    dlgStack = [],
                    photoStatus = {},
                    loadingCtn = document.getElementById('loading'),
                    hintCtn = document.getElementById('hint'),
                    dialogCtn = document.getElementById('dialog'),
                    dialogBox = dialogCtn.querySelector('div'),
                    dialogContent = dialogBox.querySelector(':scope>.content'),
                    dialogClose = dialogBox.querySelector(':scope>.close');
                kernel.alert = function(text, callback) { //alert对话框
                    openDialog('alert', text, callback);
                };
                kernel.confirm = function(text, callback) { //yes no对话框
                    openDialog('confirm', text, callback);
                };
                kernel.htmlDialog = function(html, className, callback) { //自定义内容的对话框
                    openDialog(className || '', html, callback);
                };
                kernel.closeDialog = function(param) { //通用对话框关闭方法
                    var a;
                    window.removeEventListener('resize', syncDialogSize, false);
                    dialogCtn.style.visibility = '';
                    unmask();
                    if (typeof callback === 'function') {
                        callback(param);
                    }
                    while (dialogContent.childNodes.length) {
                        dialogContent.removeChild(dialogContent.lastChild);
                    }
                    callback = undefined;
                    if (dlgStack.length) {
                        a = dlgStack.shift();
                        kernel[a.shift()].apply(kernel, a);
                    }
                };
                kernel.showLoading = function(text) { //loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
                    loadingCtn.querySelector('div').lastChild.data = text ? text : '加载中...';
                    if (loadingRT === 0) {
                        loadingCtn.style.visibility = 'visible';
                        document.body.classList.add('mask');
                    }
                    loadingRT++;
                };
                kernel.hideLoading = function() {
                    if (loadingRT > 0) {
                        loadingRT--;
                        if (loadingRT === 0) {
                            loadingCtn.style.visibility = '';
                            unmask();
                            if (typeof kernel.dialogEvents.onloaded === 'function') {
                                kernel.dialogEvents.onloaded({
                                    type: 'loaded'
                                });
                            }
                        }
                    }
                };
                kernel.isLoading = function() {
                    return loadingRT > 0;
                };
                kernel.hint = function(text, t) { //底部提示, 不干扰用户操作, 默认显示5秒
                    hintCtn.querySelector(':scope>.text').firstChild.data = text;
                    if (hintmo) {
                        clearTimeout(hintmo);
                    } else {
                        hintCtn.style.opacity = 1;
                    }
                    hintmo = setTimeout(function() {
                        hintCtn.style.opacity = '';
                        hintmo = undefined;
                    }, t ? t : 5000);
                };
                //目前只有loaded事件
                kernel.dialogEvents = {};
                //dialogClose.appendChild(kernel.makeSvg('close'));
                dialogClose.addEventListener('click', kernel.closeDialog, false);
                dialogBox.querySelector(':scope>.btns>.yes').addEventListener('click', kernel.closeDialog, false);
                dialogBox.querySelector(':scope>.btns>.no').addEventListener('click', function() {
                    kernel.closeDialog();
                }, false);

                function unmask() {
                    if (dialogCtn.style.visibility === '' && loadingCtn.style.visibility === '') {
                        document.body.classList.remove('mask');
                    }
                }

                function openDialog(type, content, cb) {
                    if (dialogCtn.style.visibility === 'visible') {
                        dlgStack.push([type, content, cb]);
                    } else {
                        dialogBox.className = type;
                        if (type === 'alert' || type === 'confirm') {
                            dialogContent.textContent = content;
                        } else {
                            if (typeof content === 'string') {
                                dialogContent.innerHTML = content;
                            } else {
                                dialogContent.appendChild(content);
                            }
                            document.body.addEventListener('click', function(event) {
                                var target = event.target;
                                if (target.id && target.id == 'dialog') {
                                    kernel.closeDialog();
                                }
                            }, false);
                        }
                        window.addEventListener('resize', syncDialogSize, false);
                        syncDialogSize();
                        document.body.classList.add('mask');
                        dialogCtn.style.visibility = 'visible';
                        callback = cb;
                    }
                }

                function syncDialogSize() {
                    dialogBox.style.width = dialogBox.style.height = '';
                    dialogBox.style.bottom = dialogBox.style.right = 'auto';
                    dialogBox.style.width = dialogBox.offsetWidth + 'px';
                    dialogBox.style.height = dialogBox.offsetHeight + 'px';
                    dialogBox.style.bottom = dialogBox.style.right = '';
                }
            }();

            // flex 处理随容器滑动
            /*! function() {
                var p = {};

                function e(e) {
                    0 === this.scrollTop ? this.scrollTop = 1 : this.scrollTop + this.clientHeight === this.scrollHeight && (this.scrollTop -= 1)
                }
                p.fixIosScrolling = function(t) {
                        "IOS" === browser.name && (t.classList.add("iosScrollFix"),
                            t.scrollTop = 1,
                            t.addEventListener("scroll", e, !1))
                    },
                    p.getScrollHeight = function(e) {
                        return "IOS" === browser.name ? e.scrollHeight - 1 : e.scrollHeight
                    },
                    "IOS" === browser.name && window.addEventListener("touchmove", function(e) {
                        for (var t = e.target; t != document.body;) {
                            if (t.classList.contains("iosScrollFix") || t.classList.contains("hScroll"))
                                return;
                            t = t.parentNode
                        }
                        e.preventDefault()
                    }, !1)
            }();*/

            //kernel.hint('提示框 Toast');
            //kernel.showLoading('正在加载中...');
            //kernel.hideLoading();
            //kernel.alert('kernel alert');
            //kernel.confirm('您还不是该团队的管理员，无法直接添加应用，是否推荐团队管理员开通？', function(sure) {if (sure) {kernel.closeDialog();}});
            /*kernel.htmlDialog('\
                <div id="switch">\
                <div id="switchPersonal">\
                    <a href="javascript:;">暂无团队，创建团队？</a>\
                </div>\
                <div id="switchGroup">\
                    <a href="javascript:;">个人</a>\
                </div>\
            </div>','switchGroup');*/
            /* detail */
            var $page = $('#page'),
                $detail = $page.find('.content > .appdetail'),
                $detailItem = $detail.find('.appdetail-item'),
                $detailItemIcon = $detailItem.find('.appdetail-icon'),
                $detailItemInfo = $detailItem.find('.appdetail-info'),
                $detailBannerInner = $detail.find('.appdetail-banner .appdetail-device .appdetail-device-inner'),
                $detailIntroduce = $detail.find('.appdetail-introduce'),
                $introduceCont = $detailIntroduce.find('.introduce-content'),
                $introduceMore = $introduceCont.find('.introduce-more'),
                $detailBase = $detail.find('.appdetail-base .base-device-list'),
                $detailBtns = $page.find('.navmenu > .btns'),
                $btnAdd = $detailBtns.find('.btn-add'),
                $btnAdded = $detailBtns.find('.btn-added'),
                $btnSwitch = $detailBtns.find('.btn-switch'),
                $btnRelated = $detailBtns.find('.btn-related');
            $introduceMore.on('click', function() {
                var c = $(this);
                $introduceCont.find('p.content-inner').addClass('content-show');
                c.hide();
            });
            $btnAdd.on('click', function() {
                initDetailBtn($(this), 'add', '');
            });
            $btnAdded.on('click', function() {
                initDetailBtn($(this), 'added', '');
            });
            $btnSwitch.on('click', function() {
                initDetailBtn($(this), 'switch', '');
            });
            $btnRelated.on('click', function() {
                initDetailBtn($(this), 'related', '');
            });

            /* 处理底部按钮 */
            var initDetailBtn = function($dom, type, data) {
                var data = {
                    "app_type": 'group',
                    "organization": [{
                        "id": 350236083323142140,
                        "name": "得力团队",
                        "address": null,
                        "admin_id": 349944153787858940,
                        "top_department_id": 352479983001665540
                    }, {
                        "id": 353186249789407200,
                        "name": "得力团队2",
                        "address": "武汉",
                        "admin_id": 349944153787858940,
                        "top_department_id": 353186249789407200
                    }, {
                        "id": 353186418056495100,
                        "name": "得力团队3",
                        "address": "武汉",
                        "admin_id": 349944153787858940,
                        "top_department_id": 353186418056495100
                    }]
                };
                getUserOrg(self.getQuery('userid'), self.buildHash(self.getQuery('token')), function(data) {
                    var userme = {
                        "code": 0,
                        "msg": null,
                        "data": {
                            "result": {
                                "id": 369251664315547648,
                                "update_time": 1508078057136,
                                "avatar_url": null,
                                "name": "15914122072",
                                "mobile_region": "86",
                                "mobile": "15914122072",
                                "gender": null,
                                "birthday": "",
                                "region_code": "",
                                "region_name": null,
                                "status": 1
                            },
                            "organization": [{
                                "id": 369252015785639936,
                                "name": "得力团队",
                                "address": "",
                                "admin_id": 369251664315547648,
                                "top_department_id": 369252015789834240
                            }]
                        }
                    };
                    var permissionApp = {
                        "code": 0,
                        "msg": null,
                        "data": {
                            "result": 3
                        }
                    };
                    var v1app = {
                        "code": 0,
                        "msg": null,
                        "data": {
                            "result": {
                                "id": 355373255801962496,
                                "name": "考勤假期管理",
                                "app_type": "group",
                                "auth_level": "high",
                                "category": "um",
                                "slogan": "Hello",
                                "producer_id": 367342845939417088,
                                "app_url": "http://zmvision.cn",
                                "web_url": "http://xx.xx",
                                "app_key": "acTMIYs8bHww6Zq9AUd5tfNI",
                                "web_hook": "http://xx.xx",
                                "status": "y",
                                "update_by": 355309590155362304,
                                "update_time": 1504769186695
                            }
                        }
                    };
                    var isbindApp = {
                        "code": 0,
                        "msg": null,
                        "data": {
                            "result": false
                        }
                    };
                    switch (type) {
                        case 'add':
                            var targetHtml = '';
                            //kernel.alert('您没有xx组织的添加应用权限，请联系管理员添加，管理员是 xxx');
                            if (data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    targetHtml += '<a href="javascript:;" data-orgid="' + data[i].id + '">' + data[i].name + '</a>';
                                }
                            }
                            kernel.htmlDialog('\
                                <div id="switch">\
                                <div id="switchPersonal">\
                                    ' + targetHtml + '\
                                </div>\
                                <div id="switchGroup">\
                                    <a href="javascript:;" data-orgid="">个人</a>\
                                </div>\
                            </div>'.replace(/   |  /g, ''), 'switchGroup');
                            $('#switchPersonal a').on('click', function() {
                                var c = $(this);
                                kernel.showLoading();
                                $.ajax({
                                    type: "POST",
                                    url: "/v1.0/app/bind",
                                    "headers": {
                                        "Dauth": self.getQuery('userid') + ' ' + (new Date().valueOf()) + ' ' + self.buildHash(self.getQuery('token'))
                                    },
                                    data: {
                                        "org_id": self.getQuery('orgid'),
                                        "app_id": self.getQuery('appid')
                                    },
                                    dataType: "json",
                                    success: function(res) {
                                        kernel.hideLoading();
                                        kernel.hint('应用添加成功~');
                                        if (res.code == 0) {
                                            initDetailBtn($dom, type, data);
                                        } else {
                                            kernel.hint(res.msg);
                                        }
                                    }
                                });
                            });
                            $('#switchGroup a').on('click', function() {
                                var c = $(this);
                                kernel.showLoading();
                                $.ajax({
                                    type: "POST",
                                    url: "/v1.0/app/bind",
                                    "headers": {
                                        "Dauth": self.getQuery('userid') + ' ' + (new Date().valueOf()) + ' ' + self.buildHash(self.getQuery('token'))
                                    },
                                    data: {
                                        "org_id": self.getQuery('orgid'),
                                        "app_id": self.getQuery('appid')
                                    },
                                    dataType: "json",
                                    success: function(res) {
                                        kernel.hideLoading();
                                        if (res.code == 0) {
                                            initDetailBtn($dom, type, data);
                                        } else {
                                            kernel.hint(res.msg);
                                        }
                                    }
                                });
                            });
                            break;
                        case 'added':
                            kernel.hint('当前组织已经添加过该应用');
                            break;
                        case 'related':
                            kernel.confirm('您还不是该团队的管理员，无法直接添加应用，是否推荐团队管理员开通？', function(sure) {
                                if (sure) {
                                    kernel.closeDialog();
                                    kernel.hint('已发送推荐开通通知啦');
                                }
                            });
                            break;
                    }
                });
            };

            /* 获取应用信息 */
            var getInitData = function(id) {
                $.ajax({
                    type: "GET",
                    url: "/v1.0/app/" + id,
                    dataType: "json",
                    success: function(res) {
                        // initDetailBtn($dom, type, data);
                        if (res.code == 0) {
                            var data = res.data.result,
                                innerHTML = '',
                                targetHtml = '',
                                deviceHtml = '';
                            data.app_content = "给团队所有人发送通知，在团队成员不主动取消展示的情况下长期展示",
                                data.app_introduce = "智能考勤管理系统是指一套管理公司的员工的上下班考勤记录等相关情况的管理系统。是考勤软件与考勤硬件结合的产品，一般为HR部门使用，掌握并管理企智能考勤管理系统是指一套管理公司的员工的上下班考勤记录等相关情况的管理系统。是考勤软件与考勤硬件结合的产品，一般为HR部门使用，掌握并管理企智能考勤管理系统是指一套管理公司的员工的上下班考勤记录等相关情况的管理系统。是考勤软件与考勤硬件结合的产品，一般为HR部门使用，掌握并管理企智能考勤管理系统是指一套管理公司的员工的上下班考勤记录等相关情况的管理系统。是考勤软件与考勤硬件结合的产品，一般为HR部门使用，掌握并管理企。",
                                data.app_device = [{
                                    "dev_icon": "http://192.168.0.104:3001/images/logo.png",
                                    "dev_name": "智能考勤机",
                                    "dev_url": "http://192.168.0.104:3000/"
                                }];
                            data.is_department_admin = true;
                            data.status = 0;

                            $detailItemInfo.find('.appdetail-title').text(data.name);
                            $detailItemInfo.find('.appdetail-content').text(data.app_content);
                            switch (data.app_type) {
                                case 'group':
                                    innerHTML = '<span class="appdetail-category-name">团队可用</span>';
                                    break;
                                case 'user':
                                    innerHTML = '<span class="appdetail-category-name">个人可用</span>';
                                    break;
                                case 'both':
                                    innerHTML = '<span class="appdetail-category-name">团队可用</span><span class="appdetail-category-name">个人可用</span>';
                                    break;
                            }
                            $detailItemInfo.find('.appdetail-category').html(innerHTML);
                            $detailBase.children('.base-device').remove();
                            if (data.app_device) {
                                for (var i = 0; i < data.app_device.length; i++) {
                                    deviceHtml += '<a class="base-device" href="' + data.app_device[i].dev_url + '">\
                                        <div class="device-icon">\
                                          <img src="' + data.app_device[i].dev_icon + '">\
                                        </div>\
                                        <div class="device-title">' + data.app_device[i].dev_name + '</div>\
                                      </a>';
                                }
                                $detailBase.append(deviceHtml);
                            }
                        } else {}
                    }
                });
                /*var res = {
                    "code": 0,
                    "msg": null,
                    "data":{
                        "result":
                            {
                                "id": "355373255801962496",
                                "name": "考勤假期管理",
                                "app_type": "both",
                                "auth_level": "high",
                                "category": "um",
                                "slogan": "Hello",
                                "producer_id": "367342845939417088",
                                "app_url": "http://zmvision.cn",
                                "web_url": "http://xx.xx",
                                "app_key": "acTMIYs8bHww6Zq9AUd5tfNI",
                                "web_hook": "http://xx.xx",
                                "status": "y",
                                "update_by": "355309590155362304",
                                "update_time": "1504769186695",

                                "app_content":"给团队所有人发送通知，在团队成员不主动取消展示的情况下长期展示",
                                "app_introduce":"智能考勤管理系统是指一套管理公司的员工的上下班考勤记录等相关情况的管理系统。是考勤软件与考勤硬件结合的产品，一般为HR部门使用，掌握并管理企智能考勤管理系统是指一套管理公司的员工的上下班考勤记录等相关情况的管理系统。是考勤软件与考勤硬件结合的产品，一般为HR部门使用，掌握并管理企智能考勤管理系统是指一套管理公司的员工的上下班考勤记录等相关情况的管理系统。是考勤软件与考勤硬件结合的产品，一般为HR部门使用，掌握并管理企智能考勤管理系统是指一套管理公司的员工的上下班考勤记录等相关情况的管理系统。是考勤软件与考勤硬件结合的产品，一般为HR部门使用，掌握并管理企。",
                                "app_device":[
                                    {
                                        "dev_icon":"http://192.168.0.104:3001/images/logo.png",
                                        "dev_name":"智能考勤机",
                                        "dev_url":"http://192.168.0.104:3000/"
                                    }
                                ]
                            
                            }
                    }
                };*/
            };

            /* 获取当前用户可管理的组织 */
            var getAppIsAdmined = function(userid, orgid) {
                $.ajax({
                    "type": "GET",
                    "headers": {
                        "Dauth": self.getQuery('userid') + ' ' + (new Date().valueOf()) + ' ' + self.buildHash(self.getQuery('token'))
                    },
                    "url": "/v1.0/admin/group/" + orgid + "/permission/app",
                    "dataType": "JSON",
                    success: function(res) {
                        console.log("getAppIsAdmined res", res);
                        var data = JSON.parse(res);
                        if (data.code == 0) {
                            if (data.data['result'] != 0) {
                                $detailBtns.find('a').css('display', 'none') && $detailBtns.find('a.btn-add').css('display', 'block');
                            } else {
                                $detailBtns.find('a').css('display', 'none') && $detailBtns.find('a.btn-related').css('display', 'block');
                            }
                        } else {
                            kernel.hint(data.msg);
                        }
                    }
                });
            };

            /* 获取当前应用是否绑定 */
            var getAppIsBind = function(appid, orgid) {
                $.ajax({
                    "type": "GET",
                    "url": "/v1.0/app/isbind/app/" + appid + "/org/" + orgid + "",
                    "dataType": "JSON",
                    success: function(res) {
                        console.log("getAppIsBind res", res);
                        var data = JSON.parse(res);
                        if (data.code == 0) {
                            // update 2017-10-17 修改状态值调试页面
                            if (data.data['result'] == false) {
                                $detailBtns.find('a').css('display', 'none') && $detailBtns.find('a.btn-added').css('display', 'block');
                            } else {
                                getAppIsAdmined(self.getQuery('userid'), self.getQuery('orgid'));
                            }
                        }
                    }
                });
            };

            /* 获取当前用户组织*/
            var getUserOrg = function(userid, token, callback) {
                $.ajax({
                    "type": "GET",
                    "headers": {
                        "Dauth": userid + ' ' + (new Date().valueOf()) + ' ' + token
                    },
                    "url": "/v1.0/user/me",
                    "dataType": "JSON",
                    success: function(res) {
                        var data = JSON.parse(res);
                        var organization = data.data.organization;
                        if (typeof callback === 'function') {
                            callback(organization);
                        }
                    }
                });
            };
            getAppIsBind(self.getQuery('appid'), self.getQuery('orgid'));
            getInitData(self.getQuery('appid'));
        },
        getQuery: function(param) {
            var url = window.location.href;
            var searchIndex = url.indexOf('?');
            var searchParams = url.slice(searchIndex + 1).split('&');
            for (var i = 0; i < searchParams.length; i++) {
                var items = searchParams[i].split('=');
                if (items[0].trim() == param) {
                    return items[1].trim();
                }
            }
        },
        setUrlPort: function(port) {
            var protocol = location.protocol;
            var host = location.host;
            return protocol + '//' + host + ':' + port;
        },
        getTargetUrl: function(replaceUrl, targetUrl) {
            var protocol = location.protocol;
            var host = location.host;
            var pathname = location.pathname.replace(replaceUrl, targetUrl);
            return protocol + '//' + host + pathname;
        },
        buildHash: function(token) {
            var self = this;
            var hashLoc = window.location.search.substr(1) + token;
            var sha256 = self.SHA256(hashLoc);
            var hash = sha256.substr(0, 32);
            return hash;
        },
        SHA256: function(s) {
            var chrsz = 8;
            var hexcase = 0;

            function safe_add(x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }

            function S(X, n) {
                return (X >>> n) | (X << (32 - n));
            }

            function R(X, n) {
                return (X >>> n);
            }

            function Ch(x, y, z) {
                return ((x & y) ^ ((~x) & z));
            }

            function Maj(x, y, z) {
                return ((x & y) ^ (x & z) ^ (y & z));
            }

            function Sigma0256(x) {
                return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
            }

            function Sigma1256(x) {
                return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
            }

            function Gamma0256(x) {
                return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
            }

            function Gamma1256(x) {
                return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
            }

            function core_sha256(m, l) {
                var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
                var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
                var W = new Array(64);
                var a, b, c, d, e, f, g, h, i, j;
                var T1, T2;
                m[l >> 5] |= 0x80 << (24 - l % 32);
                m[((l + 64 >> 9) << 4) + 15] = l;
                for (var i = 0; i < m.length; i += 16) {
                    a = HASH[0];
                    b = HASH[1];
                    c = HASH[2];
                    d = HASH[3];
                    e = HASH[4];
                    f = HASH[5];
                    g = HASH[6];
                    h = HASH[7];
                    for (var j = 0; j < 64; j++) {
                        if (j < 16) W[j] = m[j + i];
                        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                        h = g;
                        g = f;
                        f = e;
                        e = safe_add(d, T1);
                        d = c;
                        c = b;
                        b = a;
                        a = safe_add(T1, T2);
                    }
                    HASH[0] = safe_add(a, HASH[0]);
                    HASH[1] = safe_add(b, HASH[1]);
                    HASH[2] = safe_add(c, HASH[2]);
                    HASH[3] = safe_add(d, HASH[3]);
                    HASH[4] = safe_add(e, HASH[4]);
                    HASH[5] = safe_add(f, HASH[5]);
                    HASH[6] = safe_add(g, HASH[6]);
                    HASH[7] = safe_add(h, HASH[7]);
                }
                return HASH;
            }

            function str2binb(str) {
                var bin = Array();
                var mask = (1 << chrsz) - 1;
                for (var i = 0; i < str.length * chrsz; i += chrsz) {
                    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
                }
                return bin;
            }

            function Utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            }

            function binb2hex(binarray) {
                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                var str = "";
                for (var i = 0; i < binarray.length * 4; i++) {
                    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                        hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                }
                return str;
            }
            s = Utf8Encode(s);
            return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
        }
    };
    Page.init();
});