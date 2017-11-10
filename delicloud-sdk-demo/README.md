# delicloud-sdk-demo

文件夹demo为应用开发例子
文件夹docs包含JS-SDK文档、apk包、截图
文件夹sdk 包含delicloud.min.js 

## 支持

"appId":"355373255801962497"

"appKey":"bbTMIYs8bHww6Zq9AUd5tfXX"
 
app登录账户和密码: 13163216355 qwer1234

support ios and android

## 描述

JS-SDK 为H5页面提供了部分原生UI控件或者服务的JS接口

## 使用说明

步骤一：引入JS文件

步骤二：通过config接口验证配置

步骤三：通过ready接口处理成功验证

步骤四：通过error接口处理失败验证

接口调用说明：

具体参考docs文件夹的文档 “得力云JS-SDK.docx”


## 用法

应用需要在app中打开，现在提供的apk/ipa，支持扫码打开应用url;

具体用法请查看demo文件夹中的示例;

简单用法说明：

```html

引入JS文件

<script src="js/delicloud.min.js"></script>

or

<script src="http://static.delicloud.com:8181/js/delicloud.min.js"></script>

```

```js

服务器计算签名，签名相关信息返回前端，前端将相关信息放置在deli.config进行验证

下面例子为一组可用的签名结果：

deli.config({
    noncestr: "abcdefg", // 必填，生成签名的随机串
    serviceId: "355373255801962497", // 必填，应用ID
    timestamp: "1508755836143", // 必填，生成签名的时间戳
    signature: "b8386dc73145bb2e2ec76a0078638df7", // 必填，服务端生成的签名
    jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
});

deli.ready(function() {
    // to do
});

deli.error(function(resp) {
    // { "code" : "-1","msg" : "权限校验失败"}
});

```
## Test

JS-SDK DEMO Test