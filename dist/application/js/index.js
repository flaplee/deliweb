seajs.config({
    base: './',
    alias: {
        jquery:'js/jquery.js',
        util: 'js/util.js',
        fastclick: 'js/fastclick.js',
        swiper: 'js/swiper.jquery.min.js'
    }
});
seajs.use(['jquery', 'util', 'fastclick', 'swiper'], function(jquery, util, fastclick, swiper) {
    // 注入配置信息
    deli.config({
        noncestr: "abcdefg", // 必填，生成签名的随机串
        appId: "355373255801962497", // 必填，应用ID
        timestamp: "1508755836143", // 必填，生成签名的时间戳
        signature: "b8386dc73145bb2e2ec76a0078638df7", // 必填，服务端生成的签名
        jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
    });
    var Page = {
        init: function() {
            var self = this;
            FastClick.attach(document.body);
            self.bindEvt();
        },
        bindEvt: function() {
            var self = this;
            var token = util.getQuery('token'),
                appid = util.getQuery('appid'),
                orgid = util.getQuery('orgid'),
                userid = util.getQuery('userid'),
                app_name;
            var orgHtml = '';
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
            var setInitBtn = function(){};
            var sentAppBind = function(userid, orgid, orgname, appid, appname, token){
                $.ajax({
                    "type": "get",
                    "url": "http://test4.delicloud.cn:9001/v1.0/cd/bind?Dauth="+ userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token) +"",
                    "headers": {
                        "Dauth": userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token)
                    },
                    "data": {
                        "org_id":orgid,
                        "app_id":appid
                    },
                    "contentType":"application/json; charset=utf-8",
                    "dataType": "jsonp",
                    "jsonp": "callback",
                    success: function(res) {
                        alert(JSON.stringify(res));
                        if(res.code == 0){
                            //util.hint('应用添加成功~',7000);
                            deli.common.notification.toast({
                                "text": "应用添加成功~",
                                "duration": 5
                            },function(data){},function(resp){});
                            var data = res.data;
                            deli.app.method.transit({
                                "id":appid,
                                "org_id":orgid,
                                "name":appname || '',
                                "org_name":orgname || ''
                            }, function(data) {}, function(resp) {});
                        }else{
                            util.hint(res.msg);
                        }
                    },
                    error:function(res){
                        alert(JSON.stringify(res));
                        if(res.readyState == 4 && res.status == 200){
                            util.hint(JSON.parse(res.responseText).msg);
                        }
                    }
                });
            };

            $btnAdd.on('click', function() {
                deli.app.organization.select({
                    'type':'both'
                }, function(data) {
                    var org_id, org_name;
                    if(deli.ios){
                        org_id = data.id;
                        org_name = data.name;
                    }
                    if(deli.android)org_id = data.org_id;
                    sentAppBind(userid, org_id, org_name, appid, app_name, token);
                }, function(resp) {});
                /*util.confirm('请为应用添加组织', function(sure) {
                    if (sure) {
                        deli.app.organization.select({
                            'type':'both'
                        }, function(data) {
                            var org_id, org_name;
                            if(deli.ios){
                                org_id = data.id;
                                org_name = data.name;
                            }
                            if(deli.android)org_id = data.org_id;
                            sentAppBind(userid, org_id, org_name, appid, app_name, token);
                        }, function(resp) {});
                    };
                });*/
            });
            
            /* 获取应用信息 */
            var getInitData = function(id) {
                $.ajax({
                    "type": "get",
                    "url": "http://test4.delicloud.cn:9001/v1.0/cd/app/" + id + "?Dauth="+ userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token) +"",
                    "dataType": "jsonp",
                    "jsonp": "callback",
                    success: function(res) {
                        if (res.code == 0) {
                            var data = res.data['result'];
                            var innerHTML = '', deviceHtml = '';
                            app_name = data.name;
                            $detailItemIcon.find('img').attr('src',data.icon);
                            $detailItemInfo.find('.appdetail-title').text(app_name);
                            $detailItemInfo.find('.appdetail-content').text(data.slogan);
                            if(data.description){
                                if(data.description.length >= 200){
                                    $introduceMore.show();
                                    $introduceMore.on('click', function() {
                                        var c = $(this);
                                        $introduceCont.find('p.content-inner').css({ "overflow": "hidden", "height": "auto","white-space":"pre-wrap"});
                                        $introduceMore.hide();
                                    });
                                }
                                $introduceCont.find('p.content-inner').html(data.description);
                            }else{
                                $introduceMore.hide();
                            }
                            
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

                            var i = 1,urls = [],
                                screen_shot1 = data.screen_shot1,
                                screen_shot2 = data.screen_shot2,
                                screen_shot3 = data.screen_shot3,
                                screen_shot4 = data.screen_shot4,
                                screen_shot5 = data.screen_shot5;
                            while(i <= 5){
                                var item_shot = eval("screen_shot" + i),$targetHtml;
                                if(item_shot && item_shot != ''){
                                    urls.push(item_shot);
                                }
                                i++;
                            }
                            setScreenShot(urls);
                        } else {
                            util.hint(res.msg);
                        }
                    }
                });
            };

            // 应用截图
            function setScreenShot(urls){
                var $app_screenshot = $('#app_screenshot');
                var urlMap = urls.join(',').split(',').map(function(a, e) {
                    $app_screenshot.append($('<div class="screenshot app_screenshot" data-index="'+ e +'"><img width="131" class="lazyload lazyload-fadein" data-src="'+ a +'" src="'+ a +'"></div>'));
                });
                $app_screenshot.on("click", ".app_screenshot", function() {
                    var $dom = $(this), current = parseInt($dom.attr('data-index'));
                    deli.common.image.preview({
                        current: current,
                        urls: urls
                    }, function(data) {}, function(resp) {});
                })
            };

            getInitData(appid);

            /* 获取绑定设备及组织信息 */
            var getDeviceAndOrg = function(appid, orgid, callback){
                $.ajax({
                    "type": "get",
                    "url": "http://test4.delicloud.cn:9001/v1.0/cd/app/"+ appid +"/bind_info/org/"+ orgid +"?Dauth="+ userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token) +"",
                    "dataType": "jsonp",
                    "jsonp": "callback",
                    success: function(res) {
                        console.log("getDeviceAndOrg organization res", res);
                        if (res.code == 0) {
                            var app_device = res.data['result'].unbind_devices, targetHtml = '';
                            $detailBase.children('.base-device').remove();
                            if (app_device) {
                                for (var i = 0; i < app_device.length; i++) {
                                    targetHtml += '<a class="base-device" href="' + app_device[i].dev_url + '">\
                                        <div class="device-icon">\
                                          <img src="' + app_device[i].dev_icon + '">\
                                        </div>\
                                        <div class="device-title">' + app_device[i].product.name + '</div>\
                                      </a>';
                                }
                                $detailBase.append(targetHtml);
                            };
                            var organization = res.data['result'].organization, targetOrgHtml = '', targetUserHtml = '', innerOrgHtml = '', innerUserHtml = '';
                            if(organization && organization.length > 0){
                                var numUser = 0, numCom = 0;
                                for(var i = 0; i < organization.length; i++){
                                    if(organization[i].type == 'company'){
                                        numCom++;
                                        innerOrgHtml += '<a href="javascript:;" data-orgid="'+ organization[i].id +'"><span class="icon icon-team"></span>'+ organization[i].name +'</a>';
                                    }else{
                                        numUser++;
                                        innerUserHtml += '<a href="javascript:;" data-orgid="'+ organization[i].id +'" data-type="user">'+ organization[i].name +'</a>';
                                    }
                                }
                                if(numCom == 0)targetOrgHtml = '<a href="javascript:;" data-orgid="" data-type="organization">暂无团队，创建团队？</a>';
                                if(numUser == 0)targetUserHtml = '<a href="javascript:;" data-orgid="" data-type="user">暂无个人组织，创建个人组织？</a>';
                            }else{
                                if(organization.type && organization.type == 'company'){
                                    targetOrgHtml += '<a href="javascript:;" data-orgid="'+ organization.id +'">'+ organization.name +'</a>';
                                    targetUserHtml += '<a href="javascript:;" data-orgid="" data-type="user">暂无个人组织，创建个人组织？</a>';
                                }else{
                                    targetOrgHtml += '<a href="javascript:;" data-orgid="" data-type="organization">暂无团队，创建团队？</a>';
                                    targetUserHtml += '<a href="javascript:;" data-orgid="'+ organization.id +'"><span class="icon icon-user"></span>'+ organization.name +'</a>';
                                }
                            }
                            var t = innerOrgHtml + targetOrgHtml,u = innerUserHtml + targetUserHtml;

                            orgHtml = '<div id="switch"><div id="switchGroup">' + t + '</div><div id="switchPersonal">' + u + '</div></div>';
                            if (typeof callback === 'function') {
                                callback(res.data.result);
                            }
                        } else {
                            util.hint(res.msg);
                        }
                    }
                });
            }

            getDeviceAndOrg(appid, orgid);

            /* 获取当前用户可管理的组织 */
            var getAppIsAdmined = function(userid, orgid) {
                $.ajax({
                    "type": "get",
                    /*"headers": {
                        "Dauth": userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token)
                    },*/
                    "url": "http://test4.delicloud.cn:9001/v1.0/cd/app/group/" + orgid + "/permission?Dauth="+ userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token) +"",
                    "dataType": "jsonp",
                    "jsonp": "callback",
                    success: function(res) {
                        console.log("getAppIsAdmined res", res);
                        if (res.code == 0) {
                            $detailBtns.find('a').css('display', 'none') && $detailBtns.find('a.btn-add').css('display', 'block');
                        } else {
                            util.hint(res.msg);
                        }
                    }
                });
            };

            /* 获取当前应用是否绑定 */
            var getAppIsBind = function(appid, orgid) {
                $.ajax({
                    "type": "get",
                    "url": "http://test4.delicloud.cn:9001/v1.0/cd/app/isbind/app/" + appid + "/org/" + orgid + "?Dauth="+ userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token) +"",
                    "dataType": "jsonp",
                    "jsonp": "callback",
                    success: function(res) {
                        console.log("getAppIsBind res", res);
                        if (res.code == 0) {
                            // update 2017-10-17 修改状态值调试页面
                            if (res.data['result'] == false) {
                                $detailBtns.find('a').css('display', 'none') && $detailBtns.find('a.btn-add').css('display', 'block');
                            } else {
                                getAppIsAdmined(userid, orgid);
                            }
                        }
                    }
                });
            };
            getAppIsBind(appid, orgid);
        }
    };
    Page.init();
    // 验证签名成功
    deli.ready(function() {
    });
    // 验证签名失败
    deli.error(function(resp) {
        //alert(JSON.stringify(resp));
    });
});