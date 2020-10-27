import {AdministratorModel} from "../administrator/administrator.model";
import {CondominiumTypes} from "../condominium-type/condominium.types";
import winston from "winston";
import {Condominiums} from "../condominium/condominiums";

export class SyncModel {

    public static async syncModels(sync: boolean = false, resetTable: boolean = false, alterTable: boolean = false): Promise<void>{
        if(sync){
           await SyncModel.synchronize(resetTable, alterTable)
                .then(() => {
                    winston.info(`Tables was successfully updated!`);
                })
                .catch( (error) =>{
                    winston.error(`Error to update tables with parameters [sync=${sync}, resetTable=${resetTable}, alterTable=${alterTable}] -> Error: ${error}`);
                });
        }
    }

    private static async synchronize(resetTable: boolean = false, alterTable: boolean = false): Promise<void>{
        await AdministratorModel.sync({force: false, alter: alterTable})
            .then(()=> {winston.info(`AdministratorModel was successfully updated!`);}).catch((error)=>{winston.error(`Error to update AdministratorModel with parameters [resetTable=${resetTable}, alterTable=${alterTable}] -> Error: ${error}`);});

        await CondominiumTypes.sync({force: resetTable, alter: alterTable})
            .then(()=> {winston.info(`CondominiumTypesModel was successfully updated!`);}).catch((error)=>{winston.error(`Error to update CondominiumTypesModel with parameters [resetTable=${resetTable}, alterTable=${alterTable}] -> Error: ${error}`);});;

        await Condominiums.sync({force: resetTable, alter: alterTable})
            .then(()=> {winston.info(`CondominiumModel was successfully updated!`);}).catch((error)=>{winston.error(`Error to update CondominiumModel with parameters [resetTable=${resetTable}, alterTable=${alterTable}] -> Error: ${error}`);});
    }

}
