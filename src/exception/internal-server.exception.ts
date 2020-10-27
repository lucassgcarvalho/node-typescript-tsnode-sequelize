import {GenericException} from "./generic.exception";

export class InternalServerException extends GenericException{

    constructor(error?: any, message?: any) {
        super();
        this.error = error ? error : 'Internal server error';
        this.message = message? message : 'Internal server error';
        this.status = 500;
    }

}
