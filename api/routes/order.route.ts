import OrderController from '../controllers/order.controller';
import { Router } from '../../core/http/index';
import { ResponseHandler } from '../../core/http/custom-response';

export default (router: Router) => {
    let responseHandler: ResponseHandler;

    router.get('/api/order/list', async (req, res) => {
        responseHandler = new ResponseHandler(res);
        try {
            const result = await OrderController.list(req.pathParams.id ?? '');
            responseHandler.success(result, 200);
        } catch (e) {
            responseHandler.handleErrors(e);
        }
    });

    router.get('/api/order/{id}', async (req, res) => {
        responseHandler = new ResponseHandler(res);
        try {
            const result = await OrderController.get(req.pathParams.id ?? '');
            responseHandler.success(result, 200);
        } catch (e) {
            responseHandler.handleErrors(e);
        }
    });

    router.post('/api/order', async (req, res) => {
        responseHandler = new ResponseHandler(res);
        try {
            const result = await OrderController.create(req.body);
            responseHandler.success(result, 200);
        } catch (e) {
            responseHandler.handleErrors(e);
        }
    })

    router.patch('/api/order/{id}', async (req, res) => {
        responseHandler = new ResponseHandler(res);
        try {
            const result = await OrderController.update(req.pathParams.id ?? '', req.body);
            responseHandler.success(result, 200);
        } catch (e) {
            responseHandler.handleErrors(e);
        }
    })

    router.delete('/api/order/{id}', async (req, res) => {
        responseHandler = new ResponseHandler(res);
        try {
            const result = await OrderController.delete(req.pathParams.id ?? '');
            responseHandler.success(result, 200);
        } catch (e) {
            responseHandler.handleErrors(e);
        }
    })
}
