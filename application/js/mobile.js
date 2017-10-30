var browser = (function() {
    'use strict';
    var M, browser = {
        platform: 'unknown',
        name: 'unsupported',
        version: 0
    };
    if (navigator.userAgent.match(/Android/)) {
        browser.platform = 'Android';
        if (M = navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/)) {
            browser.name = M[1];
            browser.version = M[2];
        }
    } else if (M = navigator.userAgent.match(/(iPhone|iPad|iPod)(?: Touch)?; CPU(?: iPhone)? OS ([\d_\.]+)/)) {
        browser.platform = M[1];
        browser.name = 'IOS';
        browser.version = M[2].replace(/_/g, '.');
    } else if (navigator.userAgent.match(/Windows/)) {
        browser.platform = 'Windows';
        if (M = navigator.userAgent.match(/(Trident)\/([\d\.]+).+Touch/)) {
            browser.name = M[1];
            browser.version = M[2];
        } else if ((navigator.maxTouchPoints || window.TouchEvent) && (M = navigator.userAgent.match(/(Chrome|Firefox)\/([\d\.]+)/))) {
            browser.name = M[1];
            browser.version = M[2];
        }
    }
    if (navigator.userAgent.match(/QQ\/[\d\.]+/i)) {
        browser.app = 'QQ';
    } else if (navigator.userAgent.match(/micromessenger\/[\d\.]+/i)) {
        browser.app = 'WeChat';
    } else if (navigator.userAgent.match(/WeiBo/i)) {
        browser.app = 'WeiBo';
    }
    if (window.top === window) {
        var s, t, sw, ww;
        if (browser.name === 'Firefox') {
            s = calcRato(Math.min(screen.width, screen.height));
            document.write('<meta name="viewport" content="user-scalable=no, width=' + 100 / s + '%, initial-scale=' + s + ', maximum-scale=' + s + ', minimum-scale=' + s + '"/>');
        } else if (browser.name === 'Trident') {
            document.write('<meta name="viewport" content="width=device-width, user-scalable=no"/>');
            document.documentElement.style.zoom = calcRato(Math.min(screen.width, screen.height));
        } else {
            t = document.createElement('meta');
            t.name = 'viewport';
            t.content = 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1';
            document.head.appendChild(t);
            sw = Math.min(screen.width, screen.height);
            ww = Math.min(window.innerWidth, window.innerHeight);
            if (sw >= ww * devicePixelRatio) {
                document.documentElement.style.zoom = calcRato(sw / devicePixelRatio);
            } else {
                s = calcRato(sw);
                t.content = 'user-scalable=no, width=' + 100 / s + '%, initial-scale=' + s + ', maximum-scale=' + s + ', minimum-scale=' + s;
            }
        }
    }
    return browser;

    function calcRato(sw) {
        var step = 0.125;
        var zoom = sw / 320;
        //放大时不使用线性算法
        if (zoom > 1) {
            zoom = Math.floor(Math.sqrt(zoom) / step) * step;
        }
        return zoom;
    }
})();