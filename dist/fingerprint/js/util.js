// util
'use strict';
define([], function() {
    Date.prototype.Diff = function(t, d, n) {
        var v, dt, dv;
        if (t === 'ms' || t === 'millisecond') {
            return this.valueOf() - Date.valueOf();
        } else if (t === 's' || t === 'second') {
            return Math.floor(this.valueOf() / 1000) - Math.floor(d.valueOf() / 1000);
        } else if (t === 'n' || t === 'minute') {
            return Math.floor(this.valueOf() / (60 * 1000)) - Math.floor(d.valueOf() / (60 * 1000));
        } else {
            if (typeof n === 'number') {
                if (n > 720) {
                    v = 720;
                } else if (n < -720) {
                    v = -720;
                } else {
                    v = n;
                }
            } else {
                v = this.getTimezoneOffset();
            }
            if (t === 'w' || t === 'week' || t === 'm' || t === 'month' || t === 'y' || t === 'year') {
                dt = this.Add('n', -1 * v, 0);
                dv = d.Add('n', -1 * v, 0);
                if (t === 'w' || t === 'week') {
                    dv = dv.Add('d', dt.getUTCDay() - dv.getUTCDay(), 0);
                    return dt.Diff('d', dv, 0) / 7;
                } else if (t === 'm' || t === 'month') {
                    return dt.Diff('y', dv, 0) * 12 + dt.getUTCMonth() - dv.getUTCMonth();
                } else {
                    return dt.getUTCFullYear() - dv.getUTCFullYear();
                }
            } else if (t === 'h' || t === 'hour') {
                return Math.floor((this.valueOf() - v * 60 * 1000) / (60 * 60 * 1000)) - Math.floor((d.valueOf() - v * 60 * 1000) / (60 * 60 * 1000));
            } else {
                return Math.floor((this.valueOf() - v * 60 * 1000) / (24 * 60 * 60 * 1000)) - Math.floor((d.valueOf() - v * 60 * 1000) / (24 * 60 * 60 * 1000));
            }
        }
    };
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
        formatDate: function(time, full) {
            var r;
            var t = new Date(time);
            var y = t.getFullYear();
            var m = t.getMonth() + 1;
            var d = t.getDate();
            if (full) {
                r = [t.getHours(), t.getMinutes(), t.getSeconds()];
                if (r[1] < 10) {
                    r[1] = '0' + r[1];
                }
                if (r[2] < 10) {
                    r[2] = '0' + r[2];
                }
                r = r.join(':');
                r = y + '年' + m + '月' + d + '日' + ' ' + r;
            } else {
                var diff = new Date().Diff('d', t);
                if (diff <= 2 && diff >= -2) {
                    r = [t.getHours(), t.getMinutes(), t.getSeconds()];
                    if (r[1] < 10) {
                        r[1] = '0' + r[1];
                    }
                    if (r[2] < 10) {
                        r[2] = '0' + r[2];
                    }
                    r = r.join(':');
                    if (diff === 1) {
                        r = '昨天' + r;
                    } else if (diff === 2) {
                        r = '前天' + r;
                    } else if (diff === -1) {
                        r = '明天' + r;
                    } else if (diff === -2) {
                        r = '后天' + r;
                    } else {
                        r = '今天' + r;
                    }
                } else {
                    r = y + '年' + m + '月' + d + '日';
                }
            }
            return r;
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
            dialogContent = dialogBox.querySelector('.content'),
            dialogClose = dialogBox.querySelector('.close');
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
            hintCtn.querySelector('.text').firstChild.data = text;
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
        dialogBox.querySelector('.btns>.yes').addEventListener('click', util.closeDialog, false);
        dialogBox.querySelector('.btns>.no').addEventListener('click', function() {
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
    
    window.util = util;

    return util;
});