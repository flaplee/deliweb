seajs.config({
    base: '/',
    alias: {
        jquery:'js/jquery.js',
        util: 'js/util.js'
    }
});
seajs.use(['jquery', 'util'], function(jquery, util) {
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
            //获取指纹列表  ///device/kq/users
            var getUsers = function() {
                $.ajax({
                    url: '/json/users.json',// /cloudapp/kq/users
                    type: "GET",
                    timeout: 1e3,
                    contentType:"application/json",
                    dataType: "json",
                    data: {},
                    success: function(res) {
                        $loading.hide();
                        var data = res.obj;
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
                                    <span>员工编号:' + n.finger_count + '</span>\
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
                            var c = $(this), user_id = c.attr('data-user_id'),user_name = c.parent('.kq-list-btn').siblings('.kq-list-content').find('.kq-list-info .kq-list-info-name').text();
                            util.htmlDialog('\
                                <div style="padding:10px;font-weight:bold;font-size:14px;text-align:center;">请“'+ user_name  +'“录入指纹</div>\
                                <div style="font-size: 12px; line-height: 18px; text-align: justify; width: 90px; height: 90px; margin: 10px 75px; text-align: center; display: block;" id="finger-status" class="finger-status finger-status-img"></div>\
                                <div style="text-align:center;">\
                                    <a style="margin:10px;vertical-align:top;display:none;" class="" href="javascript:;" target="_blank">我知道了</a>\
                                    <a style="margin:10px;vertical-align:top;display:none;" class="" href="javascript:;" target="_blank">取消</a>\
                                    <a style="margin:10px;vertical-align:top;display:none;" class="timeout" href="javascript:;" target="_blank">取消</a>\
                                    <a style="margin:10px;vertical-align:top;display:none;;" class="timeout" href="javascript:;" target="_blank">重试</a>\
                                </div>\
                            '.replace(/   |  /g, ''), 'fingerBox');
                            getFinger(user_id);
                        });
                        //console.log("users", data);
                    },
                    error: function() {}
                });
            };

            //获取打卡数据
            var getRecord = function(){
                $.ajax({
                    url: '/json/record.json',
                    type: "GET",
                    timeout: 1e3,
                    dataType: "json",
                    data: {},
                    success: function(res) {
                        $loading.hide();
                        if (res.code == 0) {
                            var data = res.data;
                            $listRecord.find('>').remove();
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
                                        <span>员工编号:' + n.finger_count + '</span>\
                                    </div>\
                                  </div>\
                                  <div class="kq-list-btn">\
                                    <a href="javascript:;" data-user_id="' + n.user_id + '">\
                                      <button type="button" class="kq-button kq-button-md kq-button-white kq-button-light" kq-mode="small">录入指纹</button>\
                                    </a>\
                                  </div>\
                                </div>'));
                            });
                        } else {
                            alert("网络错误，请重试");
                        }
                        console.log("users", data);
                    },
                    error: function() {}
                });
            };

            //添加考情员工  //cloudapp/kq/user/add
            var getAdd = function(data) {
                $.ajax({
                    url: '/cloudapp/kq/user/add',
                    type: "post",
                    timeout: 1e3,
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: function(res) {
                        console.log("add", res);
                        if(res.code == 0){ 
                        }
                    },
                    error: function() {}
                });
            };

            //录入指纹  //device/kq/finger/{user_id}
            var getFinger = function(user_id) {
                $.ajax({
                    url: '/cloudapp/kq/finger/' + user_id,
                    type: "POST",
                    timeout: 1e3,
                    dataType: "json",
                    data: {},
                    success: function(res) {
                        console.log("finger", res);
                        if(res.obj == true){
                            $('#finger-status').addClass('finger-status-img1');
                        }else{
                            window.setTimeout(function(){
                                getFinger(user_id);
                            },60000);
                        }
                    },
                    error: function(res) {
                        $('#finger-status').addClass('finger-status-img2');
                        window.setTimeout(function(){
                            getFinger(user_id);
                        },60000);
                    }
                });
            };

            // init
            getUsers();
            
            $listIndexBtn.on('click',function(){
                getUsers();
            }); 

            $listRecordBtn.on('click',function(){
                getFinger();
            });

            $addUser.on('click',function(){
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
                    var res = JSON.parse(data);
                    if(res.code == 0){
                        getAdd(res.data);
                    }
                }, function(resp) {
                    console.log("resp",data);
                });
                /*var data = {
                    "users":[{
                        "avatar":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508327196283&di=85b33e8e857ce30f5172018f125204f1&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fa08b87d6277f9e2f35b6f4c81630e924b999f36b.jpg",
                        "name": "石头",
                        "user_id": "355671868335718401",
                        "empno": "1234567890"
                    },
                    {
                        "avatar":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1508327196283&di=85b33e8e857ce30f5172018f125204f1&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fa08b87d6277f9e2f35b6f4c81630e924b999f36b.jpg",
                        "name": "石头2",
                        "user_id": "355671868335718402",
                        "empno": "1234567891"
                    }]
                };*/
                //getAdd(data);
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
