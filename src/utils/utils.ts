import {matchedData} from "express-validator";
import {Request} from "express";
import {ParentRequestInterface} from "../interface/parent-request.interface";
import winston from "../config/logger/winston";
import {InternalServerException} from "../exception/internal-server.exception";
import {ValidationErrorItem} from "sequelize/types/lib/errors";

export default class Utils {

    public static toBoolean(value: string) {
        switch (value.toLowerCase().trim()) {
            case "true":
            case "yes":
            case "1":
                return true;
            case "false":
            case "no":
            case "0":
            case null:
                return false;
            default:
                return Boolean(value);
        }
    }

    /**
     * -> Parse 'query' from Request Parameters <br>
     * -> parse 'body'  from Request Parameters <br>
     * Return {queryData: object, bodyData: object}
     * */
    public static getRequestParametersOnlyMatchedByValidation(req: Request): {queryData: object, bodyData: object}{
        const queryData = matchedData(req, { locations: ['query'], onlyValidData: true, includeOptionals: true });
        const bodyData: Record<string, any> = matchedData(req, { locations: ['body'], onlyValidData: true, includeOptionals: true });
        return {queryData, bodyData};
    }

    /**
     * Parse Items from 'ParentRequestInterface' <br>
     * -> Parse eagerParent <br>
     * -> parse parentIds<br>
     * Return Promise<ParentRequestInterface>
     * */
    public static async getParentsFromRequestParametersParsed(req: Request):  Promise<ParentRequestInterface>{
        let eagerParent;
        let parentIds = undefined;

        eagerParent = await Utils.getEagerParentFromQueryParameter(req);
        const parentIdsAsString = await Utils.getParentIdsFromQueryParameter(req);

        if(parentIdsAsString)
            parentIds = await parentIdsAsString.split(',').map(Number);

        return {eagerParent, parentIds};
    }

    public static async getIdFromQueryParameter(req: Request):  Promise<number>{
        try {
            return await Number(req.matchedParameters.queryData?.id);
        }catch (e) {
            winston.error(`Error to parse ID from Query Request parameter: ${e}`);
            throw new InternalServerException(e);
        }
    }

    public static async getEagerParentFromQueryParameter(req: Request):  Promise<boolean>{
        try {
            return await req.matchedParameters.queryData?.['eagerParent'] as boolean
        }catch (e) {
            winston.error(`Error to parse EagerParent from Query Request parameter: ${e}`);
            throw new InternalServerException(e);
        }
    }

    public static async getParentIdsFromQueryParameter(req: Request):  Promise<string>{
        try {
            return await req.matchedParameters.queryData?.['parentIds'] as string;
        }catch (e) {
            winston.error(`Error to parse ParentIds from Query Request parameter: ${e}`);
            throw new InternalServerException(e);
        }
    }

    public static async getBodyFromRequestParameter(req: Request):  Promise<object | undefined>{
        try {
            return await req.matchedParameters.bodyData;
        }catch (e) {
            winston.error(`Error to parse Body from Request parameter: ${e}`);
            throw new InternalServerException(e);
        }
    }

    public static formatErrorFromConstraint(array: ValidationErrorItem[] ): {}[]{
        let returnPopulated = [];
        if(array){
            for(let i = 0; i < array.length; i++) {
                const next:ValidationErrorItem = array.entries().next().value[1];
                returnPopulated.push({message: next.message, value: next.value, type: next.type});
            }
        }
        return returnPopulated
    }

}


