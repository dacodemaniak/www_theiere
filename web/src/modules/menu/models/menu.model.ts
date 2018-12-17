/**
 * @name MenuModel
 * @desc Définition des données de base des menus
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules/menu
 * @version 1.0.0
 */
import { OptionModel } from './option.model';

export abstract class MenuModel {
    protected id: number;
    protected slug: string;
    protected region: string;
    protected options?: Array<OptionModel>;

    public deserialize(datas: any) {
        this.id = datas.id;
        this.slug = datas.slug;
        this.region = datas.region;
        // Récupérer les options pour alimenter le tableau des options
        if (datas.options) {
            this.options = new Array<OptionModel>();
            datas.options.forEach((option: any) => {
                const anOption: OptionModel = new OptionModel();
                anOption.deserialize(option);
                this.options.push(anOption);
            });
        } else {
            console.warn('Aucune option pour le menu ' + this.slug);
        }
    }
}