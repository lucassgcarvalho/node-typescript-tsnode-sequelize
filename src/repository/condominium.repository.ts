import {DestroyOptions, Identifier, UpdateOptions} from "sequelize";
import winston from "../config/logger/winston";
import {Condominiums} from "../models/condominium/condominiums";
import {CondominiumTypes} from "../models/condominium-type/condominium.types";
import {CondominiumCreateInterface, CondominiumUpdateInterface} from "../interface/condominium.interface";
import {ConstraintException} from "../exception/constraint.exception";
import {Includeable, WhereOptions} from "sequelize/types/lib/model";
import {ParentRequestInterface} from "../interface/parent-request.interface";

export default class CondominiumRepository {
    private parentRequestInterface: Boolean | any;

    async get(id: number, parentRequestInterface?: ParentRequestInterface): Promise<Condominiums | null> {
        try {

            let ident: Identifier = id;
            let include: Includeable[] = [];
            let whereParent: WhereOptions = {};

            if (parentRequestInterface?.parentIds)
                whereParent = {id: parentRequestInterface?.parentIds}

            if (this.parentRequestInterface?.eagerParent || parentRequestInterface?.parentIds)
                include = [{model: CondominiumTypes, where: whereParent}];

            return await Condominiums.findByPk<Condominiums>(ident, {
                attributes: Condominiums.toArrayOfFields(),
                include
            });
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }

    async getAll(parentRequestInterface?: ParentRequestInterface): Promise<Condominiums[]> {
        try {
            let include: Includeable[] = [];
            let whereParent: WhereOptions = {};

            if (parentRequestInterface?.parentIds)
                whereParent = {id: parentRequestInterface?.parentIds}

            if (parentRequestInterface?.eagerParent || parentRequestInterface?.parentIds)
                include = [{model: CondominiumTypes, where: whereParent}];

            return await Condominiums.findAll<Condominiums>({
                attributes: Condominiums.toArrayOfFields(),
                order: ['id'],
                include
            });
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }

    async post(condominiumInterface: CondominiumCreateInterface) {
        try {
            return await Condominiums.create<Condominiums>(condominiumInterface);
        } catch (error) {
            winston.error(error);
            if (error.name == 'SequelizeForeignKeyConstraintError') {
                let errorMessage = error.original.detail.split(' in table')[0];
                throw new ConstraintException(error.name, `Error to insert condominium ${errorMessage}`);
            }
            throw error;
        }
    }

    async put(id: number, condominiumUpdateInterface: CondominiumUpdateInterface): Promise<[number, Condominiums[]]> {
        try {
            const update: UpdateOptions = {
                where: {id: id},
                limit: 1,
            };
            return await Condominiums.update<Condominiums>(condominiumUpdateInterface, update);
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
            return await Condominiums.destroy<Condominiums>(destroyOptions);
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }
}
