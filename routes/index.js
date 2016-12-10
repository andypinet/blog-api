var router = require('koa-router')();
var fs = require('fs');

router.get('/', function (ctx, next) {
    ctx.body = JSON.stringify({
        markdown: fs.readFileSync(`./data/${ctx.request.query.articleName}.md`, "utf8")
    })
});

router.get('/articles', function (ctx, next) {
    ctx.body = JSON.stringify([
        {
            title: "article1"
        }
    ])
});

module.exports = router;