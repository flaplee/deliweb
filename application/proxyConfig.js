'use strict';
module.exports = [{
    remote: 'http://192.168.0.201:9001/',
    local: {
        prefix: '/',
        root: './',
        index: 'index.html'
    },
    port: 3000
}, {
    remote: 'http://192.168.0.201:9001/',
    local: {
        prefix: '/',
        root: './',
        index: 'detail.html'
    },
    port: 3001
}, {
    remote: 'http://192.168.0.201:9001/',
    local: {
        prefix: '/',
        root: './',
        index: 'deviceDetail.html'
    },
    port: 3002
}];