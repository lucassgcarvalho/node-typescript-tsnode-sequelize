import {Model} from "sequelize";
import {Condominiums} from "../condominium/condominiums";
import {CondominiumTypes} from "./condominium.types";
import winston from "../../config/logger/winston";

export default class CondominiumTypeAssociationModel extends Model {

    public static async associate(): Promise<void> {
        try {
            await CondominiumTypes.hasMany(Condominiums, {
                    foreignKey: {
                        field: 'idCondominiumType',
                        name: 'condominiumType',
                        allowNull: false
                    },
                    onDelete: 'RESTRICT',
                    onUpdate: 'CASCADE',
                    hooks: true
                }
            );
            winston.info(`Association [CondominiumTypesModel] with [CondominiumModel] successfully`);
        } catch (error) {
            winston.error(`Error to associate tables [CondominiumTypesModel] with [CondominiumModel]: ${error}`);
        }
    }
}
