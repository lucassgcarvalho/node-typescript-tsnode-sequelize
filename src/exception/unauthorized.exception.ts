import {GenericException} from "./generic.exception";

export class UnauthorizedException extends GenericException{

    constructor(error?: any, message?: any) {
        super();
        this.error = error ? error : 'Unauthorized';
        this.message = message? message : 'Unauthorized';
        this.status = 401;
    }

}
