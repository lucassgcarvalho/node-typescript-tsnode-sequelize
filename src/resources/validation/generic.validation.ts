import {NextFunction, Request, Response} from 'express';
import {badRequestException} from "../../exception/bad-request.exception";
import {ResponseModel} from "../model/response.model";
import {validationResult} from "express-validator";
import Utils from "../../utils/utils";
import {Schema} from "express-validator/src/middlewares/schema";

export class GenericValidation {

    public static schema: Schema = {
        id: {
            in: 'query',
            exists: {
                options: {
                    checkNull: true
                },
                errorMessage: `ID must be integer and not null`
            },
            trim: true
        },
        eagerParent: {
            in: 'query',
            isBoolean:{
                errorMessage: `EagerParent must be boolean`
            },
            optional: {options: {nullable: true}},
            trim: true
        },
        parentIds: {
            in: 'query',
            errorMessage: 'ParentIds be a number or an array of numbers. Ex: 1 or 1,2,3...',
            custom: {
                options: (value, { req }) => {
                    let parentIds = req.query?.['parentIds'];
                    if(parentIds.match('^[0-9]+(,[0-9]+)*$'))
                        return parentIds.split(',');
                    return false;
                }
            },
            optional: {options: {nullable: true}},
            trim: true
        }
    }

    static validate(req: Request, response: Response, next: NextFunction): void {
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
        if (!errors.isEmpty()) {
            ResponseModel.buildError(response, new badRequestException(errors, errors.array()));
        }else{
            req.matchedParameters =  Utils.getRequestParametersOnlyMatchedByValidation(req);
            next();
        }
    }
}
