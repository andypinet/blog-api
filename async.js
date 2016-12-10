var getParams = require('node-jquery-param');
var fetch = require('node-fetch');
var FormData = require('form-data');
var redis = require("redis");
var client = redis.createClient();
const EventEmitter = require('events');

class $Http {
    static handleData(data) {
        var formData = new FormData();
        var keys = Object.keys(data);
        keys.forEach(function (key) {
           formData.append(key, data[key]);
        });
        return formData;
    }
    static get(url) {
        return fetch(url, {
            method: 'get'
        });
    }
    static post(url, data) {
        var form = this.handleData(data);
        return fetch(url, {
            method: 'post',
            body: form
        });
    }
    static put(url, data) {
        var form = this.handleData(data);
        return fetch(url, {
            method: 'put',
            body: form
        });
    }
    static delete(url) {
        return fetch(url, {
            method: 'delete'
        });
    }
}

class NetService {
    constructor(settings = {}) {
        this.settings = Object.assign({
            apiProtol: "http",
            apiAddress: "",
            apiVersion: ""
        }, settings);
    }
    resolveUrl(controller, params = {}, expand = '') {
        return this.buildUrl(controller, params, expand);
    }
    buildUrl(controller, params = {}, expand = '') {
        return `${this.settings.apiProtol}://${this.settings.apiAddress}/${this.settings.apiVersion}/${controller}${expand}?${getParams(params)}`;
    }
    request(controller, params, expand) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(10);
            }, 3000);
        });
    }
}

class CommonNetService extends NetService {
    constructor() {
        super({
            apiAddress: "",
            apiVersion: ""
        });
        this.lastRequest = {
            url: "",
            method: "",
            time: ""
        };
    }
    afterResponse(res) {
    }
    handleServerError(code, json) {
    }
    handleError(e){
        console.log(e);
    }
    handleController(controller) {
        return controller;
    }
    handleRequest(request = {}) {
        var self = this;
        self.lastRequest = Object.assign(self.lastRequest, request);
    }
    async all(controller, params, expand = '') {
        var self = this;
        var expandStr = expand;
        var json = {};
        var resController = this.handleController(controller);
        var requestUrl = self.resolveUrl(resController, params, expandStr);
        this.handleRequest({
            url: requestUrl,
            method: "all",
            time: Date.now()
        });
        try {
            var ret = await $Http.get(requestUrl);
            try {
                json = await ret.json();
                if (json.code) {
                    this.handleServerError(json.code, json);
                    return false;
                } else {
                    return json;
                }
            } catch (e) {
                this.handleError(e);
            }
        } catch (e) {
            this.handleError(e);
        }
    }
    async get(controller, id, params, expand = '') {
        var self = this;
        var expandStr = "/" + id + expand;
        var json = {};
        var resController = this.handleController(controller);
        var requestUrl = self.resolveUrl(resController, params, expandStr);
        this.handleRequest({
            url: requestUrl,
            method: "get",
            time: Date.now()
        });
        try {
            var ret = await $Http.get(requestUrl);
            try {
                json = await ret.json();
                if (json.code) {
                    this.handleServerError(json.code, json);
                    return false;
                } else {
                    return json;
                }
            } catch (e) {
                this.handleError(e);
            }
        } catch (e) {
            this.handleError(e);
        }
    }
    async post(controller, data, params, expand = '') {
        var self = this;
        var expandStr = expand;
        var json = {};
        var resController = this.handleController(controller);
        var requestUrl = self.resolveUrl(resController, params, expandStr);
        this.handleRequest({
            url: requestUrl,
            method: "post",
            time: Date.now()
        });
        try {
            var ret = await $Http.post(requestUrl, data);
            try {
                json = await ret.json();
                if (json.code) {
                    this.handleServerError(json.code, json);
                    return false;
                } else {
                    return json;
                }
            } catch (e) {
                this.handleError(e);
            }
        } catch (e) {
            this.handleError(e);
        }
    }
    async put(controller, id, data, params, expand = '') {
        var self = this;
        var expandStr = "/" + id + expand;
        var json = {};
        var resController = this.handleController(controller);
        var requestUrl = self.resolveUrl(resController, params, expandStr);
        this.handleRequest({
            url: requestUrl,
            method: "put",
            time: Date.now()
        });
        try {
            var ret = await $Http.put(requestUrl, data);
            try {
                json = await ret.json();
                if (json.code) {
                    this.handleServerError(json.code, json);
                    return false;
                } else {
                    return json;
                }
            } catch (e) {
                this.handleError(e);
            }
        } catch (e) {
            this.handleError(e);
        }
    }
    async delete(controller, params, expand = '') {
        var self = this;
        var expandStr = "/" + id + expand;
        var json = {};
        var resController = this.handleController(controller);
        var requestUrl = self.resolveUrl(resController, params, expandStr);
        this.handleRequest({
            url: requestUrl,
            method: "delete",
            time: Date.now()
        });
        try {
            var ret = await $Http.delete(requestUrl);
            try {
                json = await ret.json();
                if (json.code) {
                    this.handleServerError(json.code, json);
                    return false;
                } else {
                    return json;
                }
            } catch (e) {
                this.handleError(e);
            }
        } catch (e) {
            this.handleError(e);
        }
    }
}

