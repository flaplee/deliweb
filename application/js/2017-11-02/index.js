seajs.config({
    base: '/',
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
        serviceId: "355373255801962497", // 必填，应用ID
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
                userid = util.getQuery('userid');
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
            var sentAppBind = function(userid, orgid, appid, token){
                $.ajax({
                    "type": "get",
                    "url": "/v1.0/cd/bind",
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
                        //util.hideLoading();
                        //deli.common.notification.hidePreloader({}, function(data) {}, function(resp) {});
                        util.hint('应用添加成功~');
                        if(res.code == 0){
                            var data = res.data;
                            deli.app.config.init({
                                "id":data.id,
                                "organizationId":data.orgid,
                                "name":data.name,
                                "organizationName":data.name
                            }, function(data) {}, function(resp) {});
                            deli.app.method.transit({
                                "id":"355373255801962497",
                                "organizationId":"355671868335718400",
                                "name":"智能考勤",
                                "organizationName":"得力个人团队"
                            }, function(data) {}, function(resp) {});
                        }else{
                            util.hint(res.msg);
                        }
                    }
                });
            };
            $btnAdd.on('click', function() {
                util.confirm('请为应用添加组织', function(sure) {
                    if (sure) {
                        /*util.closeDialog();
                        deli.app.organization.select({
                            'type':'group'
                        }, function(data) {
                            //alert(JSON.stringify(data));
                            sentAppBind(userid, orgid, appid, token);
                            deli.app.config.init({
                                 "id":"355373255801962497",
                                 "organizationId":"355671868335718400",
                                 "name":"智能考勤",
                                 "organizationName":"得力个人团队"
                            }, function(data) {}, function(resp) {});
                            deli.app.method.transit({
                                 "id":"355373255801962497",
                                 "organizationId":"355671868335718400",
                                 "name":"智能考勤",
                                 "organizationName":"得力个人团队"
                            }, function(data) {}, function(resp) {});
                            //deli.common.notification.showPreloader({}, function(data) {}, function(resp) {});
                        }, function(resp) {});*/

                        // test WebViewJavascriptBridge
                        deli.app.organization.select({
                            'type':'group'/*,
                            onSuccess:function(data){
                                sentAppBind(userid, orgid, appid, token);
                            },
                            onError:function(){
                            }*/
                        }, function(data) {
                            sentAppBind(userid, orgid, appid, token);
                            //deli.common.notification.showPreloader({}, function(data) {}, function(resp) {});
                        }, function(resp) {});
                    };
                });
            });

            /*$btnAdd.on('click', function() {
                util.htmlDialog(orgHtml.replace(/   |  /g, ''), 'switchGroup');
                $('#switchPersonal a').on('click', function() {
                    var c = $(this);
                    //util.showLoading();
                    if(c.attr('data-type') == 'user'){
                        deli.app.organization.create({
                            "id": appid,
                            "type": "user"
                        }, function(data) {}, function(resp) {});
                    }else if(c.attr('data-type') == 'organization'){
                        deli.app.organization.create({
                            "id": appid,
                            "type": "organization"
                        }, function(data) {}, function(resp) {});
                    }else{
                        util.showLoading();
                        $.ajax({
                            "type": "get",
                            "url": "/v1.0/cd/bind",
                            "headers": {
                                "Dauth": userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token)
                            },
                            "data": {
                                "org_id":c.attr('data-orgid'),
                                "app_id":appid
                            },
                            "contentType":"application/json; charset=utf-8",
                            "dataType": "jsonp",
                            "jsonp": "callback",
                            success: function(res) {
                                util.hideLoading();
                                util.hint('应用添加成功~');
                                if(res.code == 0){
                                    //initDetailBtn($dom, type, data);
                                }else{
                                    util.hint(res.msg);
                                }
                            }
                        });
                    }
                });
                $('#switchGroup a').on('click', function() {
                    var c = $(this);
                    if(c.attr('data-type') == 'organization'){
                        deli.app.config.init({
                             "id":"355373255801962497",
                             "organizationId":"355671868335718400",
                             "name":"智能考勤",
                             "organizationName":"得力团队"
                        }, function(data) {}, function(resp) {});
                    }else if(c.attr('data-type') == 'user'){
                        deli.app.config.init({
                             "id":"355373255801962497",
                             "organizationId":"355671868335718400",
                             "name":"智能考勤",
                             "organizationName":"得力个人团队"
                        }, function(data) {}, function(resp) {});
                    }else{
                        util.showLoading();
                        $.ajax({
                            "type": "get",
                            "url": "/v1.0/cd/bind",
                            "headers": {
                                "Dauth": userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token)
                            },
                            "data": {
                                "org_id":c.attr('data-orgid'),
                                "app_id":appid
                            },
                            "contentType":"application/json; charset=utf-8",
                            "dataType": "jsonp",
                            "jsonp": "callback",
                            success: function(res) {
                                util.hideLoading();
                                util.hint('应用添加成功~');
                                if(res.code == 0){
                                    //initDetailBtn($dom, type, data);
                                }else{
                                    util.hint(res.msg);
                                }
                            }
                        });
                    }
                });
                //initDetailBtn($(this), '');
            });*/
            
            /* 获取应用信息 */
            var getInitData = function(id) {
                $.ajax({
                    "type": "get",
                    "url": "/v1.0/cd/app/"+ id,
                    "dataType": "jsonp",
                    "jsonp": "callback",
                    success: function(res) {
                        if (res.code == 0) {
                            var data = res.data['result'];
                            var innerHTML = '', deviceHtml = '';
                            $detailItemIcon.find('img').attr('src',data.icon);
                            $detailItemInfo.find('.appdetail-title').text(data.name);
                            $detailItemInfo.find('.appdetail-content').text(data.slogan);
                            if(data.description.length <= 200){
                                $introduceMore.hide();
                                $introduceMore.unbind('click');
                            }else{
                                $introduceMore.on('click', function() {
                                    var c = $(this);
                                    $introduceCont.find('p.content-inner').addClass('content-show');
                                    c.hide();
                                });
                            }
                            $introduceCont.find('p.content-inner').html(data.description);
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
                                    //var screen_shot+(i + 1) = '<div class="swiper-slide" style="background-image:url('+ data.screen_shot[i] +')"></div>';
                                    //eval("var set_" + i + "=" + i);
                                    //var item = '<div class="swiper-slide" style="background-image:url('+ data.screen_shot1 +')"></div>';
                                    urls.push(item_shot);
                                    $targetHtml = $('<div class="swiper-slide" style="background-image:url('+ item_shot +')"></div>');
                                    $detailBannerInner.append($targetHtml);
                                }
                                i++;
                            }
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
                                        urls: urls
                                    }, function(data) {}, function(resp) {});
                                },
                                onInit: function(swiper) {},
                                onSlideChangeEnd: function(swiper) {}
                            });
                        } else {
                            util.hint(res.msg);
                        }
                    }
                });
            };

            getInitData(appid);

            /* 获取绑定设备及组织信息 */
            var getDeviceAndOrg = function(appid, orgid, callback){
                $.ajax({
                    "type": "get",
                    "url": "/v1.0/cd/app/"+ appid +"/bind_info/org/"+ orgid +"",
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
                    "headers": {
                        "Dauth": userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token)
                    },
                    "url": "/v1.0/cd/app/group/" + orgid + "/permission",
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
                    "url": "/v1.0/cd/app/isbind/app/" + appid + "/org/" + orgid + "",
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

            /* 获取当前用户组织*/
            /*var getUserOrg = function(userid, token, callback) {
                $.ajax({
                    "type": "get",
                    "headers": {
                        "Dauth": userid + ' ' + (new Date().valueOf()) + ' ' + token
                    },
                    //"url": "/v1.0/cd/user/me/org",
                    "url":"/v1.0/cd/app/"+ appid +"/bind_info/org/"+ orgid +"",
                    "dataType": "jsonp",
                    "jsonp": "callback",
                    success: function(res) {
                        console.log("organization",res);
                        if (res.code == 0) {
                            if (typeof callback === 'function') {
                                callback(res.data.result);
                            }
                        }
                    }
                });
            };*/
        }
    };
    if(deli.ios == true){
        Page.init();
    }
    // 验证签名成功
    deli.ready(function() {
        if(deli.android == true){
            Page.init();
        }
    });
    // 验证签名失败
    deli.error(function(resp) {
        alert(JSON.stringify(resp));
    });
});