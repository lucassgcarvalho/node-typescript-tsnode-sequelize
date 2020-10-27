import Sequelize, {DataTypes, Model} from "sequelize";
import {PostgresConfigSequelize} from "../../config/postgres.config";
import moment from 'moment';
import {CondominiumTypes} from "../condominium-type/condominium.types";

const sequelize = new PostgresConfigSequelize().getSequelize();

export class Condominiums extends Model {
    public static toArrayOfFields(): string[] {
        return [
            Sequelize.col('id').col,
            Sequelize.col('name').col,
            Sequelize.col('address').col,
            Sequelize.col('active').col,
            Sequelize.col('createdAt').col,
            Sequelize.col('updatedAt').col
        ];
    }
}
Condominiums.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        active: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            defaultValue: 1
        },
        updatedAt: {
            type: DataTypes.DATE,
            get(): Date {
                let momentMapped = moment(this.getDataValue('updatedAt'));
                momentMapped.utc(true)
                return momentMapped.toDate();
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            get(): Date {
                let momentMapped = moment(this.getDataValue('createdAt'));
                momentMapped.utc(true)
                return momentMapped.toDate();
            }
        },
        condominiumType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'idCondominiumType',
            references: {
                model: CondominiumTypes,
                key: 'id'
            }
        }
    },
    {
        tableName: "condominiums",
        timestamps: true,
        sequelize,
    },
);
