import Koa from 'koa'
import Router from 'koa-router';
import Cors from 'koa-cors';
import IndexRouter from './routes/index';
const app = new Koa();
var router = Router();

// response
router.use('/index', IndexRouter.routes());

app.use(Cors());

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(7400, () => console.log('server started 7400'));

export default app

