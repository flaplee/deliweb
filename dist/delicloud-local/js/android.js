;
(function() {
    var images = {
        localId: [],
        serverId: []
    };
    var shareConfig = {
        title: "得力分享demo",
        desc: "得力内容简介分享",
        link: "http://www.nbdeli.com/",
        imgUrl: "http://www.nbdeli.com/formwork/default/images/logo.gif"
    };
    // 注入配置信息
    deli.config({
        noncestr: "abcdefg", // 必填，生成签名的随机串
        serviceId: "355373255801962497", // 必填，应用ID
        timestamp: 1508755836143, // 必填，生成签名的时间戳
        /*signature: "b8386dc73145bb2e2ec76a0078638df7", // 必填，服务端生成的签名*/
        jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
    });

    /* 成功验证 */
    deli.ready(function() {
        var Page = {
            init: function() {
                if(deli.ios){
                    //ios bridge 暂时放到js中
                    function setupWebViewJavascriptBridge(callback) {
                        if (window.WebViewJavascriptBridge){
                            return callback(WebViewJavascriptBridge);
                        }
                        if (window.WVJBCallbacks){
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
                    setupWebViewJavascriptBridge(function(bridge) {
                    });
                }
                var that = this;
                $("[data-type]").on("click", function(a) {
                    var d = $(a.target),
                        e = d.attr("data-type");
                    switch (e) {
                        case "setAndroid":
                            break;
                        case "setTitle":
                            var params = {
                                'title': '修改页面标题'
                            };
                            deli.common.navigation.setTitle({
                                "title": "页面标题"
                            }, function(data) {}, function(resp) {});
                            break;
                        case "setRight":
                            deli.common.navigation.setRight({
                                /*"text": "确认",*/
                                "icon": "http://www.nbdeli.com/formwork/default/images/logo.gif"
                            }, function(data) {}, function(resp) {});
                            break;
                        case "close":
                            deli.common.navigation.close();
                            break;
                        case "upload":
                            deli.common.image.upload({
                                type: "album", //无参数type表示可以从相册或者相机中选择, 有type且值为"album"时从相册中选择, 值为"camera"时从相机中选择
                            }, function(data) {}, function(resp) {});
                            break;
                        case "preview":
                            deli.common.image.preview({
                                url: "http://www.nbdeli.com/formwork/default/images/logo.gif"
                            }, function(data) {}, function(resp) {});
                            break;
                        case "file":
                            deli.common.file.upload({}, function(data) {}, function(resp) {});
                            break;
                        case "open":
                            deli.common.location.open({
                                "latitude": "30.50",
                                "longitude": "114.33",
                                "name": "武汉市",
                                "address": "武汉市洪山区",
                                "scale": "18"
                            }, function(data) {}, function(resp) {});
                            break;
                        case "get":
                            deli.common.location.get({}, function(data) {
                                alert(data);
                            }, function(resp) {
                                alert(resp);
                            });
                            break;
                        case "share":
                            deli.common.message.share(shareConfig, function(data) {
                                alert(data);
                            }, function(resp) {
                                alert(resp);
                            });
                            break;
                        case "vibrate":
                            deli.common.phone.vibrate({}, function(data) {
                                alert(data);
                            }, function(resp) {
                                alert(resp);
                            });
                            break;
                        case "getNetworkType":
                            deli.common.connection.getNetworkType({}, function(data) {
                                alert(data);
                            }, function(resp) {
                                alert(resp);
                            });
                            break;
                        case "getUUID":
                            deli.common.phone.getUUID({}, function(data) {
                                alert(data);
                            }, function(resp) {
                                alert(resp);
                            });
                            break;
                        case "getInterface":
                            deli.common.phone.getInterface({}, function(data) {
                                alert(data);
                            }, function(resp) {
                                alert(resp);
                            });
                            break;
                        case "bind":
                            deli.app.device.bind({}, function(data) {
                                alert(data);
                            }, function(resp) {
                                alert(resp);
                            });
                            break;
                        case "telephoneCall":
                            deli.app.user.telephoneCall({
                                "userId": "1234567890"
                            }, function(data) {
                                alert(data);
                            }, function(resp) {
                                alert(resp);
                            });
                            break;
                        case "chatOpen":
                            deli.app.user.chatOpen({
                                "userIds": ["1234567890", "1234567891"]
                            }, function(data) {
                                alert(data);
                            }, function(resp) {
                                alert(resp);
                            });
                            break;
                        case "user":
                            deli.app.user.select({
                                "title": "可选人员",
                                "name": "得力团队",
                                "id": "355671868335718400",
                                "mode": "multi", //多选
                                "rootDeptId": "355671868335718401", //设置可选顶级部门的Id
                                "max": 200, //选择人数限制
                                "userIds": ["355672617635545088", "362618666346348544"],
                                //已选的用户
                                "disabledUserIds": ["355672596013907968", "360009358211284992"]
                            }, function(data) {
                                alert(JSON.stringify(data));
                            }, function(resp) {});
                            break;
                        case "department":
                            deli.app.department.select({
                                "title": "可选部门",
                                "mode": "multi", //多选
                                "name": "得力团队",
                                "id": "355671868335718400",
                                "rootDeptId": "355671868335718401", //设置可选顶级部门的Id
                                "max": 200, //选择部门数限制
                                "selectedDeptIds": ["355671868335718404", "355678628404527106"],
                                //已选的部门
                                "disabledDeptIds": ["355678628404527106", "355678749540220928"]
                                    //禁止选择的部门
                            }, function(data) {
                                alert(JSON.stringify(data));
                            }, function(resp) {});
                            break;
                        case "checkJsApis":
                            deli.app.method.checkJsApis({
                                "noncestr":"abcdefg",
                                "serviceId":"355373255801962497",
                                "timestamp":1508755836143,
                                "sign":"b8386dc73145bb2e2ec76a0078638df7"
                            }, function(data) {
                                alert(JSON.stringify(data));
                            }, function(resp) {});
                        break;
                    }
                });
            }
        };
        Page.init();
    });
    /* 失败验证 */
    deli.error(function(resp) {
        alert(JSON.stringify(resp));
    });
    /* 屏蔽掉config验证过程 */
    /*Page.init();*/
})();