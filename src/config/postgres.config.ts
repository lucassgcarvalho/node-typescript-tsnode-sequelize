import {Sequelize} from "sequelize";

require('dotenv').config();

export class PostgresConfigSequelize {
    private TIME_ZONE = process.env.TIME_ZONE ?  process.env.TIME_ZONE : 'America/Sao_Paulo';
    private isProduction = process.env.NODE_ENV === 'production'
    private connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
    private _sequelize!: Sequelize;

    constructor() {
       const seq =  new Sequelize(
            this.connectionString,
            {
                pool:{
                    max: 1,
                    min: 1,
                    maxUses: 70000,
                    evict: 1
                },
                logging: true,
                dialect:'postgres',
                logQueryParameters: true,
                typeValidation: true,
                timezone: 'America/Sao_Paulo',
                dialectOptions: {
                    timezone: 'America/Sao_Paulo',
                },
                define: {
                    charset: "utf8",
                }
            }
        );
        seq.connectionManager.initPools();
        this.setSequelize(seq);
    }

    async setTimezone() {
        await this.getSequelize().query(`SET TIME ZONE '${this.TIME_ZONE}'`);
    }

    getSequelize(): Sequelize {
        return this._sequelize;
    }

    setSequelize(value: Sequelize) {
        this._sequelize = value;
    }

  /*  async executeQuery(query: string, parameters?: string[]) {
        return (await this.sequelize.).query(query);
    }*/
}
