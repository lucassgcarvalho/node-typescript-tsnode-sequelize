import {Application, NextFunction, Request, Response, Router} from 'express';
import {GenericHttpCallVerbs} from '../interface/generic-http-call-verbs';
import {ResponseModel} from "./model/response.model";
import {GenericValidation} from "./validation/generic.validation";
import winston from "../config/logger/winston";
import {JwtMiddleware} from "../middleware/jwt/jwt.middleware";
import CondominiumTypeService from "../service/condominium-type.service";
import {CondominiumTypeInterface} from "../interface/condominium-type.interface";
import {CondominiumTypeValidation} from "./validation/condominium-type.validation";
import Utils from "../utils/utils";
import utils from "../utils/utils";

export default class CondominiumTypeResource implements GenericHttpCallVerbs {

    private root: string = '/condominium-types/';
    private condominiumTypeService: CondominiumTypeService;
    private readonly router: Router;

    constructor(express: Application) {
        this.condominiumTypeService = new CondominiumTypeService();
        this.router = Router();
        express.use(this.root, this.router);
    }

    async get(req: Request, response: Response, next: NextFunction) {
        try {
            ResponseModel.buildSuccess200(response, {
                body: await this.condominiumTypeService.get(
                    await Utils.getIdFromQueryParameter(req),
                    await Utils.getParentsFromRequestParametersParsed(req))
                });
        } catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async getAll(req: Request, response: Response, next: NextFunction) {
        try {
            ResponseModel.buildSuccess200(response, {
                body: await this.condominiumTypeService.getAll(await Utils.getParentsFromRequestParametersParsed(req))
            });
        } catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async post(req: Request, response: Response, next: NextFunction) {
        try {
            ResponseModel.buildSuccess201Created(response,
                {
                    body: await this.condominiumTypeService.post(req.matchedParameters.bodyData as CondominiumTypeInterface)
                });
        } catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async put(req: Request, response: Response, next: NextFunction) {
        try {
            await this.condominiumTypeService.put(
                await Utils.getIdFromQueryParameter(req),
                await utils.getBodyFromRequestParameter(req) as CondominiumTypeInterface);

            ResponseModel.buildSuccess200(response, {})
        } catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async delete(req: Request, response: Response, next: NextFunction) {
        try {
            await this.condominiumTypeService.delete(await Utils.getIdFromQueryParameter(req));
            ResponseModel.buildSuccess200(response, {});
        } catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    init(): void {
        this.router.get('/',
            JwtMiddleware.isAuthenticated,
            CondominiumTypeValidation.get(),
            GenericValidation.validate,
            this.get.bind(this));

        this.router.get('/all',
            JwtMiddleware.isAuthenticated,
            CondominiumTypeValidation.getAll(),
            GenericValidation.validate,
            this.getAll.bind(this));

        this.router.post('/',
            JwtMiddleware.isAuthenticated,
            CondominiumTypeValidation.post(),
            GenericValidation.validate,
            this.post.bind(this));

        this.router.put('/',
            JwtMiddleware.isAuthenticated,
            CondominiumTypeValidation.get(),
            CondominiumTypeValidation.put(),
            GenericValidation.validate,
            this.put.bind(this));

        this.router.delete('/',
            JwtMiddleware.isAuthenticated,
            CondominiumTypeValidation.get(),
            GenericValidation.validate,
            this.delete.bind(this));
    }

}
