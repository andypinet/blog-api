var socket = io('http://192.168.31.129:7000');
socket.on('news', function (data) {
    if (data.type == 'play') {
        $(".bilibili-player-video-btn-start").trigger("click");
    } else if (data.type == 'danmu') {
        $(".bilibili-player-video-btn-danmaku").trigger("click");
    }  else if (data.type == 'screen') {
        $(".bilibili-player-video-web-fullscreen").trigger("click");
    }
});

window.setTimeout(function () {
    var pattern = function pattern(date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
            "H+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        // 解决时差问题
        o["h+"] = o["h+"] + date.getTimezoneOffset() / 60;
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468" : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    };

    var oneHour = 60 * 60;
    var hourformat = "HH:mm:ss";
    var minuteformat = "mm:ss";

    window.globalzhilizhili = {};
    /**
     * b站video元素
     * @type {HTMLVideoElement}
     */
    window.globalzhilizhili.video = document.querySelector("video");
    window.globalzhilizhili.seek = function (time) {
        if (time < 1) {
            return false;
        }
        if (time > window.globalzhilizhili.video.duration - 1) {
            return false;
        }
        window.globalzhilizhili.video.currentTime = time;
    };
    window.globalzhilizhili.getFormatTime = function (time) {
        var timearr = time.split(":");
        if (timearr.length > 2) {
            var hour = timearr[0] + 8;
            if (hour < 10) {
                hour = '0' + hour;
            }
            var minutes = timearr[1];
            var seconds = timearr[2];
        } else {
            var hour = '08';
            var minutes = timearr[0];
            var seconds = timearr[1];
        }
        return new Date(`Thu Jan 01 1970 ${hour}:${minutes}:${seconds} GMT+0800 (CST)`).valueOf() / 1000;
    };
    window.globalzhilizhili.goToFormatTime = function (time) {
        var parsetime = window.globalzhilizhili.getFormatTime(time);
        window.globalzhilizhili.seek(parsetime);
    };
    window.globalzhilizhili.volume = function (value) {
        window.globalzhilizhili.video.volume = value;
    };
    window.globalzhilizhili.format = function (time) {
        if (time > oneHour) {
            return pattern(new Date(time * 1000), hourformat);
        } else {
            return pattern(new Date(time * 1000), minuteformat);
        }
    };
    window.globalzhilizhili.formatDuartion = function () {
        return window.globalzhilizhili.format(window.globalzhilizhili.video.duration);
    };
    window.globalzhilizhili.plist = {};
    window.globalzhilizhili.plist.currentIndex = 0;
    window.globalzhilizhili.plist.arr = [];
    window.globalzhilizhili.getPlist = function () {
        var plistArr = [];
        var dom = document.querySelector(".plist-content");
        if (dom.children.length > 0) {
            var childNodes = Array.prototype.slice.call(dom.children).filter(function (v) {
                return !v.classList.contains("v-part-toggle");
            });
            childNodes.forEach(function (v, index) {
                if (v.tagName == 'SPAN') {
                    plistArr.push({
                        current: true,
                        value: window.location.pathname
                    });
                    window.globalzhilizhili.plist.currentIndex = index;
                } else {
                    plistArr.push({
                        current: false,
                        value: v.getAttribute("href")
                    });
                }
            });
            window.globalzhilizhili.plist.arr = plistArr;
        }
    };
    window.globalzhilizhili.plist.select = function (index) {
        var location = window.globalzhilizhili.plist.arr[index];
        if (location && location.value && !location.current) {
            window.location.href = location.value;
        }
    };
    window.globalzhilizhili.getPlist();

    // 网页全屏
    window.globalzhilizhili.isFullScreen = false;
    window.globalzhilizhili.webFullScreen = function () {
        var videoplayer = document.querySelector(".bilibili-player-video");
        var arctoolbar = document.querySelector(".arc-toolbar");
        var controlbar = document.querySelector(".bilibili-player-video-control");
        var controlbarProgress = controlbar.querySelector(".bilibili-player-video-progress");
        var sendbar = document.querySelector(".bilibili-player-video-sendbar");
        var sendbarinput = sendbar.querySelector(".bilibili-player-video-inputbar");
        var gotop = document.querySelector(".gotop");
        if (!window.globalzhilizhili.isFullScreen) {
            window.globalzhilizhili.isFullScreen = true;
            videoplayer.setAttribute('style', `
                position: fixed;
                left: 0;
                top: 0;
                z-index: 1000;
                height: calc(100% - ${sendbar.offsetHeight}px - ${controlbar.offsetHeight}px)
            `);
            arctoolbar.setAttribute("hidden", "");
            controlbar.setAttribute("style", `
                display: flex;
                bottom: ${sendbar.offsetHeight}px;
                position: fixed;
                left: 0;
            `);
            sendbar.setAttribute("style", `
                display: flex;
                position: fixed;
                left: 0;
                bottom: 0;
            `);
            sendbarinput.setAttribute("style", `
                flex: 1
            `);
            controlbarProgress.setAttribute("style",`
                flex: 1
            `);
            gotop.setAttribute("hidden", "");
            document.body.setAttribute("style", `
                overflow: hidden
            `);
        } else {
            window.globalzhilizhili.isFullScreen = false;
            videoplayer.removeAttribute("style");
            arctoolbar.removeAttribute("hidden");
            sendbar.removeAttribute("style");
            controlbar.removeAttribute("style");
            controlbarProgress.removeAttribute("style");
            sendbarinput.removeAttribute("style");
            gotop.removeAttribute("hidden");
            document.body.removeAttribute("style");
        }
    };
}, 3000);