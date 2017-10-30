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
    var Page = {
        init: function() {
            //console.log("window.WebViewJavascriptBridge,pageInit" window.WebViewJavascriptBridge);
            function connectWebViewJavascriptBridge(callback) {
                if (window.WebViewJavascriptBridge) {
                    callback(WebViewJavascriptBridge)
                } else {
                    document.addEventListener(
                        'WebViewJavascriptBridgeReady',
                        function() {
                            callback(WebViewJavascriptBridge)
                        },
                        false
                    );
                }
            }
            connectWebViewJavascriptBridge(function(bridge) {
                bridge.init(function(message, responseCallback) {
                    console.log('JS got a message', message);
                    var data = {
                        'Javascript Responds': '测试中文!'
                    };
                    console.log('JS responding with', data);
                    responseCallback(data);
                });
                bridge.registerHandler("functionInJs", function(data, responseCallback) {
                    document.getElementById("show").innerHTML = ("data from Java: = " + data);
                    var responseData = "Javascript Says Right back aka!";
                    responseCallback(responseData);
                });
            });
            var that = this;
            var isImage = false;
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
                        }, function(data) {
                            alert(data);
                        }, function(resp) {
                            alert(resp);
                        });
                        break;
                    case "setRight":
                        var param;
                        if (isImage) {
                            param = {
                                "icon": "http://www.nbdeli.com/formwork/default/images/logo.gif"
                            }
                        } else {
                            param = {
                                "text": "确认"
                            }
                        }
                        isImage = !isImage;
                        deli.common.navigation.setRight(param, function(data) {
                            alert(data);
                        }, function(resp) {
                            alert(resp);
                        });
                        break;
                    case "close":
                        deli.common.navigation.close();
                        break;
                    case "upload":
                        deli.common.image.upload({
                            type: "album", //无参数type表示可以从相册或者相机中选择, 有type且值为"album"时从相册中选择, 值为"camera"时从相机中选择
                        }, function(data) {
                            alert(data);
                        }, function(resp) {
                            alert(resp);
                        });
                        break;
                    case "preview":
                        deli.common.image.preview({
                            url: "http://www.nbdeli.com/formwork/default/images/logo.gif"
                        }, function(data) {
                            alert(data);
                        }, function(resp) {
                            alert(resp);
                        });
                        break;
                    case "file":
                        deli.common.file.upload({}, function(data) {
                            alert(data);
                        }, function(resp) {
                            alert(resp);
                        });
                        break;
                    case "open":
                        deli.common.location.open({
                            "latitude": "30.50",
                            "longitude": "114.33",
                            "name": "武汉市",
                            "address": "武汉市洪山区",
                            "scale": "18"
                        }, function(data) {
                            alert(data);
                        }, function(resp) {
                            alert(resp);
                        });
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
                            "title": "选择企业通讯录中的人",
                            "mode": "multi", //多选
                            "rootDeptId": "369252015789834240", //设置可选顶级部门的Id
                            "orgId": "369252015785639936",
                            "orgName": "得力团队",
                            "max": 200, //选择人数限制
                            "userIds": ["1234567890", "1234567891"],
                            //已选的用户
                            "disabledUserIds": ["12345678910", "12345678911"]
                        }, function(data) {
                            alert(data);
                        }, function(resp) {
                            alert(resp);
                        });
                        break;
                    case "department":
                        deli.app.department.select({
                            "title": "选择企业通讯录中的部门",
                            "mode": "multi", //多选
                            "rootDeptId": "369252015789834240", //设置可选顶级部门的Id
                            "orgId": "369252015785639936",
                            "orgName": "得力团队",
                            "max": 200, //选择部门数限制
                            "selectedDeptIds": ["10001", "10002"],
                            //已选的部门
                            "disabledDeptIds": ["10011", "10012"]
                                //禁止选择的部门
                        }, function(data) {
                            alert(data);
                        }, function(resp) {
                            alert(resp);
                        });
                        break;
                }
            });
        }
    };
    /* 屏蔽掉config验证过程 */
    /*deli.ready(function() {
        Page.init();
    });*/
    Page.init();
    /*if (deli.version) {
        deli.ready(function() {
            Page.init();
        });
    } else {
        Page.init();
    }*/
})();