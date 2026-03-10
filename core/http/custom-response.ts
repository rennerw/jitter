import type { ServerResponse } from 'node:http';
import { ErroValidacao } from '../exceptions/erroValidacao';
import { ErroBancoDeDados } from '../exceptions/erroBancoDeDados';

export interface ApiResponse {
  statusCode: number
  data: any,
}

export interface CustomResponse extends ServerResponse {
  json(data: any): void;
  status(code: number): CustomResponse;
  erroServidor(): void;
}

export class ResponseHandler {
  private res: CustomResponse;
  constructor(res: CustomResponse) {
    this.res = res;
  }

  success(data: any, statusCode: number = 200) {
    this.res.status(statusCode).json({
      code: statusCode,
      message: 'Success',
      data,
    });
  }

  error(message: string, statusCode: number = 500, data: any = null) {
    this.res.status(statusCode).json({
      code: statusCode,
      message,
      data: data,
    });
  }

  handleErrors(error: any) {
    console.error(error);
    if (error instanceof ErroValidacao) {
      this.error(error.message, 400, error.data);
    }
    else if (error instanceof ErroBancoDeDados) {
      this.error(error.message, 500);
    }
    else {
      this.error('Internal server error', 500);
    }
  }
}

export function customResponse(response: ServerResponse) {
  const res = response as CustomResponse;

  res.status = (statusCode: number) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (data: any) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const body = JSON.stringify(data);
      res.end(body);
    } catch (e) {
      console.log(e);
      res.statusCode = 500;
      res.end(JSON.stringify({ code: 500, data: { message: 'Erro: Erro de servidor' } }));
    }
  };
  res.erroServidor = () => {

    res
      .status(500)
      .json({ code: 500, data: { message: 'Erro: Erro de servidor' } });
  };
  return res;
}
export function handlerResponse(body: any) {
  try {
    if (typeof (body) === 'object') {
      return {
        statusCode: 200,
        data: body
      } as ApiResponse
    }
  }
  catch (e: any) {
    if (e instanceof ErroValidacao) {

    }
  }
}