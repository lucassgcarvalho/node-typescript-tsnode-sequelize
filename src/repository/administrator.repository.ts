import {AdministratorModel} from "../models/administrator/administrator.model";
import {DestroyOptions, Identifier, UpdateOptions} from "sequelize";
import {AdministratorInterface} from "../interface/administrator.interface";
import winston from "../config/logger/winston";

export default class AdministratorRepository {

    async get(id: number): Promise<AdministratorModel | null> {
        try {
            let ident: Identifier = id;
            return await AdministratorModel.findByPk<AdministratorModel>(ident);
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }

    async getByEmail(email: string): Promise<AdministratorModel | null> {
        try {
            return await AdministratorModel.findOne<AdministratorModel>({
                where:{
                    email: email
                }
            });
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }

    async getAll(): Promise<AdministratorModel[] | []> {
        try {
            return await AdministratorModel.findAll<AdministratorModel>({order: ['id']});
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }

    async post(administratorModelInterface: AdministratorInterface) {
        try {
            return await AdministratorModel.create<AdministratorModel>(administratorModelInterface);
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }

    async put(id: number, administratorModelInterface: AdministratorInterface): Promise<[number, AdministratorModel[]]> {
        try {
            const update: UpdateOptions = {
                where: {id: id},
                limit: 1,
            };
            return await AdministratorModel.update<AdministratorModel>(administratorModelInterface, update);
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }

    async delete(id: number): Promise<number> {
        try {
            const destroyOptions: DestroyOptions = {
                where: {id: id},
                limit: 1,
            };
            return await AdministratorModel.destroy<AdministratorModel>(destroyOptions);
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }
}
