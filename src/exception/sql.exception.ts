import {GenericException} from "./generic.exception";

export class SqlException extends GenericException{

    constructor(error: any, message: any) {
        super();
        this.error = error;
        this.message = message;
    }

}
