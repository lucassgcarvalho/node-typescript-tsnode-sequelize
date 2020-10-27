import {Application, NextFunction, Request, Response, Router} from 'express';
import AdministratorService from '../service/administrator.service';
import {GenericHttpCallVerbs} from '../interface/generic-http-call-verbs';
import {ResponseModel} from "./model/response.model";
import {AdministratorValidation} from "./validation/administrator.validation";
import {GenericValidation} from "./validation/generic.validation";
import winston from "../config/logger/winston";
import {JwtMiddleware} from "../middleware/jwt/jwt.middleware";
import AuthService from "../service/auth.service";
import {AdministratorInterface} from "../interface/administrator.interface";

export default class AdministratorResource implements GenericHttpCallVerbs {

    private root: string = '/administrators/';
    private administratorService: AdministratorService;
    private readonly router: Router;

    constructor(express: Application) {
        this.administratorService = new AdministratorService();
        this.router = Router();
        express.use(this.root, this.router);
    }

    async get(req: Request, response: Response, next: NextFunction) {
        try {
            ResponseModel.buildSuccess200(response, {body: await this.administratorService.get(req.query['id']) })
        }catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async getAll(req: Request, response: Response, next: NextFunction) {
        try {
            ResponseModel.buildSuccess200(response, {body: await this.administratorService.getAll()});
        }catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async post(req: Request, response: Response, next: NextFunction) {
        try {
            ResponseModel.buildSuccess201Created(response, {body:  await this.administratorService.post(req.body)})
        }catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async put(req: Request, response: Response, next: NextFunction) {
        try {
            const id = Number(req.query['id']);
            const body: AdministratorInterface = req.body;
            let admin = req.decoded?.data as AdministratorInterface;
            const expiresIn = req?.decoded?.exp

            await this.administratorService.put(id, body);
            if(body.email == admin.email)
                await AuthService.invalidateTokenToBlackList(admin.email as string, req.headers.authorization as string, expiresIn);

            ResponseModel.buildSuccess200(response, {})
        }catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    async delete(req: Request, response: Response, next: NextFunction) {
        try {
            const id = req.query['id'];
            let admin = req?.decoded?.data as AdministratorInterface;
            const expiresIn = req?.decoded?.exp

            await this.administratorService.delete(id);
            if(Number(id) == admin.id)
                await AuthService.invalidateTokenToBlackList(admin.email as string, req.headers.authorization as string, expiresIn);

            ResponseModel.buildSuccess200(response, {});
        }catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    init() {
        this.router.get('/',
            JwtMiddleware.isAuthenticated,
            AdministratorValidation.get(),
            GenericValidation.validate,
            this.get.bind(this));

        this.router.get('/all',
            JwtMiddleware.isAuthenticated,
            GenericValidation.validate,
            this.getAll.bind(this));

        this.router.post('/',
            JwtMiddleware.isAuthenticated,
            AdministratorValidation.post(),
            GenericValidation.validate,
            this.post.bind(this));

        this.router.put('/',
            JwtMiddleware.isAuthenticated,
            AdministratorValidation.get(),
            AdministratorValidation.put(),
            GenericValidation.validate,
            this.put.bind(this));

        this.router.delete('/',
            JwtMiddleware.isAuthenticated,
            GenericValidation.validate,
            this.delete.bind(this));
    }

}
