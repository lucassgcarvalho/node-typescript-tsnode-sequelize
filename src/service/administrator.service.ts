import AdministratorRepository from '../repository/administrator.repository';
import {NotFoundException} from "../exception/not-found.exception";
import {GenericException} from "../exception/generic.exception";
import {AdministratorInterface} from "../interface/administrator.interface";
import {InternalServerException} from "../exception/internal-server.exception";
import {AdministratorModel} from "../models/administrator/administrator.model";
import {ConstraintException} from "../exception/constraint.exception";
import {UniqueConstraintError} from "sequelize";
import winston from "../config/logger/winston";
import Utils from "../utils/utils";

export default class AdministratorService {

    private userRepository: AdministratorRepository;

    constructor() {
        this.userRepository = new AdministratorRepository();
    }

    async get(id: any): Promise<AdministratorInterface> {
        try {
            const administratorModel = await this.userRepository.get(id);
            if (administratorModel) {
                let model:AdministratorInterface = administratorModel.toJSON();
                delete model.password;
                return model;
            }
            throw new NotFoundException('User not found', `User with id ${id} not found`);
        } catch (error) {
            winston.error(error);
            if (error instanceof GenericException)
                throw error;
            throw new InternalServerException(`${error}`, `Error to fetch user`);
        }
    }

    async getByEmail(email: string): Promise<AdministratorInterface> {
        try {
            const administratorModel = await this.userRepository.getByEmail(email);
            if (administratorModel)
                return administratorModel.toJSON();
            throw new NotFoundException('User not found', `User with E-mail ${email} not found`);
        } catch (error) {
            winston.error(error);
            if (error instanceof GenericException)
                throw error;
            throw new InternalServerException(`${error}`, `Error to fetch user`);
        }
    }

    async getAll(): Promise<AdministratorInterface[] | []> {
        try {
            let administratorModel: AdministratorModel[] = await this.userRepository.getAll();
            return administratorModel.map((administratorModel: AdministratorModel) => {
                let model:AdministratorInterface = administratorModel.toJSON();
                delete model.password;
                return model;
            })
        } catch (error) {
            winston.error(error);
            if (error instanceof GenericException)
                throw error;
            throw new InternalServerException(`${error}`, `Error to fetch users`);
        }
    }

    async post(body: AdministratorInterface): Promise<AdministratorInterface> {
        try {
            let administratorModel: AdministratorModel = await this.userRepository.post(body);
            let model:AdministratorInterface = administratorModel.toJSON();
            delete model.password;
            return model;
        } catch (error) {
            winston.error(error);
            if (error instanceof  UniqueConstraintError){
                throw new ConstraintException(error.message, Utils.formatErrorFromConstraint(error.errors));
            }
            throw error;
        }
    }

    async put(id: number, administratorModelInterface: AdministratorInterface): Promise<boolean> {
        try {
            delete administratorModelInterface.id;
            delete administratorModelInterface.createdAt;
            delete administratorModelInterface.updatedAt;

            let [number, admin]: [number, AdministratorModel[]] = await this.userRepository.put(id, administratorModelInterface);
            if (!number || number < 1)
                throw new NotFoundException();

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
            let resp: number = await this.userRepository.delete(id);
            if (!resp || resp < 1)
                throw new NotFoundException();
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
