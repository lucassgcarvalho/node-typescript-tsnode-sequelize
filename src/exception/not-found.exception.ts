import {GenericException} from "./generic.exception";

export class NotFoundException extends GenericException{

    constructor(error?: any, message?: any) {
        super();
        this.error = error ? error : 'Not Found';
        this.message = message? message : 'Not Found';
        this.status = 404;
    }

}
