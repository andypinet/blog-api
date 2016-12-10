/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var socket = io("https://localhost:7000");
	var utils = __webpack_require__(1);

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
	            var label = Array.prototype.slice.call(document.querySelectorAll(".copyright-wrp [data-article-copyright]"))[1];
	            label.dispatchEvent(new Event("click"));
	        });
	    }
	    window.utils = utils;
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	function saveAction(action) {
	    localStorage.setItem("extension_action", action)
	}

	function gotoBilibiliSubmit() {
	    saveAction("open bilibili download");
	}

	function findAndReplace(searchText, replacement, onFind, searchNode) {
	    if (!searchText || typeof replacement === 'undefined') {
	        // Throw error here if you want...
	        return;
	    }
	    var regex = typeof searchText === 'string' ?
	            new RegExp(searchText, 'g') : searchText,
	        childNodes = (searchNode || document.body).childNodes,
	        cnLength = childNodes.length,
	        excludes = 'html,head,style,title,link,meta,script,object,iframe';
	    while (cnLength--) {
	        var currentNode = childNodes[cnLength];
	        if (currentNode.nodeType === 1 &&
	            (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
	            findAndReplace(searchText, replacement, onFind, currentNode);
	        }
	        if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
	            continue;
	        }
	        var parent = currentNode.parentNode,
	            frag = (function(){
	                var html = currentNode.data.replace(regex, replacement),
	                    wrap = document.createElement('div'),
	                    frag = document.createDocumentFragment();
	                wrap.innerHTML = html;
	                while (wrap.firstChild) {
	                    frag.appendChild(wrap.firstChild);
	                }
	                return frag;
	            })();
	        parent.insertBefore(frag, currentNode);
	        parent.removeChild(currentNode);
	        if (onFind) {
	            onFind(parent);
	        }
	    }
	}

	function checkSite(host) {
	    return window.location.host.match(host) && window.location.host.match(host).length > 0;
	}

	function checkRouter(reg) {
	    return window.location.pathname.match(reg) && window.location.pathname.match(reg).length > 0;
	}

	function autoGo(socket) {
	    socket.emit("auto go", "");
	}

	function translate(socket, data = {}) {
	    socket.emit("translate", data);
	}

	function translateCompelete(socket, onComplete) {
	    socket.on("translate complete", function (data) {
	        onComplete(data);
	    });
	}

	module.exports = {
	    findAndReplace,
	    checkSite,
	    checkRouter,
	    saveAction,
	    gotoBilibiliSubmit,
	    autoGo,
	    translate,
	    translateCompelete
	};

/***/ }
/******/ ]);