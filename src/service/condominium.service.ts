import {NotFoundException} from "../exception/not-found.exception";
import {GenericException} from "../exception/generic.exception";
import {InternalServerException} from "../exception/internal-server.exception";
import {ConstraintException} from "../exception/constraint.exception";
import {UniqueConstraintError} from "sequelize";
import winston from "../config/logger/winston";
import CondominiumRepository from "../repository/condominium.repository";
import {
    CondominiumCreateInterface,
    CondominiumInterface,
    CondominiumUpdateInterface
} from "../interface/condominium.interface";
import {Condominiums} from "../models/condominium/condominiums";
import Utils from "../utils/utils";
import {ParentRequestInterface} from "../interface/parent-request.interface";

export default class CondominiumService {

    private condominiumRepository: CondominiumRepository;

    constructor() {
        this.condominiumRepository = new CondominiumRepository();
    }

    async get(id: any, parentRequestInterface?: ParentRequestInterface): Promise<CondominiumInterface> {
        try {
            const model = await this.condominiumRepository.get(id, parentRequestInterface);
            if (model)
                return model.toJSON() as CondominiumInterface;
            throw new NotFoundException('Condominium not found', `Condominium with id ${id} not found`);
        } catch (error) {
            winston.error(error);
            if (error instanceof GenericException)
                throw error;
            throw new InternalServerException(`${error}`, `Error to fetch user`);
        }
    }

    async getAll(parentRequestInterface?: ParentRequestInterface): Promise<CondominiumInterface[]> {
        try {
            let result = await this.condominiumRepository.getAll(parentRequestInterface);
            if(result){
                result.map((condominiumModel: Condominiums) => {
                    return condominiumModel.toJSON();
                });
            }

            return result as CondominiumInterface[];
        } catch (error) {
            winston.error(error);
            if (error instanceof GenericException)
                throw error;
            throw new InternalServerException(`${error}`, `Error to fetch Condominiums`);
        }
    }

    async post(body: CondominiumCreateInterface): Promise<CondominiumInterface> {
        try {
            let result = await this.condominiumRepository.post(body);
            return result.toJSON() as CondominiumInterface;
        } catch (error) {
            winston.error(error);
            if (error instanceof  UniqueConstraintError){
                throw new ConstraintException(error.message, Utils.formatErrorFromConstraint(error.errors));
            }
            throw error;
        }
    }

    async put(id: number, condominiumInterface: CondominiumUpdateInterface): Promise<boolean> {
        try {
            let [number, admin]: [number, Condominiums[]] = await this.condominiumRepository.put(id, condominiumInterface);
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
            let resp: number = await this.condominiumRepository.delete(id);
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
