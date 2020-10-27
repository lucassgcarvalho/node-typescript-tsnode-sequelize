import {DataTypes, Model} from "sequelize";
import {PostgresConfigSequelize} from "../../config/postgres.config";
import moment from 'moment';

const sequelize = new PostgresConfigSequelize().getSequelize();

export class CondominiumTypes extends Model {
}
CondominiumTypes.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(250),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        active: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            defaultValue: 1
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            get(): Date {
                let momentMapped = moment(this.getDataValue('updatedAt'));
                momentMapped.utc(true)
                return momentMapped.toDate();
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            get(): Date {
                let momentMapped = moment(this.getDataValue('createdAt'));
                momentMapped.utc(true)
                return momentMapped.toDate();
            }
        }
    },
    {
        tableName: "condominiumTypes",
        timestamps: true,
        sequelize,
    },
);
