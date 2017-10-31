seajs.config({
    base: '/',
    alias: {
        jquery:'js/jquery.js',
        util: 'js/util.js',
        fastclick: 'js/fastclick.js',
        swiper: 'js/swiper.jquery.min.js'
    }
});
seajs.use(['jquery', 'util', 'fastclick', 'swiper'], function(jquery, util, fastclick, swiper) {
    var Page = {
        init: function() {
            var self = this;
            FastClick.attach(document.body);
            self.bindEvt();
        },
        bindEvt: function() {
            $page = $('#page');
            var swipeDevice = new Swiper('.equdetail-device.swiper-container', {
                loop: true,
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
        }
    };
    Page.init();
});