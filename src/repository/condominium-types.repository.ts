import {DestroyOptions, Identifier, UpdateOptions} from "sequelize";
import winston from "../config/logger/winston";
import {CondominiumTypes} from "../models/condominium-type/condominium.types";
import {ConstraintException} from "../exception/constraint.exception";
import {CondominiumTypeInterface} from "../interface/condominium-type.interface";
import {Condominiums} from "../models/condominium/condominiums";
import {Includeable, WhereOptions} from "sequelize/types/lib/model";
import {ParentRequestInterface} from "../interface/parent-request.interface";

export default class CondominiumTypesRepository {

    async get(id: number, parentRequestInterface?: ParentRequestInterface): Promise<CondominiumTypes> {
        try {
            let ident: Identifier = id;
            let include: Includeable[] = [];
            let whereParent: WhereOptions = {};

            if (parentRequestInterface?.parentIds)
                whereParent = {id: parentRequestInterface?.parentIds}

            if (parentRequestInterface?.eagerParent || parentRequestInterface?.parentIds)
                include = [{model: Condominiums, where: whereParent}];

            return await CondominiumTypes.findByPk<CondominiumTypes>(ident, {include}) as CondominiumTypes;
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }


    async getAll(parentRequestInterface?: ParentRequestInterface): Promise<CondominiumTypes[]> {
        try {
            let include: Includeable[] = [];
            let whereParent: WhereOptions = {};

            if (parentRequestInterface?.parentIds)
                whereParent = {id: parentRequestInterface?.parentIds}

            if (parentRequestInterface?.eagerParent || parentRequestInterface?.parentIds)
                include = [{model: Condominiums, where: whereParent}];

            return await CondominiumTypes.findAll<CondominiumTypes>({order: ['id'], include});
        } catch (error) {
            winston.error(error);
            throw error;
        }
    }

    async post(condominiumTypeInterface: CondominiumTypeInterface) {
        try {
            return await CondominiumTypes.create<CondominiumTypes>(condominiumTypeInterface);
        } catch (error) {
            winston.error(error);
            if (error.name == 'SequelizeForeignKeyConstraintError') {
                let errorMessage = error.original.detail.split(' in table')[0];
                throw new ConstraintException(error.name, `Error to insert condominium ${errorMessage}`);
            }
            throw error;
        }
    }

    async put(id: number, condominiumTypeInterface: CondominiumTypeInterface): Promise<[number, CondominiumTypes[]]> {
        try {
            const update: UpdateOptions = {
                where: {id: id},
                limit: 1,
            };
            return await CondominiumTypes.update<CondominiumTypes>(condominiumTypeInterface, update);
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
            return await CondominiumTypes.destroy<CondominiumTypes>(destroyOptions);
        } catch (error) {
            winston.error(error);
            if (error.name == 'SequelizeForeignKeyConstraintError')
                throw new ConstraintException('ForeignKeyConstraintError', 'Unable to delete Condominium Type');
            throw error;
        }
    }
}
