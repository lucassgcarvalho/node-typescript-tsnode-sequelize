import {GenericException} from "./generic.exception";

export class badRequestException extends GenericException{

    constructor(error?: any, message?: any) {
        super();
        this.error = error ? error : 'Bad Request';
        this.message = message? message : 'Bad Request';
        this.status = 400;
    }

}
