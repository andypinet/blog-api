import Koa from 'koa'
import Router from 'koa-router';
import Cors from 'koa-cors';
import IndexRouter from './routes/index';
const app = new Koa();
var router = Router();

// response
router.use('/', IndexRouter.routes());

app.use(Cors());

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => console.log('server started 3000'));

export default app

