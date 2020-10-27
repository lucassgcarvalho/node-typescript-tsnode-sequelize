import {Application, NextFunction, Request, Response, Router} from 'express';
import AdministratorService from '../service/administrator.service';
import {ResponseModel} from "./model/response.model";
import {GenericValidation} from "./validation/generic.validation";
import winston from "../config/logger/winston";
import AuthService, {DecodedAdministrator} from "../service/auth.service";
import {AuthValidation} from "./validation/auth.validation";

export default class AuthResource{

    private root: string = '/auth/';
    private administratorService: AdministratorService;
    private readonly router: Router;

    constructor(express: Application) {
        this.administratorService = new AdministratorService();
        this.router = Router();
        express.use(this.root, this.router);
    }

    async post(req: Request, response: Response, next: NextFunction) {
        try {
            ResponseModel.buildSuccess200(response, {body: await AuthService.authenticate(req.body)})
        }catch (error) {
            winston.error(error);
            ResponseModel.buildError(response, error);
        }
    }

    init() {
        this.router.post('/',
            AuthValidation.auth(),
            GenericValidation.validate,
            this.post.bind(this));
    }
}
