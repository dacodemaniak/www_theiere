import { MenuModel } from "../../menu/models/menu.model";
import { OptionModel } from "../../menu/models/option.model";

import * as $ from 'jquery';
/**
 * @name BasketMenuModel
 * @desc Instance du menu Panier avec ou sans utilisateur
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules/basket/models
 * @version 1.0.0
 */


export class BasketMenuModel extends MenuModel {
    private isAnonymous: boolean = true;

    public render() {
        const userBasket: JQuery = $('#user-basket').children('.wrapper').eq(0);

        const mainOption: OptionModel = this.getOption();

        mainOption.getMenu().appendTo(userBasket);
    }

    private getOption(): OptionModel {
        const options: Array<OptionModel> = this.options;

        console.log('Options : ' + JSON.stringify(options));

        let index: number = options.findIndex((obj: OptionModel) => { return obj.getSlug() == 'basket'});

        const option = options[index];

        return option;
    }
}