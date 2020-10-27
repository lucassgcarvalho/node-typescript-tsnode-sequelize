import {Response} from "express";
import {GenericException} from "../../exception/generic.exception";
import {BusinessException} from "../../exception/business.exception";
import {SqlException} from "../../exception/sql.exception";
import {ResponseInterface} from "../../interface/response.interface";

export class ResponseModel {


    static buildGeneric(status: any, body: any, message: any): ResponseModel {
        return {status, body, message};
    }

    static executeBuild(response: Response, responseInterface: ResponseInterface) {
        let status = responseInterface.status ? responseInterface.status : 200;
        response.status(status);
        response.send(responseInterface);
    }

    static buildSuccess200(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Success';
        responseInterface.status = 200;
        this.executeBuild(response, responseInterface);
    }

    static buildSuccess204NoContent(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Success';
        responseInterface.status = 204;
        delete responseInterface.body
        this.executeBuild(response, responseInterface);
    }

    static buildSuccess201Created(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Success';
        responseInterface.status = 201;
        responseInterface.body
        this.executeBuild(response, responseInterface);
    }

    static buildSuccess202Accepted(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Accepted';
        responseInterface.status = 202;
        delete responseInterface.body
        this.executeBuild(response, responseInterface);
    }

    static buildNotFound404(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Not Found';
        responseInterface.status = 404;
        delete responseInterface.body
        this.executeBuild(response, responseInterface);
    }

    static buildUnauthorized(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Unauthorized';
        responseInterface.status = 401;
        delete responseInterface.body
        this.executeBuild(response, responseInterface);
    }

    static buildUForbidden(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Forbidden';
        responseInterface.status = 403;
        delete responseInterface.body
        this.executeBuild(response, responseInterface);
    }

    static buildBadRequest(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Bad Request';
        responseInterface.status = 400;
        delete responseInterface.body
        this.executeBuild(response, responseInterface);
    }

    static buildBusinessError400(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Business error';
        responseInterface.status = 400;
        delete responseInterface.body
        this.executeBuild(response, responseInterface);
    }

    static buildRequestTimeout408(response: Response, responseInterface: ResponseInterface) {
        responseInterface.message? responseInterface.message: responseInterface.message = 'Request Time Out';
        responseInterface.status = 408;
        delete responseInterface.body
        this.executeBuild(response, responseInterface);
    }

    static buildError(response: Response, error: GenericException) {
        if (error.status) {
            response.status(error.status);
            response.send({status: error.status, message: error.message, type: error.constructor.name});
            return;
        }
        ResponseModel.genericBuild(response, error);
    }

    private static genericBuild(response: Response, error: GenericException) {
        let status = 0;
        switch (error.constructor) {
            case BusinessException:
                status = 400;
                break;
            case SqlException:
                status = 500;
                break;
            default:
                status = 500;
                break;
        }
        response.status(status);
        response.send({status: status, message: error.message, type: error.constructor.name});
    }

}
