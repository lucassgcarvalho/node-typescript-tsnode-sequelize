import {GenericException} from "./generic.exception";

export class BusinessException extends GenericException{

    constructor(error: any, message: any) {
        super();
        this.error = error;
        this.message = message;
        this.status = 400;
    }

}
