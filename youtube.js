var socket = io("https://localhost:7000");
var utils = require("./utils");

$(function () {
    if (utils.checkSite(/translate.google.com/)) {
        console.log("translate");
        socket.emit("what i need to translate");

        socket.on("this is your translate data", function (data) {
            document.querySelector("#source").value = data.text;
        });

        setTimeout(function () {
            socket.emit("i have translate", {
                text: document.querySelector("#result_box").innerText
            });
            utils.gotoBilibiliSubmit();
        }, 3000);

        setTimeout(function () {
            utils.autoGo(socket);
        }, 4000);
    }
    if (utils.checkSite(/www.youtube.com/)) {
        if (utils.checkRouter(/\/channel/)) {
            var search = "4 天前";
            var isFind = false;
            var findele = {};
            utils.findAndReplace(search, function(term){
                isFind = true;
                return '<span class="ls-keyword">' + term + '</span>';
            }, function (findnode) {
                findele = $(findnode).parent().parent().parent().parent();
                window.location.href = window.location.origin + findele.find(".yt-uix-sessionlink.yt-uix-tile-link").attr("href");
            });
            setTimeout(function () {
                if (!isFind) {
                    window.location.reload();
                }
            }, 10000);
        }
        if (utils.checkRouter(/\/watch/)) {
            // document.querySelector("#savefrom__yt_btn .sf-quick-dl-btn").dispatchEvent(new Event("click"));
            setTimeout(function () {
                utils.translate(socket, {
                    url: window.location.href,
                    text: document.querySelector("#eow-title").innerText
                });
            }, 3000);
        }
    }

    if (utils.checkSite(/member.bilibili.com/)) {
        console.log("终于要开始了吗");

        var videoInfo = {};
        socket.emit("what i have videoinfo");

        socket.on("this is your videoinfo", function (data) {
            videoInfo = data;
        });

        socket.on("anu go comelete", function (data) {
            // var label = Array.prototype.slice.call(document.querySelectorAll(".copyright-wrp [data-article-copyright]"))[1];
            // label.dispatchEvent(new Event("click"));
            // document.querySelector(".copyright-wrp .bili-input").value = videoInfo.url;
            // document.querySelector(".title-wrp .bili-input").dispatchEvent(new Event("focus"));
            // document.querySelector(".title-wrp .bili-input").value = videoInfo.text;
            // document.querySelector(".title-wrp .bili-input").dispatchEvent(new Event("blur"));
            // document.querySelector(".tag-wrp .bili-input").dispatchEvent(new Event("keydown", {
            //     which: 13,
            //     keyCode: 13
            // }));
            document.querySelector(".template-hint").dispatchEvent(new Event("click"));
            document.querySelector(".template-menu .menu-item").dispatchEvent(new Event("click"));
            document.dispatchEvent(new Event("click"));
            document.querySelector(".copyright-wrp .bili-input").value = videoInfo.url;
            document.querySelector(".title-wrp .bili-input").value = videoInfo.text;
            document.querySelector(".template-description-wrp textarea").value = videoInfo.text;
            document.querySelector(".submit-btn").dispatchEvent(new Event("click"));
        });
    }
    window.utils = utils;
});