import {NotFoundException} from "../exception/not-found.exception";
import {GenericException} from "../exception/generic.exception";
import {InternalServerException} from "../exception/internal-server.exception";
import {ConstraintException} from "../exception/constraint.exception";
import {UniqueConstraintError} from "sequelize";
import winston from "../config/logger/winston";
import {Condominiums} from "../models/condominium/condominiums";
import {CondominiumTypeInterface} from "../interface/condominium-type.interface";
import CondominiumTypesRepository from "../repository/condominium-types.repository";
import {CondominiumTypes} from "../models/condominium-type/condominium.types";
import {ParentRequestInterface} from "../interface/parent-request.interface";
import Utils from "../utils/utils";


export default class CondominiumTypeService {

    private condominiumTypesRepository: CondominiumTypesRepository;

    constructor() {
        this.condominiumTypesRepository = new CondominiumTypesRepository();
    }

    async get(id: number, parentRequestInterface?: ParentRequestInterface): Promise<CondominiumTypeInterface> {
        try {
            const model = await this.condominiumTypesRepository.get(id, parentRequestInterface);
            if (model)
                return model.toJSON() as CondominiumTypeInterface;

            let message = `Condominium Type with id ${id} not found`;
            if(parentRequestInterface?.parentIds)
                message = `Condominium Type with id [${id}] and parent with id [${parentRequestInterface.parentIds}] not found`;

            throw new NotFoundException('Condominium Type not found', message);
        } catch (error) {
            winston.error(error);
            if (error instanceof GenericException)
                throw error;
            throw new InternalServerException(`${error}`, `Error to fetch user`);
        }
    }

    async getAll(parentRequestInterface?: ParentRequestInterface): Promise<CondominiumTypeInterface[]> {
        try {
            let result = await this.condominiumTypesRepository.getAll(parentRequestInterface);
            if(result){
                return result.map((condominiumTypes: CondominiumTypes) => {
                    return condominiumTypes.toJSON();
                });
            }
            return result as CondominiumTypeInterface[];
        } catch (error) {
            winston.error(error);
            if (error instanceof GenericException)
                throw error;
            throw new InternalServerException(`${error}`, `Error to fetch Condominiums`);
        }
    }

    async post(body: CondominiumTypeInterface): Promise<CondominiumTypeInterface> {
        try {
            let result = await this.condominiumTypesRepository.post(body);
            return result.toJSON() as CondominiumTypeInterface;
        } catch (error) {
            winston.error(error);
            if (error instanceof  UniqueConstraintError){
                throw new ConstraintException(error.message, Utils.formatErrorFromConstraint(error.errors));
            }
            throw error;
        }
    }

    async put(id: number, condominiumTypeInterface: CondominiumTypeInterface): Promise<boolean> {
        try {
            let [number, admin]: [number, Condominiums[]] = await this.condominiumTypesRepository.put(id, condominiumTypeInterface);
            if (!number || number < 1) throw new NotFoundException();
            return true;
        } catch (error) {
            winston.error(error)
            if (error instanceof  UniqueConstraintError){
                throw new ConstraintException(error.message, Utils.formatErrorFromConstraint(error.errors));
            }
            throw error;
        }
    }

    async delete(id: any): Promise<boolean> {
        try {
            let resp: number = await this.condominiumTypesRepository.delete(id);
            if (!resp || resp < 1) throw new NotFoundException();
            return true;
        } catch (error) {
            winston.error(error);
            if (error instanceof  UniqueConstraintError){
                throw new ConstraintException(error.message, Utils.formatErrorFromConstraint(error.errors));
            }
            throw error;
        }
    }

}
