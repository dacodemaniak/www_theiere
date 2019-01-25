/**
 * @name CarryingModel
 * @desc Modèle pour la gestion des expéditions
 * @author IDea Factory - Jan. 2018 (dev-team@ideafactory.fr)
 * @package modules/basket/models
 * @version 1.0.0
 */

 interface PriceInterface {
    weight: number;
    picking: number;
    signed?: number;
    unsigned?: number;
 }

 interface ModeInterface {
     key: string;
     value: string;
 }

export class CarryingModel {
    private name: string;
    private logo: string;
    private hasMany: boolean;
    private modes?: ModeInterface[];
    private tarifs: PriceInterface[];

    public getName(): string {
        return this.name;
    }

    public getLogo(): string {
        return this.logo;
    }

    public getPrices(): PriceInterface[] {
        return this.tarifs;
    }

    public notOnlyPicking(): boolean {
        return this.hasMany;
    }

    public getModes(): ModeInterface[] {
        return this.modes;
    }
    public deserialize(datas: any) {
        Object.assign(this, datas);
    }
}