seajs.config({
    base: '/',
    alias: {
        jquery:'js/jquery.js',
        util: 'js/util.js',
        sockjs: 'js/sockjs.js',
        stomp: 'js/stomp.js'
    }
});
seajs.use(['jquery', 'util', 'sockjs', 'stomp'], function(jquery, util, sockjs, stomp) {
    // 注入配置信息
    deli.config({
        noncestr: "abcdefg", // 必填，生成签名的随机串
        serviceId: "355373255801962497", // 必填，应用ID
        timestamp: "1508755836143", // 必填，生成签名的时间戳
        signature: "b8386dc73145bb2e2ec76a0078638df7", // 必填，服务端生成的签名
        jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
    });
    $(function(){
        var sock = new SockJS('http://192.168.0.202:9999/delicloudmock');
        var stomp = Stomp.over(sock);

        stomp.connect({}, function (frame) {
            console.log("frame",frame);
            var url = "/cloudapp/kq/user/355669228033933300/finger" ;
            listenStomp(url);
        });

        function listenStomp(url){
            stomp.subscribe(url, function (message) {  
                var json = JSON.parse(message.body);
                console.log(json);
            });    
        }

        function disconnect() {
            if (stomp != null) {
                stomp.disconnect();
            }
            console.log("Disconnected");
        }
    });
    
    var Page = {
        init: function() {
            var self = this;
            self.bindEvt();
        },
        bindEvt: function() {
            var self = this;
            var $page = $('#page'),
                $listIndex = $page.find('#finger-index-list .finger-index-list-inner'),
                $listRecord = $page.find('#finger-index-list .finger-record-list-inner'),
                $listIndexItem = $listRecord.find('.kq-list-item'),
                $listRecordItem = $listIndexItem.find('.kq-list-item'),
                $listIndexBtn = $page.find('#finger-btm-btn .kq-flexbox-item a.kq-button-list'),
                $listRecordBtn = $page.find('#finger-btm-btn .kq-flexbox-item a.kq-button-record'),
                $loading = $page.find("#loading"),
                $addUser = $page.find('#add-user');
            var sn = '3960W_88888888';//self.getQuert('sn')
            var uid = '355669228033933312';

            //设置标题
            /*var setTitle = function(){
                setTimeout(function(){
                    deli.common.navigation.setTitle({'title':''},function(data){},function(resp){});
                });
            }();*/

            //获取用户指纹列表
            var getUsers = function() {
                $.ajax({
                    url: '/cloudapp/kq/users',
                    type: "GET",
                    timeout: 1e3,
                    contentType:"application/json",
                    dataType: "json",
                    data: {},
                    success: function(res) {
                        //console.log("users", res);
                        util.hideLoading();
                        if(res.code == 0){
                            var data = res.data;
                            $listIndex.find('>').remove();
                            $.each(data, function(i, n) {
                                var w = (n.finger_status == 0) ? 'disabled' : '',
                                    a = (n.finger_status == 0) ? '未录入' : '已录入('+ n.finger_count +')',
                                    d = (n.finger_status == 0) ? 'kq-list-status-disabled' : '';
                                 //$listIndex.append($('<div class="kq-list-item"><div class="kq-list-content"><div>' + n.name + '</div><div>(' + n.finger_count + ')</div></div><div class="kq-list-btn"><a href="javascript:;" data-user_id="' + n.user_id + '"><button type="button" class="kq-button kq-button-md kq-button-white kq-button-light" kq-mode="small ' + w + '">' + a + '</button></a></div></div>'));
                                $listIndex.append($('<div class="kq-list-item">\
                                  <div class="kq-list-content">\
                                    <div class="kq-list-info">\
                                      <a href="javascript:;"><img class="icon-active" src="./images/avatar.jpg"></a>\
                                      <span class="kq-list-info-name">' + n.name + '</span>\
                                    </div>\
                                    <div class="kq-list-text">\
                                        <div class="kq-list-status '+ d +'">'+ a +'</div>\
                                        <span>编号:' + n.empno + '</span>\
                                    </div>\
                                  </div>\
                                  <div class="kq-list-btn">\
                                    <a href="javascript:;" data-user_id="' + n.user_id + '">\
                                      <button type="button" class="kq-button kq-button-md kq-button-white kq-button-light" kq-mode="small">录入指纹</button>\
                                    </a>\
                                  </div>\
                                </div>'));
                            });
                            $listIndex.find('.kq-list-item .kq-list-btn a').on('click',function(e){
                                e.stopPropagation();
                                var c = $(this), sn = '3960W_88888888'/*c.attr('data-sn')*/,user_id = c.attr('data-user_id'),user_name = c.parent('.kq-list-btn').siblings('.kq-list-content').find('.kq-list-info .kq-list-info-name').text();
                                util.htmlDialog('\
                                    <div id="finger-status" class="finger-status finger-status-img"></div>\
                                    <div class="finger-text">请"'+ user_name +'"录入指纹</div>\
                                    <div class="finger-tips finger-tips-overtime status-timeout"><span class="icon-entry-overtime"></span>录入超时！</div>\
                                    <div class="finger-tips finger-tips-success status-success"><span class="icon-entry-success"></span>录入成功！</div>\
                                    <div class="finger-tips finger-tips-doing status-doing">（需验证3次）进行中...</div>\
                                    <div class="finger-btn clearfix">\
                                      <a class="btn-large-know status-success" href="javascript:;" target="_blank">我知道了</a>\
                                      <a class="btn-large-cancel status-doing" href="javascript:;" target="_blank">取消</a>\
                                      <a class="btn-small-cancel status-timeout" href="javascript:;" target="_blank">取消</a>\
                                      <a class="btn-small-retry status-timeout" href="javascript:;" target="_blank">重试</a>\
                                    </div>\
                                '.replace(/   |  /g, ''), 'fingerBox');
                                var $fingerStatus = $('#dialog .fingerBox .content'),
                                    $btnLargeKnow =  $fingerStatus.find('.btn-large-know'),
                                    $btnLargeCancel =  $fingerStatus.find('.btn-large-cancel'),
                                    $btnSmallCancel =  $fingerStatus.find('.btn-small-cancel'),
                                    $btnSmallRetry =  $fingerStatus.find('.btn-small-retry');
                                $btnLargeKnow.on('click',function(){
                                    util.closeDialog();
                                });
                                $btnLargeCancel.on('click',function(){
                                    util.closeDialog();
                                });
                                $btnSmallCancel.on('click',function(){
                                    util.closeDialog();
                                });
                                $btnSmallRetry.on('click',function(){
                                    util.closeDialog();
                                });
                                getFinger(sn, user_id);
                                setFingerStatus($fingerStatus,0);
                            });
                        }else{
                            util.hint(res.errorMsg);
                        };
                    },
                    error: function() {
                        util.hint('网络错误，请重试');
                    }
                });
            };
            
            var setFingerStatus = function($dom, status){
                switch(status){
                    case 0:
                        $dom.find('.status-doing').show();
                        $dom.find('.status-timeout').hide();
                        $dom.find('.status-success').hide();
                        $dom.find('.finger-status').addClass('finger-status-img');
                    break;
                    case 1:
                        $dom.find('.status-timeout').show();
                        $dom.find('.status-doing').hide();
                        $dom.find('.status-success').hide();
                        $dom.find('.finger-status').addClass('finger-status-img2');
                    break;
                    case 2:
                        $dom.find('.status-success').show();
                        $dom.find('.status-timeout').hide();
                        $dom.find('.status-doing').hide();
                        $dom.find('.finger-status').addClass('finger-status-img2');
                    break;
                    default:;
                }
            }

            //获取打卡数据
            var getRecord = function(uid){
                $.ajax({
                    url: ((uid === undefined) ? '/cloudapp/kq/user/logs' : '/cloudapp/kq/user/log/'+ uid +' '),
                    type: "GET",
                    timeout: 1e3,
                    dataType: "json",
                    data: {},
                    success: function(res) {
                        util.hideLoading();
                        if (res.code == 0) {
                            var data = res.data;
                            $listRecord.find('>').remove();
                            $.each(data, function(i, n) {
                                var w = (n.finger_status == 0) ? 'disabled' : '',
                                    a = (n.finger_status == 0) ? '未打卡' : '已打卡(1)',
                                    d = (n.finger_status == 0) ? 'kq-list-status-disabled' : '';
                                 //$listIndex.append($('<div class="kq-list-item"><div class="kq-list-content"><div>' + n.name + '</div><div>(' + n.finger_count + ')</div></div><div class="kq-list-btn"><a href="javascript:;" data-user_id="' + n.user_id + '"><button type="button" class="kq-button kq-button-md kq-button-white kq-button-light" kq-mode="small ' + w + '">' + a + '</button></a></div></div>'));
                                $listRecord.append($('<div class="kq-list-item">\
                                  <div class="kq-list-content">\
                                    <div class="kq-list-info">\
                                      <a href="javascript:;"><img class="icon-active" src="./images/avatar.jpg"></a>\
                                      <span class="kq-list-info-name">' + n.name + '</span>\
                                    </div>\
                                    <div class="kq-list-text">\
                                        <div class="kq-list-status '+ d +'">'+ a +'</div>\
                                        <span class="kq-list-text-date">' + util.formatDate(n.time, true) + '</span>\
                                    </div>\
                                  </div>\
                                </div>'));
                            });
                        } else {
                            util.hint(data.errorMsg);
                        }
                    },
                    error: function() {
                        util.hint('网络错误，请重试');
                    }
                });
            };

            //添加考情员工  //cloudapp/kq/user/add
            var getAdd = function(data) {
                $.ajax({
                    url: '/cloudapp/kq/user/'+ sn +'',
                    type: "post",
                    timeout: 1e3,
                    dataType: "json",
                    data:JSON.stringify(data),
                    headers: {'Content-Type': 'application/json'},
                    success: function(res) {
                        if(res.code ==0){
                            util.hint('添加员工成功');
                            util.hideLoading();
                            getUsers();
                        }else{
                            util.hint(res.errorMsg);
                        }
                    },
                    error: function() {
                        util.hint('网络错误，请重试');
                    }
                });
            };

            //接收指纹录入结果
            var setWebSocket = function(uid){
                /*sock.onopen = function(){
                    sock.send(JSON.stringify({time:(new Date().getTime)}));
                };
                sock.onmessage = function(e){
                    var data = JSON.parse(e.data);
                    console.log("data",data);
                    sock.close();
                };
                sock.onclose = function(){
                    console.log('close');
                };
                sock.onerror = function(){
                };*/
            };

            //录入指纹  //device/kq/finger/{user_id}
            var getFinger = function(sn, uid) {
                $.ajax({
                    url: '/cloudapp/kq/finger/'+ sn +'/'+ uid +'',
                    type: "POST",
                    timeout: 1e3,
                    dataType: "json",
                    data: JSON.stringify({time:(new Date().getTime())}),
                    success: function(res) {
                        if(res.code == 0){
                            setWebSocket(uid);
                        }else{
                            util.hint(res.errorMsg);
                        }
                    },
                    error: function(res) {
                        util.hint('网络错误，请重试');
                    }
                });
            };

            // init
            getUsers();
            
            $listIndexBtn.on('click',function(){
                $listRecord.hide();
                $listIndex.show();
                getUsers();
            }); 

            $listRecordBtn.on('click',function(){
                $listIndex.hide();
                $listRecord.show();
                getRecord();
            });
            // 添加考情员工
            $addUser.on('click',function(){
                deli.app.user.select({
                    "id":"355671868335718400",
                    "name": "可选人员",
                    "mode": "multi",
                    "root_dept_id": "355671868335718401",
                    "max": 200,
                    "selected_dept_ids": ["355672617635545088", "362618666346348544"],
                    "disabled_dept_ids": ["355672596013907968", "360009358211284992"]
                }, function(data) {
                    var res = JSON.parse(data);
                    util.showLoading();
                    if(res.code == 0){
                        getAdd(res.data);
                    }
                }, function(resp) {
                    console.log("resp",resp);
                });
            });
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
        }
    };
    Page.init();
    // 验证签名成功
    deli.ready(function() {});
    // 验证签名失败
    deli.error(function(resp) {
        alert(JSON.stringify(resp));
    });
});
