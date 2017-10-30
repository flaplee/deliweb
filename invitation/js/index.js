seajs.config({
    base: './',
    alias: {
        zepto: 'js/zepto.min.js',
        dialog: 'js/dialog.min.js',
        fastclick: 'js/fastclick.js',
        region: 'js/region.js'
    }
});
seajs.use(['zepto', 'dialog', 'fastclick', 'region'], function($, dialog, fastclick, region) {
    var Page = {
        params: {
            hintmo: 0
        },
        init: function() {
            var self = this;
            FastClick.attach(document.body);
            self.bindEvt();
        },
        bindEvt: function() {
            var self = this;
            var $page = $('#page'),
                $header = $page.find('header'),
                $avatar = $header.find('#avatar img'),
                $slogon = $header.find('#slogon'),
                $contInpt = $page.find('.content'),
                $contInptOne = $contInpt.filter('.content-input'),
                $contInptTwo = $contInpt.filter('.content-complete'),
                $phoneInput = $contInptOne.find('input#phone'),
                $nameInput = $contInptOne.find('input#name'),
                $reasonInput = $contInptOne.find('input#reason'),
                $codeInput = $contInptOne.find('input#captcha'),
                $code = $contInptOne.find('#code'),
                $phoneCode = $contInptOne.find('.phoneCode'),
                $areaCode = $phoneCode.find('span'),
                $submit = $contInptOne.find('#submit'),
                $submitDownload = $contInptOne.find('.download-app'),
                $popupAc = $('#areaCode'),
                $popupBack = $popupAc.find('.back'),
                $popupBox = $popupAc.find('.box'),
                $scroll = $popupBox.find('#scroll'),
                $navInner = $popupBox.find('.nav-right .nav-inner');
            var userName = decodeURIComponent(self.getQuery('name')),
                userAvatar = decodeURIComponent(self.getQuery('t')),
                deptId = decodeURIComponent(self.getQuery('o')),
                deptName = decodeURIComponent(self.getQuery('oname'));
            var areaCodeData = region.region;
                // 消息提示
                dialog.tip = function(msg) {
                    dialog({
                        type: 'info',
                        message: msg
                    })
                };
                $avatar.attr('src',userAvatar);
                $slogon.find('p .name').text(userName);
                $slogon.find('p.group').text(deptName);
            //数字验证码
            getCode('' + self.setUrlPort("9001") + '/v1.0/invitation/'+ deptId +'/code/public');
            $code.on('click', function() {
                getCode('' + self.setUrlPort("9001") + '/v1.0/invitation/'+ deptId +'/code/public');
            });
            $submit.on('click', function() {
                if ($phoneInput.val().length > 0 && $nameInput.val().length > 0 && $codeInput.val().length > 0) {
                    //to dolist
                    var data = {
                        "mobile_region": $phoneCode.find('span').data('region'),
                        "mobile": $phoneInput.val(),
                        "code": $codeInput.val(),
                        "name": $nameInput.val(),
                        "remark": $reasonInput.val()
                    };
                    $.ajax({
                        type: "GET",
                        url: "" + self.setUrlPort('9001') + "/v1.0/invitation/" + deptId + "/public",
                        data: data,
                        dataType: "jsonp",
                        jsonp: "callback",
                        success: function(res) {
                            if(res.code == 0){
                                $contInptOne.hide();
                                $contInptTwo.show();
                            }else{
                                dialog.tip(res.msg);
                            }
                        }
                    });
                    //$contInptOne.hide();
                    //$contInptTwo.show();
                } else {
                    dialog.tip('请填写正确信息');
                }
            });
            $phoneCode.on('click', function() {
                $page.css('display', 'none');
                $popupAc.css('display', 'block');
            });
            $popupBack.on('click', function() {
                $page.css('display', 'block');
                $popupAc.css('display', 'none');
            });
            
            /* 渲染国家或地区 */
            $scroll.children().remove();
            $navInner.children().remove();
            var reduceAreaData = function(data) {
                var self = this,
                    countrys = data,
                    i, hotList = [];
                for (i = 0; i < countrys.length; i++) {
                    if (countrys[i].isHot) {
                        hotList.push(countrys[i]);
                    }
                }
                self.areaKey = ['HOT'];
                self.areaMap = {
                    'HOT': hotList
                };
                for (i = 65; i <= 90;) {
                    self.areaMap[String.fromCharCode(i)] = [];
                    self.areaKey.push(String.fromCharCode(i++));
                }
                self.areaCode = countrys.reduce(function(pre, next) {
                    var spellFirst = next.spellFirst.toUpperCase();
                    pre[spellFirst].push(next);
                    return pre;
                }, self.areaMap);
                renderAreaList();
            };
            var renderAreaList = function() {
                var self = this,
                    $areaCode = $('#areaCode'),
                    $left = $areaCode.find('.left-inner'),
                    $nav = $areaCode.find('.nav-inner'),
                    key = self.areaKey,
                    map = self.areaMap,
                    headerHeight = 44;
                var id = 0 || 40;
                key.forEach(function(item, i) {
                    if (map[item].length) {
                        $left.append($('<div/>', {
                            'class': 'cat border-bottom',
                            id: '_anchor_' + item
                        }).append((item == 'HOT' ?'热门国家和地区':item)));
                        $nav.append($('<li/>', {
                            'data-target': item,
                            text: (item == 'HOT' ?'#':item)
                        })).addClass('show');
                    }
                    map[item].sort(function(pre, next) {
                        return pre.name.localeCompare(next.name);
                    }).forEach(function(data) {
                        $left.append($('<a/>', {
                            'class': (data.countryId === id ? 'item selected' : 'item') + ' border-bottom',
                            text: data.name,
                            href: 'javascript:',
                            'data-name': data.name,
                            'data-intlCode': data.intlCode,
                            'data-id': data.countryId
                        }).append($('<i/>', {
                            'class': 'intl-code',
                            text: data.intlCode.replace(/^00/, '')
                        })));
                    });
                });

                /* 设置导航锚点 */
                $nav.on('touchstart', function(e) {
                    var x = e.touches[0].clientX;
                    $(this).addClass('active');
                    try {
                        var target = e.target.dataset.target;
                        var $src = $('#_anchor_' + target);
                        $('#scroll').scrollTop($src.offset().top - headerHeight - $('#scroll').scrollTop());
                    } catch (e) {}
                    var touchmove = function(e) {
                        var elem = document.elementFromPoint(x, e.touches[0].clientY);
                        try {
                            var target = elem.dataset.target;
                            var $src = $('#_anchor_' + target);
                            $('#scroll').scrollTop($src.offset().top - headerHeight - $('#scroll').scrollTop());
                        } catch (e) {}
                        return false;
                    };
                    var touchend = function() {
                        $nav.off('touchmove', touchmove).off('touchend', touchend).removeClass('active');
                    };
                    $nav.on('touchmove', touchmove).on('touchend', touchend);
                    return false;
                });
            };
            reduceAreaData(areaCodeData);

            /* 选择国家或地区 */
            $popupBox.find('a.item').on('click', function() {
                $page.css('display', 'block');
                var current = $(this),
                    areaKey = current.attr('data-name'),
                    areaValue = current.attr('data-intlcode');
                if (!current.hasClass('selected')) {
                    current.siblings('a').removeClass('selected');
                    current.addClass('selected');
                };
                $areaCode.text('+' + areaValue.replace(/^00/, ""));
                $areaCode.data('region', areaValue.replace(/^00/, ""));
                $popupAc.css('display', 'none');
                dialog.tip(areaKey + '国际码:' + areaValue.replace(/^00/, ""));
            });

            $contInptOne.show();
            $contInptTwo.hide();

            /* 图片验证码 */
            function createCode(code){
                var $code = document.getElementById("code");
                var ctx = $code.getContext('2d');
                var width = $code.width;
                var height = $code.height;
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle='#f2f2f2';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle='#3297fd';
                var flip = 1;
                ctx.font="italic bolder 16px 'Arial'";
                var codeLength = 6; 
                for(var i = 0; i < codeLength; i++){
                    flip = (i % 2) ? -1 : 1;
                    ctx.save();
                    ctx.rotate(Math.round(3 * Math.random()) * flip * Math.PI / 180);
                    ctx.fillText(code[i],(width * (0.1 + 0.14 * i)),18 + Math.round(8 * Math.random()),76);
                    ctx.restore();
                }
            }
            function getCode(url, data){
                $.ajax({
                    type: "GET",
                    url: url,
                    data: data,
                    dataType: "jsonp",
                    jsonp: "callback",
                    success: function(res) {
                        if(res.code == 0){
                            createCode(res.data.result);
                        }else{
                            dialog.tip(res.msg);
                        }
                    }
                });
            }
        },
        isMobile: function(phoneNum) {
            var reg = /^1[3,4,5,7,8]{1}[0-9]{9}$/;
            return reg.test(phoneNum)
        },
        hint: function(text, t) {
            var self = this;
            var hintmo = self.params.hintmo;
            var hintCtn = document.getElementById('hint');
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
        setUrlPort:function(port){
            var protocol = location.protocol;
            var host = location.host;
            return protocol + '//' + host + ':' + port;
        },
        getTargetUrl: function(replaceUrl, targetUrl) {
            var protocol = location.protocol;
            var host = location.host;
            var pathname = location.pathname.replace(replaceUrl, targetUrl);
            return protocol + '//' + host + pathname;
        }
    };
    Page.init();
});