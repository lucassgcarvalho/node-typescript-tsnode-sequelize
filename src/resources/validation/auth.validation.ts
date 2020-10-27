import {AdministratorValidation} from './administrator.validation';
import {checkSchema, Schema} from 'express-validator/src/middlewares/schema';
import {ValidationChain} from "express-validator";

export class AuthValidation {

    public static schema: Schema = {
        email: AdministratorValidation.schema.email,
        password: AdministratorValidation.schema.password
    }

    static auth(): ValidationChain[] {
        return checkSchema(AuthValidation.schema, ['body']);
    }
}
