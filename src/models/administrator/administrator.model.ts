import {DataTypes, Model} from "sequelize";
import {PostgresConfigSequelize} from "../../config/postgres.config";
import moment from 'moment';
import bcrypt from "bcrypt";

const sequelize = new PostgresConfigSequelize().getSequelize();

export class AdministratorModel extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public active!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

AdministratorModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING(256),
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
        }
    },
    {
        tableName: "administrators",
        timestamps: true,
        sequelize,
    },
);
AdministratorModel.addHook('beforeValidate', function(administratorModel: AdministratorModel, options) {
    if (administratorModel.password)
        administratorModel.password = bcrypt.hashSync(administratorModel.password as string, 10 as number) as string;
})
