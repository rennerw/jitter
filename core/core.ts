import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
  type Server,
} from 'node:http';
import { customResponse, customRequest, Router } from './http/index';
import { ResponseHandler } from './http/custom-response';

export class Core {
  router: Router;
  server: Server;
  constructor() {
    this.router = new Router();
    this.server = createServer(this.handler);
  }

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    const req = await customRequest(request);
    const res = customResponse(response);
    const responseHandler = new ResponseHandler(res);
    const matched = this.router.find(req.method || 'GET', req.pathname);
    if (matched.route) {
      req.pathParams = matched.pathParam;
      await matched.route(req, res);
    } else {
      responseHandler.error("Página não encontrada", 500)
    }
  };

  init() {
    this.server.listen(3000, () => {
      console.log('Servidor inciado em http://localhost:3000');
    });
  }
}
