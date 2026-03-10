export class ErroValidacao extends Error {
    private statusCode = 400;
    public readonly data = null;
    constructor(message: string, errors: any) {
        super(message)
        this.message = message;
        this.data = errors;
        this.statusCode;
    }
}