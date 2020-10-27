import {NextFunction, Request, Response} from "express";
import AuthService from "../../service/auth.service";
import {ResponseModel} from "../../resources/model/response.model";
import {UnauthorizedException} from "../../exception/unauthorized.exception";
import winston from "winston";
import {AdministratorInterface} from "../../interface/administrator.interface";

require('dotenv').config();

export class JwtMiddleware {

    static async isAuthenticated(request: Partial<Request>, response: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = request.headers?.['authorization'];
            const token = authHeader && authHeader.split('Bearer ')[1];

            if (token == null || !token){
                ResponseModel.buildUnauthorized(response, {})
            }else{
                request.decoded = await AuthService.decodeToken(token as string);
                if(!await JwtMiddleware.isTokenInBlackListToBeDeleted(request as Request, authHeader as string))
                    throw new UnauthorizedException(undefined, 'Token has been invalided since something was updated, please sig-in again to refresh the token.');
                else{
                    next();
                }
            }
        } catch (error) {
            winston.error(error);
            let message = 'Token has been expired';
            if(error instanceof UnauthorizedException)
                message = error.message;
            ResponseModel.buildUnauthorized(response, {message: message})
        }
    }

    private static async isTokenInBlackListToBeDeleted(request: Request, authHeader: string): Promise<boolean>{
        if(request.decoded){
            let admin = request.decoded.data as AdministratorInterface;
            if( await AuthService.isTokenInBlackList( admin.email as string, authHeader as string)
                && !await JwtMiddleware.isAuthRoute(request)){
                return false;
            }
        }
        return true;
    }

    private static async isAuthRoute(request: Request): Promise<boolean> {
        return request.originalUrl.includes('/auth');
    }
}
