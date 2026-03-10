export default class ItemController {

    async get(request: Request): Promise<Response> {
        return new Response("Get item");
    }

    async create(request: Request): Promise<Response> {
        return new Response("Create item");
    }

    async update(request: Request): Promise<Response> {
        return new Response("Create item");
    }

    async delete(request: Request): Promise<Response> {
        return new Response("Create item");
    }

}