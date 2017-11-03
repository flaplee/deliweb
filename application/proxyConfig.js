'use strict';
module.exports = [{
	// http://test3.delicloud.cn:9001/
    remote: 'http://192.168.0.201:9001/',
    local: {
        prefix: '/',
        root: './',
        index: 'index.html'
    },
    port: 3001
},
{
	// http://192.168.0.201:9001/
    remote: 'http://192.168.0.201:9001/',
    local: {
        prefix: '/',
        root: './',
        index: 'dev_list.html'
    },
    port: 3002
},
{
	// http://192.168.0.201:9001/
    remote: 'http://192.168.0.201:9001/',
    local: {
        prefix: '/',
        root: './',
        index: 'dev_detail.html'
    },
    port: 3003
}];