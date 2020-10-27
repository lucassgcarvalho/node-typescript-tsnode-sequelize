import winston from "../../config/logger/winston";
import CondominiumTypeAssociationModel from "../condominium-type/condominium-type-association.model";
import CondominiumAssociationModel from "../condominium/condominium-association.model";

export class AssociationsModel {

    public static async association(isAssociation: boolean): Promise<void> {
        if(isAssociation)
            AssociationsModel.associate()
                .then(() => {
                    winston.info(`Tables was successfully associated!`);
                })
                .catch((error) => {
                    winston.error(`Error to associate tables - Error: ${error}`);
                });
    }

    private static async associate(): Promise<void> {
        await CondominiumAssociationModel.associate();
        await CondominiumTypeAssociationModel.associate();
    }
}
