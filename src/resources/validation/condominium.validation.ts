import {checkSchema, ValidationChain} from 'express-validator';
import {Schema} from "express-validator/src/middlewares/schema";
import lodash from 'lodash';
import {GenericValidation} from "./generic.validation";

export class CondominiumValidation {

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
        address: {
            in: 'body',
            exists: {
                errorMessage: 'Address is required'
            },
            isLength: {
                errorMessage: 'Address should be at least 1 until 500 chars long',
                options: {min: 0, max: 500}
            },
            optional:{
                options:{
                    nullable: true
                }
            },
            trim: true
        },
        condominiumType: {
            in: 'body',
            errorMessage: 'Please enter a valid id as number',
            exists: {
                errorMessage: 'condominiumType is required'
            },
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
            eagerParent: CondominiumValidation.schema.eagerParent,
            parentIds: CondominiumValidation.schema.parentIds
        }, ['query']);
    }

    static post(): ValidationChain[] {
        let schema = lodash.clone(CondominiumValidation.schema);
        delete schema.id
        return checkSchema(schema, ['body']);
    }

    static put(): ValidationChain[] {
        let schema = lodash.clone(CondominiumValidation.schema);
        const putSchema: Schema = {
            name: {
                optional: {options: {nullable: true}}
            },
            condominiumType: {
                optional: {options: {nullable: true}}
            },
            address: {
                optional: {options: {nullable: true}}
            }
        }
        let merged = lodash.clone(lodash.merge(schema, putSchema));
        //delete merged.id;
        return checkSchema(merged);
    }

}
