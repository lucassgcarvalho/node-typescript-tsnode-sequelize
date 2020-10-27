import {NextFunction, Request, Response} from "express";

export interface GenericHttpCallVerbs {
    get(req?: Request, res?: Response, next?: NextFunction): any;    
    getAll(req?: Request, res?: Response, next?: NextFunction): any;
    post(req?: Request, res?: Response, next?: NextFunction): any;
    put(req?: Request, res?: Response, next?: NextFunction): any;
    delete(req?: Request, res?: Response, next?: NextFunction): any;
}
