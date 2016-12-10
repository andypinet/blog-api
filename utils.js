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