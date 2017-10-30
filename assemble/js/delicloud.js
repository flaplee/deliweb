/**
create delicloud.js for js_sdk api
@author tianlun
@param deli is a object, deli.method to use in the page
*/
(function(win) {
    'use strict';
    //客户端事件
    var clientEvents = [
        'backbutton'
    ];
    //方法列表
    var regMethods = [
        //通用接口(common)
        'common.navigation.setTitle',
        'common.navigation.setRight',
        'common.navigation.close',
        'common.image.upload',
        'common.image.preview',
        'common.file.upload',
        'common.location.open',
        'common.location.get',
        'common.message.share',
        'common.phone.vibrate',
        'common.connection.getNetworkType',
        'common.phone.getUUID',
        'common.phone.getInterface',
        //APP业务接口(app)
        'app.device.bind', //添加智能设备
        'app.user.telephoneCall', //打电话
        'app.user.chatOpen', //打开聊天会话
        'app.user.select', //选择企业通讯录中的人
        'app.department.select', //选择企业通讯录中的部门
        /* total 18 2017-09-14 */
        'common.notification.showPreloader',
        'common.notification.hidePreloader',
        'common.notification.toast',
        'app.organization.create',
        'app.config.init'
    ];
    var JSSDK_VERSION = '0.0.1';
    var ua = win.navigator.userAgent;
    var matches = ua.match(/DeliApp\(\w+\/([a-zA-Z0-9.-]+)\)/);
    //android兼容处理
    if (matches === null) {
        matches = ua.match(/DeliApp\/([a-zA-Z0-9.-]+)/);
    }
    var version = matches && matches[1];
    var already = false; //是否已初始化
    var config = null; //缓存config参数
    var appMethod = 'app.method.checkJsApis'; //权限校验方法名 app.method.checkJsApis, 防止抓包通过恶意请求,可以修改改为桥接处理
    var errorHandle = null; //缓存error回调
    var bridgeReady = false;
/**
*    deli.config 配置签名对象
*    deli.ready 初始化完成
*    deli.error 权限校验失败时
*/
    var deli = {
        ios: (/iPhone|iPad|iPod/i).test(ua),
        android: (/Android/i).test(ua),
        version: version,
        isDeliApp: function() {
            return this.version;
        },
        type: function(obj) {
            return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
        },
        config: function(obj) {
            //这里对用户传进来的参数进行过滤
            if (!obj) {
                return;
            }
            //to do: 参数名待统一
            config = {
                serviceId: obj.serviceId || -1,
                timestamp: obj.timestamp,
                noncestr: obj.noncestr,
                sign: obj.signature
                /*jsApiList: obj.jsApiList*/
            };
            if (obj.serviceId) {
                config.serviceId = obj.serviceId;
            }
        },
        error: function(fn) {
            errorHandle = fn;
        },
        ready: function(callback) {
            // sdk send xhr
            var appFn = function(param) {
                var xhr = new XMLHttpRequest(),
                    type = param.type || 'post',
                    url = param.url
                if (type === 'get' && param.data) {
                    var strArr = []
                    for (var key in param.data) {
                        if (param.data.hasOwnProperty(key)) {
                            strArr.push(key + '=' + param.data[key])
                        }
                    }
                    url = url + '?' + strArr.join('&')
                }
                xhr.open(type, url, true);
                if (!param.data) {
                    param.data = {};
                }
                xhr.onreadystatechange = function() {
                    var s;
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            //s = xhr.responseText;
                            try {
                                s = JSON.parse(xhr.responseText);
                            } catch (e) {}
                            if (s) {
                                if (typeof param.success === 'function') {
                                    param.success(s);
                                }
                            }else{
                                if (typeof param.error === 'function') {
                                    param.error(xhr, 'parse_error');
                                }
                            }
                        } else {
                            if (typeof param.error === 'function') {
                                    param.error(xhr, 'parse_error');
                                }
                        }
                        if (typeof param.complete === 'function') {
                            param.complete(xhr);
                        }
                    }
                };
                if (param.data instanceof FormData) {
                    //xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                    xhr.send(param.data);
                } else {
                    xhr.setRequestHeader('content-type', 'application/json');
                    xhr.send(JSON.stringify(param.data));
                }
            };
            /*var $jsonp = (function(){
                var that = {};
                that.send = function(src, options) {
                    var options = options || {},
                    callback_name = options.callbackName || 'callback',
                    on_success = options.onSuccess || function () {},
                    on_timeout = options.onTimeout || function () {},
                    timeout = options.timeout || 10;
                    var timeout_trigger = window.setTimeout(function () {
                      window[callback_name] = function () {};
                      on_timeout();
                    }, timeout * 1000);
                    window[callback_name] = function (data) {
                      window.clearTimeout(timeout_trigger);
                      on_success(data);
                    };
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.src = src;
                    document.getElementsByTagName('head')[0].appendChild(script);
                };
                return that;
            })();
            $jsonp.send('http://192.168.0.201:9001/v1.0/app/premission/check/public?callback=jsonpCallback', {
                callbackName: 'jsonpCallback',
                onSuccess: function(res){
                    alert("success!" + res);
                    callback(bridge);
                },
                onTimeout: function(res){
                    alert("timeout!" + res);
                    setTimeout(function() {
                        errorHandle && errorHandle({
                            message: '权限校验失败 ' + res.msg,
                            errorCode: 3
                        });
                    });
                },
                timeout: 5
            });*/
            //组织桥接 控制中心
            var fn = function(bridge) {
                alert("桥接 控制中心");
                if (!bridge) {
                    return console.log('bridge初始化失败')
                }
                //回调函数处理h5页面
                //callback(bridge);
                //to do: 判断config，进行权限校验 ,现在过滤config校验，直接访问
                // update time 2017-10-12 打开权限校验
                if(config === null || !config.sign){
                    callback(bridge);
                }else{
                    if (deli.ios) {
                        appFn({
                            type:"get",
                            url: "/v1.0/app/premission/check/public",
                            data: config,
                            success:function(res){
                                callback(bridge);
                            },
                            error:function(res){
                                var msg = '无效的serviceId';
                                setTimeout(function() {
                                    errorHandle && errorHandle({
                                        message: '权限校验失败 ' + msg,
                                        errorCode: -1
                                    });
                                });
                            }
                        });
                        /*bridge.callHandler(appMethod, config, function(response) {
                            var data = response || {};
                            var code = data.errorCode;
                            var msg = data.errorMessage || '';
                            var result = data.result;
                            if (code === '0') {
                                callback(bridge);
                            } else {
                                setTimeout(function() {
                                    errorHandle && errorHandle({
                                        message: '权限校验失败 ' + msg,
                                        errorCode: -1
                                    });
                                });
                            }
                        });*/
                    } else if (deli.android) {
                        // update time 2017-10-16 android、ios改为相同同桥接库
                        /*bridge.callHandler(appMethod, config, function(response) {
                            var data = response || {};
                            var code = data.errorCode;
                            var msg = data.errorMessage || '';
                            var result = data.result;
                            if (code === '0') {
                                callback(bridge);
                            } else {
                                setTimeout(function() {
                                    errorHandle && errorHandle({
                                        message: '权限校验失败 ' + msg,
                                        errorCode: -1
                                    });
                                });
                            }
                        });*/
                        appFn({
                            type:"get",
                            url: "/v1.0/app/premission/check/public",
                            data: config,
                            success:function(res){
                                callback(bridge);
                            },
                            error:function(res){
                                var msg = '无效的serviceId';
                                setTimeout(function() {
                                    errorHandle && errorHandle({
                                        message: '权限校验失败 ' + msg,
                                        errorCode: -1
                                    });
                                });
                            }
                        });
                    }
                }
                
                //第一次初始化后要做的事情
                if (already === false) {
                    already = true;
                    //自定义事件
                    clientEvents.forEach(function(evt) {
                        if (deli.ios) {
                            bridge.registerHandler(evt, function(data, responseCallback) {
                                //console.log('注册事件默认回调', data, responseCallback);
                                var e = document.createEvent('HTMLEvents');
                                e.data = data;
                                e.initEvent(evt);
                                document.dispatchEvent(e);
                                responseCallback && responseCallback({
                                    code: '0',
                                    msg: '成功'
                                })
                            });
                        }
                    });
                    if (config === null) {
                        var conf = {
                            url: encodeURIComponent(window.location.href),
                            js: JSSDK_VERSION
                            //配置需要检查id
                        };
                    }
                }
            };
            //已经完成初始化的情况
            if(deli.ios && win.WebViewJavascriptBridge){
                //防止ready延迟导致的问题
                //init后，register的方法才能收到回调，重现方法：首次触发deli.ready延时
                try {
                    WebViewJavascriptBridge.init(function(data, responseCallback) {
                        //客户端send
                        console.log('WebViewJavascriptBridge init: ', data, responseCallback);
                    });
                } catch (e) {
                    console.log(e.message);
                }
                return fn(WebViewJavascriptBridge);
            } else if (deli.android && win.WebViewJavascriptBridge) {
                 try {
                    WebViewJavascriptBridge.init(function(data, responseCallback) {
                        //客户端send
                        console.log('WebViewJavascriptBridge init: ', data, responseCallback);
                    });
                } catch (e) {
                    console.log(e.message);
                }
                // 安卓to do
                return fn(WebViewJavascriptBridge);
            }
            //初始化主流程
            if (deli.ios) {
                console.log('开始监听WebViewJavascriptBridgeReady事件');
                alert("test1");
                document.addEventListener('WebViewJavascriptBridgeReady', function() {
                    alert("test2");
                    alert(JSON.stringify(WebViewJavascriptBridge));
                    if (typeof WebViewJavascriptBridge === 'undefined') {
                        return console.log('WebViewJavascriptBridgeReady 未定义');
                    }
                    try {
                        WebViewJavascriptBridge.init(function(data, responseCallback) {
                            //客户端send
                            //console.log('WebViewJavascriptBridge init: ', data, responseCallback);
                        });
                    } catch (e) {
                        console.log(e.message);
                    }
                    bridgeReady = true;
                    fn(WebViewJavascriptBridge);
                }, false);
            }else if(deli.android){
                // android、ios 使用相同库
                console.log('开始监听WebViewJavascriptBridgeReady事件');
                document.addEventListener('WebViewJavascriptBridgeReady', function() {
                    if (typeof WebViewJavascriptBridge === 'undefined') {
                        return console.log('WebViewJavascriptBridge 未定义');
                    }
                    try {
                        WebViewJavascriptBridge.init(function(data, responseCallback) {
                            //客户端send
                            //console.log('WebViewJavascriptBridge init: ', data, responseCallback);
                        });
                    } catch (e) {
                        console.log(e.message);
                    }
                    bridgeReady = true;
                    fn(WebViewJavascriptBridge);
                }, false);
            }else{
                return console.log('很抱歉，尚未支持您所持设备');
            }
        }
    };

    //注册命名空间,"common.navigation.setTitle"生成deli.common.navigation.setTitle
    var regNameSpace = function(method, fn) {
        var arr = method.split('.');
        var namespace = deli;
        for (var i = 0, k = arr.length; i < k; i++) {
            if (i === k - 1) {
                namespace[arr[i]] = fn;
            }
            if (typeof namespace[arr[i]] === 'undefined') {
                namespace[arr[i]] = {};
            }
            namespace = namespace[arr[i]];
        }
    };
    //设置默认属性
    function setDefaultValue(obj, defaults, flag) {
        for (var i in defaults) {
            if (flag) {
                obj[i] = defaults[i];
            } else {
                obj[i] = obj[i] !== undefined ? obj[i] : defaults[i];
            }
        }
    }
    //生成器，处理传参、回调以及对特定方法特殊处理
    function generator(method, param, callbackSuccess, callbackFail) {
        //初始位置   update 2017-09-14
        if (typeof WebViewJavascriptBridge === 'undefined') {
            return console.log('未定义WebViewJavascriptBridge');
        }
        //to do
        //console.log('调用方法：', method, '传参：', param);
        var p = param || {};
        var successCallback = function(res) {
            console.log('默认成功回调', method, res);
        };
        var failCallback = function(err) {
            console.log('默认失败回调', method, err)
        };
        if (callbackSuccess) {
            successCallback = callbackSuccess;
        }
        if (callbackFail) {
            failCallback = callbackFail;
        }
        //统一回调处理
        var callback = function(response) {
            console.log('统一响应：', response);
            var data = response || {};
            var code = data.code;
            var result = data.result;
            //code 0 表示成功, 其它表示失败
            if (code === '0') {
                //数据处理
                switch(method){
                    case 'common.image.upload':
                        var odata = {
                            "url": data.result
                        };
                        result = odata;
                        break;
                    case 'common.location.get':
                        break;
                    case 'common.connection.getNetworkType':
                        var odata = {
                            "getNetworkType": data.result
                        };
                        result = odata;
                        break;
                    case 'common.phone.getUUID':
                        var odata = {
                            "uuid": data.result
                        };
                        result = odata;
                        break;
                    case 'common.phone.getInterface':
                        var odata = {
                            "ssid":data.result.SSID,
                            "localMac":"",
                            "localIpAddress":"",
                            "mac":data.result.BSSID,
                            "ipAddress":data.result.SSIDDATA
                        };
                        result = odata;
                        break;
                    case 'app.user.select':
                        var odata = {
                            data:[]
                        };
                        if(data.result.length > 0){
                            data.result.forEach(function(ele){
                                var oTemp = {
                                    "userId":ele.user_id,
                                    "name":ele.name,
                                    "avatar":"",
                                    "empno":ele.employee_num
                                }
                                odata.data = odata.data.concat(oTemp);
                            });
                            result = odata;
                        }
                    break;
                    case 'app.department.select':
                        var odata = {
                            data:[]
                        };
                        if(data.result.length > 0){
                            data.result.forEach(function(ele){
                                var oTemp = {
                                    "deptId":ele.parent_id,
                                    "deptName":ele.name
                                }
                                odata.data = odata.data.concat(oTemp);
                            });
                            result = odata;
                        }
                    break;
                }
                successCallback && successCallback.call(null, result);
            } else {
                failCallback && failCallback.call(null, result, code);
            }
        };
        var watch = false; //是否为监听操作，如果是监听操作，后面要注册事件
        //前端内容处理，设置默认参数属性
        switch (method) {}
        //消息接入：android和iOS区分处理
        if (deli.android) {
            if (watch) {
                WebViewJavascriptBridge.registerHandler(method, function(data, responseCallback) {
                    callback({
                        code: '0',
                        msg: '成功',
                        result: data
                    });
                    //回传给客户端，可选
                    responseCallback && responseCallback({
                        code: '0',
                        msg: '成功'
                    });
                });
                WebViewJavascriptBridge.callHandler(method, p, callbackSuccess);
            } else {
                WebViewJavascriptBridge.callHandler(method, p, callbackSuccess);
            }
        } else if (deli.ios) {
            if (watch) {
                WebViewJavascriptBridge.registerHandler(method, function(data, responseCallback) {
                    callback({
                        code: '0',
                        msg: '成功',
                        result: data
                    });
                    //回传给客户端，可选
                    responseCallback && responseCallback({
                        code: '0',
                        msg: '成功'
                    });
                });
                WebViewJavascriptBridge.callHandler(method, p);
            } else {
                WebViewJavascriptBridge.callHandler(method, p, callback);
            }
        }
    }
    //注册方法生成api
    regMethods.forEach(function(method) {
        regNameSpace(method, function(param, callbackSuccess, callbackFail) {
            //api
            //console.log("method", method);
            //console.log("param", param);
            //console.log("callbackSuccess", callbackSuccess);
            //console.log("callbackFail", callbackFail);
            generator(method, param, callbackSuccess, callbackFail);
        });
    });

    win.deli = deli;
    //支持amd && cmd
    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        module.exports = deli;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() {
            return deli;
        })
    }
    console.log("deli", deli);
}(this));