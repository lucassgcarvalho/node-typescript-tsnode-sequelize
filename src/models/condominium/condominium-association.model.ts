import {Model} from "sequelize";
import {Condominiums} from "./condominiums";
import {CondominiumTypes} from "../condominium-type/condominium.types";
import winston from "../../config/logger/winston";

export default class CondominiumAssociationModel extends Model {

    public static async associate(): Promise<void> {
        try {
            await Condominiums.belongsTo(CondominiumTypes,
                {
                    foreignKey: {
                        field: 'idCondominiumType',
                        name: 'condominiumType',
                        allowNull: false
                    },
                    onDelete: 'RESTRICT',
                    onUpdate: 'CASCADE',
                    hooks: true,
                });

            winston.info(`Association [CondominiumModel] with [CondominiumTypesModel] successfully`);
        } catch (error) {
            winston.error(`Error to associate tables [CondominiumModel] with [CondominiumTypesModel]: ${error}`);
        }
    }

}
