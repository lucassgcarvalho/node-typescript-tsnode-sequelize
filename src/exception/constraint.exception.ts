import {GenericException} from "./generic.exception";
import {ValidationErrorItem} from "sequelize/types/lib/errors";

export class ConstraintException extends GenericException {

    constructor(error: any, message: any) {
        super();
        this.error = error;
        this.message = message;
        this.status = 409;
    }

}
