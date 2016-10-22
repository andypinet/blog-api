var router = require('koa-router')();
var fs = require('fs');

router.get('/', function (ctx, next) {
    console.log(ctx.request.query.articleName);
    ctx.body = JSON.stringify({
        markdown: fs.readFileSync(`./data/${ctx.request.query.articleName}.md`, "utf8")
    })
});
module.exports = router;