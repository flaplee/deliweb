;
(function() {
    var shareConfig = {
        title: "得力分享demo",
        desc: "得力分享内容",
        link: "http://www.nbdeli.com/",
        imgUrl: "http://www.nbdeli.com/formwork/default/images/logo.gif"
    };
    // 注入配置信息
    deli.config({
        noncestr: "abcdefg", // 必填，生成签名的随机串
        serviceId: "355373255801962497", // 必填，应用ID
        timestamp: "1508755836143", // 必填，生成签名的时间戳
        signature: "b8386dc73145bb2e2ec76a0078638df7", // 必填，服务端生成的签名
        jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
    });
    // 验证签名成功
    deli.ready(function() {
        var Page = {
            init: function() {
                var that = this;
                $("[data-type]").on("click", function(a) {
                    var d = $(a.target),
                        e = d.attr("data-type");
                    switch (e) {
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
                                "text": "确认",
                                "icon": "http://www.nbdeli.com/formwork/default/images/logo.gif"
                            }, function(data) {}, function(resp) {});
                            break;
                        case "close":
                            deli.common.navigation.close();
                            break;
                        case "upload":
                            deli.common.image.upload({
                                type:"album", //无参数type表示可以从相册或者相机中选择, 有type且值为"album"时从相册中选择, 值为"camera"时从相机中选择
                            }, function(data) {
                                alert(JSON.stringify(data));
                            }, function(resp) {});
                            break;
                        case "preview":
                            deli.common.image.preview({
                                current:1,
                                urls: ["http://www.nbdeli.com/formwork/default/images/case-new-1.jpg","http://www.nbdeli.com/formwork/default/images/case-li-img.jpg","http://www.nbdeli.com/formwork/default/images/case-li-img4.jpg","http://www.nbdeli.com/formwork/default/images/case-li-img3.jpg"]
                            }, function(data) {}, function(resp) {});
                            break;
                        case "file":
                            deli.common.file.upload({
                            }, function(data) {}, function(resp) {});
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
                            deli.common.location.get({}, function(data) {}, function(resp) {});
                            break;
                        case "share":
                            deli.common.message.share(shareConfig, function(data) {}, function(resp) {});
                            break;
                        case "vibrate":
                            deli.common.phone.vibrate({}, function(data) {}, function(resp) {});
                            break;
                        case "getNetworkType":
                            deli.common.connection.getNetworkType({}, function(data) {
                                alert(JSON.stringify(data));
                            },function(resp){});
                            break;
                        case "getUUID":
                            deli.common.phone.getUUID({}, function(data) {}, function(resp) {});
                            break;
                        case "getInterface":
                            deli.common.phone.getInterface({}, function(data) {
                                alert(JSON.stringify(data));
                            }, function(resp) {});
                            break;
                        case "bind":
                            deli.app.device.bind({}, function(data) {}, function(resp) {});
                            break;
                        case "telephoneCall":
                            deli.app.user.telephoneCall({
                                "userId": "355672617635545088"
                            }, function(data) {}, function(resp) {});
                            break;
                        case "chatOpen":
                            deli.app.user.chatOpen({
                                "userIds": ["355672617635545088", "362618666346348544"]
                            }, function(data) {}, function(resp) {});
                            break;
                        case "user":
                            deli.app.user.select({
                                "id":"355671868335718400",
                                "name": "可选人员",
                                "mode": "multi", //多选
                                "rootDeptId": "355671868335718401", //设置可选顶级部门的Id
                                "max": 200, //选择人数限制
                                "userIds": ["355672617635545088", "362618666346348544"],
                                //已选的用户
                                "disabledUserIds": ["355672596013907968", "360009358211284992"]
                            }, function(data) {
                                alert(JSON.stringify(data));
                            }, function(resp) {
                                console.log("resp",data);
                            });
                            break;
                        case "department":
                            deli.app.department.select({
                                "id":"355671868335718400",
                                "name": "可选部门",
                                "mode": "multi", //多选
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
                    }
                });
            }
        };
        Page.init();
    });
    // 验证签名失败
    deli.error(function(resp) {
        alert(JSON.stringify(resp));
    });
})();