import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {AdministratorInterface} from "../interface/administrator.interface";
import AdministratorService from "./administrator.service";
import {UnauthorizedException} from "../exception/unauthorized.exception";
import winston from "../config/logger/winston";
import {JwtDecodedInterface} from "../interface/jwtDecodedInterface";
import {InternalServerException} from "../exception/internal-server.exception";
import _ from "lodash";
import RedisServer from "../config/redis.config";


export interface DecodedAdministrator extends Omit<AdministratorInterface, 'password'> {
    authenticated?:AdministratorInterface;
    auth?: Object;
}

export default class AuthService {

    private static BLACK_LIST: string = 'BlackList';

    public static async hashPassword(password: string, salt = 10): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public static async authenticate(payload: AdministratorInterface): Promise<DecodedAdministrator> {
        try {
            let admin = payload as AdministratorInterface;
            let userFound: AdministratorInterface = await new AdministratorService().getByEmail(admin.email as string);
            if(!await AuthService.comparePasswords(admin.password as string, userFound.password as string))
                throw new UnauthorizedException(null, 'Password does not match.');

            delete userFound.password;
            const token = await AuthService.generateToken(userFound);
            const decoded = await AuthService.decodeToken(token);
            return { authenticated: userFound, auth:{ token, expiresIn: decoded.exp}} as DecodedAdministrator;
        }catch (error) {
            winston.error(error);
            throw error;
        }
    }

    public static async generateToken(payload: object): Promise<string> {
        try {
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const expiresIn = process.env.EXPIRES_IN;
            return jwt.sign({data: payload}, secret as string, { expiresIn: expiresIn as string });
        }catch (error) {
            winston.error(error);
            throw error;
        }
    }

    public static async decodeToken(token: string): Promise<JwtDecodedInterface> {
        try {
            const secret = process.env.ACCESS_TOKEN_SECRET;
           return await jwt.verify(token, secret as string) as JwtDecodedInterface;
        }catch (error) {
            winston.error(error);
            throw error;
        }

    }

    public static async invalidateTokenToBlackList(email:string, token: string, expires?: number): Promise<void> {
        try {
            let key = await AuthService.getNexKey(AuthService.BLACK_LIST+':'+email);
            if(await RedisServer.redisClient.setKeyValueExpiration(key, token, expires))
                winston.info(`A Key Token [${key}] was Stored with value ${token}`);
        }catch (error) {
            winston.error(error);
            throw new InternalServerException();
        }
    }

    public static async deleteTokenToBlackList(email: string): Promise<void> {
        try {
            await RedisServer.redisClient.delete(AuthService.BLACK_LIST+':'+email);
        }catch (error) {
            winston.error(error);
        }
    }

    public static async isTokenInBlackList(field: string, token: string): Promise<boolean> {
        try {
            let key = AuthService.BLACK_LIST+':'+field;
            let list = await RedisServer.redisClient.getListOf(key);
            if (list && list.length > 0){
                let listOfValues: Array<string>  = await RedisServer.redisClient.getValueOfList(list as []);
                if(listOfValues){
                    return listOfValues.includes(token);
                }
            }
            return false;
        }catch (error) {
            winston.error(error);
            throw error;
        }
    }

    private static async getNexKey(key: string): Promise<string> {
        let list: Array<string> = await RedisServer.redisClient.getListOf(key);
        if(list && list.length > 0) {
            let max = await _.maxBy(list, (item) => {
                return Number(item.split(':')[2]);
            });
            let maxAsNumber = Number(max?.split(':')[2]);
            key += ':' + (++maxAsNumber);
        }
        return key;
    }

}
