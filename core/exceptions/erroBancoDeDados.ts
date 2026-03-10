export class ErroBancoDeDados extends Error {
    private statusCode = 500;
    constructor(message?: string) {
        super(message)
        this.statusCode;
    }
}