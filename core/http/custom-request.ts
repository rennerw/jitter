import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { type IncomingMessage } from 'node:http';
import { ErroValidacao } from '../exceptions/erroValidacao';
import getValidatorMessages from '../exceptions/classValidatorMessages';

export async function validateRequest(dto: any, data: any): Promise<ErroValidacao | void> {
  console.log(data);
  const object = plainToInstance(dto, data);
  const errors = await validate(object);

  console.log("validationError --->", JSON.stringify(errors, null, 2));

  if (errors.length > 0) {
    throw new ErroValidacao('Erro de validação', getValidatorMessages(errors));
  }
}

export interface CustomRequest extends IncomingMessage {
  query: URLSearchParams;
  pathname: string;
  pathParams: Record<string, any>;
  body: Record<string, any>;
}

export async function customRequest(request: IncomingMessage) {
  const req = request as CustomRequest;
  const url = new URL(req.url || 'http://localhost:3000', 'http://localhost');

  req.pathname = url.pathname;
  req.query = url.searchParams;
  const buffers: Buffer[] = [];
  for await (const buffer of req) {
    buffers.push(buffer);
  }
  const body = Buffer.concat(buffers).toString('utf-8');

  if (req.headers['content-type'] === 'application/json')
    req.body = JSON.parse(body);
  else req.body = {};

  return req;
}
