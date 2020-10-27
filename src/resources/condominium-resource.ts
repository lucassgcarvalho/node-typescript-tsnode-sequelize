import {Application, NextFunction, Request, Response, Router} from 'express';
import {GenericHttpCallVerbs} from '../interface/generic-http-call-verbs';
import {ResponseModel} from "./model/response.model";
import {GenericValidation} from "./validation/generic.validation";
import winston from "../config/logger/winston";
import {JwtMiddleware} from "../middleware/jwt/jwt.middleware";
import {CondominiumCreateInterface, CondominiumUpdateInterface} from "../interface/condominium.interface";
import CondominiumService from "../service/condominium.service";
import {CondominiumValidation} from "./validation/condominium.validation";
import Utils from "../utils/utils";

export default class CondominiumResource implements GenericHttpCallVerbs {

    private root: string = '/condominiums/';
    private condominiumService: CondominiumService;
    private readonly router: Router;

    constructor(express: Application) {
        this.condominiumService = new CondominiumService();
        this.router = Router();
        express.use(this.root, this.router);
    }

    async get(req: Request, response: Response, next: NextFunction) {
        try {
            ResponseModel.buildSuccess200(response, {
                body: await this.condominiumService.get(
                    await Utils.getIdFromQueryParameter(req),
                    await Utils.getParentsFromRequestParametersParsed(req))
            })
        } catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async getAll(req: Request, response: Response, next: NextFunction) {
        try {
            ResponseModel.buildSuccess200(response, {
                body: await this.condominiumService.getAll(await Utils.getParentsFromRequestParametersParsed(req))
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
                    body: await this.condominiumService.post(await Utils.getBodyFromRequestParameter(req) as CondominiumCreateInterface)
                });
        } catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async put(req: Request, response: Response, next: NextFunction) {
        try {
            await this.condominiumService.put(
                await Utils.getIdFromQueryParameter(req),
                await Utils.getBodyFromRequestParameter(req) as CondominiumUpdateInterface);

            ResponseModel.buildSuccess200(response, {})
        } catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async delete(req: Request, response: Response, next: NextFunction) {
        try {
            await this.condominiumService.delete(await Utils.getIdFromQueryParameter(req));
            ResponseModel.buildSuccess200(response, {});
        } catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    init(): void {
        this.router.get('/',
            JwtMiddleware.isAuthenticated,
            CondominiumValidation.get(),
            GenericValidation.validate,
            this.get.bind(this));

        this.router.get('/all',
            JwtMiddleware.isAuthenticated,
            CondominiumValidation.getAll(),
            GenericValidation.validate,
            this.getAll.bind(this));

        this.router.post('/',
            JwtMiddleware.isAuthenticated,
            CondominiumValidation.post(),
            GenericValidation.validate,
            this.post.bind(this));

        this.router.put('/',
            JwtMiddleware.isAuthenticated,
            CondominiumValidation.get(),
            CondominiumValidation.put(),
            GenericValidation.validate,
            this.put.bind(this));

        this.router.delete('/',
            JwtMiddleware.isAuthenticated,
            CondominiumValidation.get(),
            GenericValidation.validate,
            this.delete.bind(this));
    }

}
