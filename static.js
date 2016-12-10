var exec = require("child_process").exec;

exec("http-server './static' -p 9000", function () {
});