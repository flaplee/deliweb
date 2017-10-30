// util
'use strict';
define([], function() {
    var util = {
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
        util.alert = function(text, callback) { //alert对话框
            openDialog('alert', text, callback);
        };
        util.confirm = function(text, callback) { //yes no对话框
            openDialog('confirm', text, callback);
        };
        util.htmlDialog = function(html, className, callback) { //自定义内容的对话框
            openDialog(className || '', html, callback);
        };
        util.closeDialog = function(param) { //通用对话框关闭方法
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
                util[a.shift()].apply(util, a);
            }
        };
        util.showLoading = function(text) { //loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
            loadingCtn.querySelector('div').lastChild.data = text ? text : '加载中...';
            if (loadingRT === 0) {
                loadingCtn.style.visibility = 'visible';
                document.body.classList.add('mask');
            }
            loadingRT++;
        };
        util.hideLoading = function() {
            if (loadingRT > 0) {
                loadingRT--;
                if (loadingRT === 0) {
                    loadingCtn.style.visibility = '';
                    unmask();
                    if (typeof util.dialogEvents.onloaded === 'function') {
                        util.dialogEvents.onloaded({
                            type: 'loaded'
                        });
                    }
                }
            }
        };
        util.isLoading = function() {
            return loadingRT > 0;
        };
        util.hint = function(text, t) { //底部提示, 不干扰用户操作, 默认显示5秒
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
        util.dialogEvents = {};
        //dialogClose.appendChild(util.makeSvg('close'));
        dialogClose.addEventListener('click', util.closeDialog, false);
        dialogBox.querySelector(':scope>.btns>.yes').addEventListener('click', util.closeDialog, false);
        dialogBox.querySelector(':scope>.btns>.no').addEventListener('click', function() {
            util.closeDialog();
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
                            util.closeDialog();
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

    ! function() {
        //fix ios overscrolling on viewport issue
        util.fixIosScrolling = function(o) {
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

        util.getScrollHeight = function(o) {
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

        function cancelEvent(evt) {
            evt.preventDefault();
        }

        function stopEvent(evt) {
            evt.stopPropagation();
        }
    }();

    ! function() {
        util.listeners = {
            add: function(o, e, f) {
                if (!o.xEvents) {
                    o.xEvents = function(evt) { //override internal event manager
                        xEventProcessor(o, evt);
                    };
                }
                if (!o.xEvents[e]) {
                    o.xEvents[e] = [];
                    o.xEvents[e].stack = [];
                    o.xEvents[e].locked = false;
                    if (o.addEventListener) {
                        o.addEventListener(e, o.xEvents, false);
                    } else if (o.attachEvent) {
                        o.attachEvent('on' + e, o.xEvents);
                    } else {
                        o['on' + e] = o.xEvents;
                    }
                }
                if (o.xEvents[e].locked) {
                    o.xEvents[e].stack.push([false, f]);
                } else {
                    if (o.xEvents[e].indexOf(f) < 0) {
                        o.xEvents[e].push(f);
                    }
                }
            },
            list: function(o, e) {
                var r, n;
                if (e) {
                    if (o.xEvents && o.xEvents[e]) {
                        r = o.xEvents[e].slice(0);
                    } else {
                        r = [];
                    }
                } else {
                    r = {};
                    if (o.xEvents) {
                        for (n in o.xEvents) {
                            if (o.xEvents[n] instanceof Array && o.xEvents[n].length > 0) {
                                r[n] = o.xEvents[n].slice(0);
                            }
                        }
                    }
                }
                return r;
            },
            remove: function(o, e, f) {
                var n, addRemoveMark;
                if (o.xEvents) {
                    if (e) {
                        if (o.xEvents[e]) {
                            if (o.xEvents[e].locked) {
                                if (f) {
                                    o.xEvents[e].stack.push([true, f]);
                                } else {
                                    o.xEvents[e].stack.push(null);
                                }
                            } else {
                                if (f) {
                                    var tmp = o.xEvents[e].indexOf(f);
                                    if (tmp !== -1) {
                                        o.xEvents[e].splice(tmp, 1);
                                    }
                                } else {
                                    o.xEvents[e].splice(0, o.xEvents[e].length);
                                }
                            }
                            if (o.xEvents[e].length === 0) {
                                delete o.xEvents[e];
                                if (o.removeEventListener) {
                                    o.removeEventListener(e, o.xEvents, false);
                                } else if (o.detachEvent) {
                                    o.detachEvent('on' + e, o.xEvents);
                                } else {
                                    o['on' + e] = null;
                                }
                            }
                        }
                    } else {
                        if (!o.xEvents.removeMark) {
                            for (n in o.xEvents) {
                                if (!o.xEvents[n].locked) {
                                    delete o.xEvents[n];
                                    if (o.removeEventListener) {
                                        o.removeEventListener(n, o.xEvents, false);
                                    } else if (o.detachEvent) {
                                        o.detachEvent('on' + n, o.xEvents);
                                    } else {
                                        o['on' + n] = null;
                                    }
                                } else {
                                    addRemoveMark = true;
                                }
                            }
                            if (addRemoveMark) {
                                o.xEvents.removeMark = true;
                            } else {
                                o.xEvents = null;
                            }
                        }
                    }
                }
            }
        };

        function xEventProcessor(o, evt) {
            o.xEvents[evt.type].locked = true;
            for (var i = 0; i < o.xEvents[evt.type].length; i++) {
                o.xEvents[evt.type][i].call(o, evt);
            }
            o.xEvents[evt.type].locked = false;
            while (o.xEvents[evt.type].stack.length > 0) {
                if (o.xEvents[evt.type].stack[0]) {
                    var tmp = o.xEvents[evt.type].indexOf(o.xEvents[evt.type].stack[0][1]);
                    if (o.xEvents[evt.type].stack[0][0]) {
                        if (tmp !== -1) {
                            o.xEvents[evt.type].splice(tmp, 1);
                        }
                    } else {
                        if (tmp === -1) {
                            o.xEvents[evt.type].push(o.xEvents[evt.type].stack[0][1]);
                        }
                    }
                } else {
                    o.xEvents[evt.type].splice(0, o.xEvents[evt.type].length);
                }
                o.xEvents[evt.type].stack.shift();
            }
            if (o.xEvents[evt.type].length === 0) {
                delete o.xEvents[evt.type];
                if (o.removeEventListener) {
                    o.removeEventListener(evt.type, o.xEvents, false);
                } else if (o.detachEvent) {
                    o.detachEvent('on' + evt.type, o.xEvents);
                } else {
                    o['on' + evt.type] = null;
                }
            }
            if (o.xEvents.removeMark) {
                delete o.xEvents.removeMark;
                for (var n in o.xEvents) {
                    delete o.xEvents[n];
                    if (o.removeEventListener) {
                        o.removeEventListener(n, o.xEvents, false);
                    } else if (o.detachEvent) {
                        o.detachEvent('on' + n, o.xEvents);
                    } else {
                        o['on' + n] = null;
                    }
                }
                o.xEvents = null;
            }
        }
    }();

    window.util = util;

    return util;
});