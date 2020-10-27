import * as bodyParser from 'body-parser';
import express, {NextFunction, Request, Response} from 'express';
import logger from 'morgan';
import winston from 'winston';
import expressWinston from 'express-winston';
import AdministratorResource from './resources/administrator.resource';
import RedisServer from "./config/redis.config";
import AuthResource from "./resources/auth.resource";
import {SyncModel} from "./models/sync/sync.model";
import CondominiumResource from "./resources/condominium-resource";
import {AssociationsModel} from "./models/sync/associations.model";
import Utils from "./utils/utils";
import CondominiumTypeResource from "./resources/condominium-type.resource";

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.configDB();
        this.redis();
        this.routes();
        this.middlewareAfterRoutes();

    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(this.middlewareCores());
        this.express.use(bodyParser.json());
        this.logger();
        //this.express.use(expressValidator.check());
        this.express.use(bodyParser.urlencoded({extended: false}));
        // this.middleRequest();

    }

    private middlewareAfterRoutes(): void {
        this.loggerError();
        // @ts-ignore
        // this.express.use(morgan('combined', { stream: winstonConfig.stream }));
    }

    /**
     * Logger must go before routers
     */
    private logger() {
        //expressWinston.bodyBlacklist.push('secretid', 'secretproperty');
        this.express.use(expressWinston.logger({
            transports: [
                new winston.transports.Console()
            ],
            format: winston.format.combine(
                winston.format.colorize({all: true}),
                winston.format.prettyPrint({colorize: true}),
                //winston.format.json({space:1})
            ),
            requestWhitelist: ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'query', 'body'],  //these are not included in the standard StackDriver httpRequest
            responseWhitelist: ['body'],
            meta: true, // optional: control whether you want to log the meta data about the request (default to true)
            msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
            expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
            colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
            ignoreRoute: function (req, res) {
                return true;
            }, // optional: allows to skip some log messages based on request and/or response
            statusLevels: false, // default value
            level: function (req, res) {
                let level = "";
                if (res.statusCode >= 100) {
                    level = "info";
                }
                if (res.statusCode >= 400) {
                    level = "warn";
                }
                if (res.statusCode >= 500) {
                    level = "error";
                }
                // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
                if (res.statusCode == 401 || res.statusCode == 403) {
                    level = "critical";
                }
                // No one should be using the old path, so always warn for those
                if (req.path === "/v1" && level === "info") {
                    level = "warn";
                }
                return level;
            }
        }));
    }

    /**
     * Logger must go AFTER routers
     */
    private loggerError() {
        this.express.use(expressWinston.errorLogger({
            transports: [
                new winston.transports.Console()
            ],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.prettyPrint({colorize: true})
            ),
        }));
    }

    //CORS middleware
    private middlewareCores() {
        return (req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', '*');
            res.header('Access-Control-Allow-Headers', '*');
            next();
        }
    }

    private middleRequest() {
        this.express.use(function (req: Request, res: Response, next: NextFunction) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            // res.setHeader('Access-Control-Allow-Credentials', "false");

            // Pass to next layer of middleware
            next();
        });
    }

    configDB() {
        const isUpdate = Utils.toBoolean(String(process.env.POSTGRES_UPDATE_TABLES));
        const isResetTable = Utils.toBoolean(String(process.env.POSTGRES_RESET_TABLES));
        const isSyncTable = Utils.toBoolean(String(process.env.POSTGRES_SYNC_TABLES));
        const isAssociation = Utils.toBoolean(String(process.env.POSTGRES_EXECUTE_ASSOCIATION));
        AssociationsModel.association(isAssociation)
            .then(() => {})
            .catch((error) => {
                throw error;
            });
        SyncModel.syncModels(isSyncTable, isResetTable, isUpdate)
            .then(() => {})
            .catch((error) => {
                throw error;
            });
    }

    // Configure API endpoints.
    private routes(): void {
        this.initRoutes();
    }

    initRoutes() {
        this.userRouter();
    }

    private userRouter() {
        new AdministratorResource(this.express).init();
        new AuthResource(this.express).init();
        new CondominiumResource(this.express).init();
        new CondominiumTypeResource(this.express).init();
    }

    private redis(): void {
        new RedisServer();
    }
}

export default new App().express;
