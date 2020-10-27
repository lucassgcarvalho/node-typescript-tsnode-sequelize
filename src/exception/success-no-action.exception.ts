import {GenericException} from "./generic.exception";

export class SuccessNoActionException extends GenericException{

    constructor(error: any, message: any) {
        super();
        this.error = error;
        this.message = message;
        this.status = 204;
    }

}