class MyNetService extends CommonNetService {
    constructor(controller = "") {
        super();
        this.controller = controller;
    }
    handleServerError(code, json) {
        commonHandleServerError(code, json);
    }
    handleController(controller) {
        return this.controller;
    }
    handleRequest(request) {
        super.handleRequest(request);
    }
    handleError(e) {
        var self = this;
        console.log(`在${new Date(self.lastRequest.time)} 用${self.lastRequest.method}请求${self.lastRequest.url}错误`);
    }
}

class RestService extends MyNetService {
    constructor(controller) {
        super(controller);
        this.settings = {
            apiAddress: "api.console.aunbox.cn.hankin:80",
            apiVersion: "v1"
        };
    }
}

class DataService extends MyNetService {
    constructor(controller) {
        super(controller);
        this.settings = {
            apiAddress: "api.console.aunbox.cn.hankin:80",
            apiVersion: "d1"
        };
    }
}

function commonHandleServerError(code, json) {
    console.dir(code);
    if (code == 2002) {
        console.log("你麻痹");
    }
}

// client
class DB {
    constructor() {
        this.updateexpire = 15 * 60;
        this.expire = 2 * 3600;
    }
    save(data) {
        var self = this;
        return new Promise(function () {
            client.set("token", data, function () {
                client.expireat("token", parseInt((+new Date)/1000) + self.expire);
                resolve();
            });
            client.set("update_token", data, function () {
                client.expireat("update_token", parseInt((+new Date)/1000) + self.expire - self.updateexpire);
            });
        })
    }
    async get(key) {
        return new Promise(function (resolve, reject) {
            client.get(key, function (err, updateToken) {
                if (err) {
                    reject();
                }
                resolve(updateToken);
            });
        })
    }
}

class TokenDB extends DB {
    constructor() {
        super();
        this.updateexpire = 60;
        this.expire = 180;
    }
}

class CompouterService extends RestService {
    constructor() {
        super("computer");
    }
}

class LoginService extends RestService {
    constructor() {
        super();
    }
    async login(user) {
        return await this.post("tokens", user);
    }
    async putToken(token) {
        return await this.put("tokens", 0, {
            token: token
        });
    }
    async deleteToken(token) {
        return await this.delete("tokens", 0, {
            token: token
        });
    }
}

var httpClient = new LoginService();
var tokenDb = new TokenDB();

async function read() {
    try {
        var res = await httpClient.putToken("c98d4cfbeb2066eb992dba8f13c65550");
        if (res) {
            // tokenDb.save(res.token);
        }
    } catch (e) {
        console.log(e);
    }
}

// read();

async function updateToken() {
    var res = await httpClient.putToken(token);
    return new Promise(function (resolve, reject) {
        if (res) {
            tokenDb.save(res.token).then(function () {
                resolve(true);
            });
        } else {
            resolve(false);
        }
    })
}

async function check() {
    try {
        var updateToken = await tokenDb.get("update_token");
        var token = await tokenDb.get("token");
        if (!updateToken) {
            if (!token) {
                console.log("expire");
                // 过期就触发退出事件
                myEvent.emit("readyTogout", function () {
                    console.log('sdsds');
                    setTimeout(function () {
                        lock = false;
                    }, 1000);
                });
            } else {
                console.log("need update token");
                // 快要过期就在一次所有请求后加入一个updateToken请求
                myEvent.emit("readytogo", function () {
                    updateToken().then(function () {
                        lock = false;
                    });
                });
            }
        } else {
            myEvent.emit("readytogo", false);
        }
    } catch (e) {
        console.log(e);
    }
}


var myEvent = new EventEmitter();


var com = new CompouterService();

var queue = [];

var fatherAngularControl = function () {
    check();
};

var angularcontrl = function () {
    queue.push(function () {
       com.all({});
    });
    setTimeout(function () {
        console.log(lock);
        if (lock) {

        }
    }, 1000);
};

var lock = false;

myEvent.on("readytogo", function (updateTokenFunc) {
    console.log("sdsdsdsds");
    queue.forEach(function (service, index) {
        service();
        if (index > queue.length - 1) {
            // 不急着更新service而是在一次service发送结束后 更新一次token
            if (updateTokenFunc) {
                lock = true;
                updateTokenFunc();
            }
        }
    });
});

myEvent.on("readyTogout", function (afterGoOut) {
    if (afterGoOut) {
        lock = true;
        afterGoOut();
    }
});

function hasLogin() {
    fatherAngularControl();
    angularcontrl();
}

