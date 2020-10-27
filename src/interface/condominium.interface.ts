import {CondominiumTypeInterface} from "./condominium-type.interface";

export interface CondominiumInterface {
    id?: number;
    name?: string;
    address?: string;
    active?: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export interface CondominiumCreateInterface extends NonNullable<CondominiumInterface>{
    condominiumType: number;
}

export interface CondominiumUpdateInterface extends NonNullable<CondominiumInterface>{
    condominiumType: NonNullable<CondominiumTypeInterface>;
}
