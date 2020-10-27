import {AdministratorInterface} from "./administrator.interface";

export interface JwtDecodedInterface {
    data: object | AdministratorInterface;
    iat: number;
    exp: number;
}
