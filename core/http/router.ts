import type { CustomRequest } from './custom-request';
import type { CustomResponse } from './custom-response';
import { sanitize } from '../../core/utils/sanitize'

type Handler = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

export class Router {
  routes: Record<string, any> = {
    GET: {},
    POST: {},
    DELETE: {},
    PATCH: {}
  };

  private pathParams: Record<string, string> = {};

  #__getRoutesByMethod(method: string) {
    return this.routes[method];
  }

  #__resolvePathParam(method: string, route: string) {
    try {
      const rotas = this.#__getRoutesByMethod(method);
      const arrayRoute = route.split(/\//);

      for (const item of Object.keys(rotas)) {
        const arrItem = item.replace(/\?.+/, '').split(/\//);

        // se o tamanho bate
        if (arrItem.length === arrayRoute.length) {
          let pathParams: Record<string, string> = {};
          let matched = true;

          for (let i = 0; i < arrItem.length; i++) {
            const element = arrItem[i];
            const value = arrayRoute[i];

            if (element === value) continue;

            if (/\{.+\}/.test(element)) {
              pathParams[sanitize(element)] = value;
            } else {
              matched = false;
              break;
            }
          }

          if (matched) {
            this.pathParams = pathParams;
            return item;
          }
        }
      }

      return null;
    }
    catch (e) {
      throw e;
    }
  }

  get(route: string, handler: Handler) {
    this.routes['GET'][route] = handler;
  }
  post(route: string, handler: Handler) {
    this.routes['POST'][route] = handler;
  }

  patch(route: string, handler: Handler) {
    this.routes['PATCH'][route] = handler;
  }

  delete(route: string, handler: Handler) {
    this.routes['DELETE'][route] = handler;
  }

  find(method: string, route: string): { route: Handler, pathParam: {} } {
    let result;
    if (route !== '/') result = this.#__resolvePathParam(method, route) || '/';
    else result = '/';

    console.log("methooooooooooood", method, result)

    return {
      route: this.routes[method][result] || null,
      pathParam: this.pathParams,
    };
  }
}
