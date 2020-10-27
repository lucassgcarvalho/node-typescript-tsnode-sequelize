import {checkSchema, CustomValidator, ValidationChain} from 'express-validator';
import {Schema} from "express-validator/src/middlewares/schema";
import lodash from 'lodash';
import {GenericValidation} from "./generic.validation";

export class CondominiumTypeValidation {

    public static schema: Schema = {
        ... GenericValidation.schema,
        name: {
            in: 'body',
            exists: {
                errorMessage: 'Name is required'
            },
            isLength: {
                errorMessage: 'Name should be at least 2 until 250 chars long',
                options: {min: 2, max: 250}
            },
            trim: true
        },
        description: {
            in: 'body',
            exists: {
                errorMessage: 'Description is required'
            },
            isLength: {
                errorMessage: 'Description should be at least 1 until 500 chars long',
                options: {min: 0, max: 500}
            },
            trim: true
        },
        active: {
            in: 'body',
            isLength: {
                errorMessage: 'Active should be bit value',
                options: {min: 1, max: 1}
            },
            isIn: {
                errorMessage: 'Active should be only 1 or 0 (zero)',
                options: [['1', '0'], [1, 0]]
            },
            optional: {options: {nullable: true}},
            trim: true
        }
    }

    static get(): ValidationChain[] {
        return checkSchema(GenericValidation.schema, ['query']);
    }

    static getAll(): ValidationChain[] {
        return checkSchema({
            eagerParent: CondominiumTypeValidation.schema.eagerParent,
            parentIds: CondominiumTypeValidation.schema.parentIds
        }, ['query']);
    }

    static post(): ValidationChain[] {
        let schema = lodash.clone(CondominiumTypeValidation.schema);
        delete schema.id
        return checkSchema(schema, ['body']);
    }

    static put(): ValidationChain[] {
        let schema = lodash.clone(CondominiumTypeValidation.schema);
        const putSchema: Schema = {
            name: {
                optional: {options: {nullable: true}}
            },
            description: {
                optional: {options: {nullable: true}}
            },
        }
        let merged = lodash.clone(lodash.merge(schema, putSchema));
        //delete merged.id;
        return checkSchema(merged);
    }

}
