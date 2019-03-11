import { UserModel } from './../../user/models/user.model';
import { BasketService } from './../../../services/basket.service';
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

    public render(user: UserModel = null) {
        const userBasket: JQuery = $('#user-basket').children('.wrapper').eq(0);

        const mainOption: OptionModel = this.getOption();

        // Ajouter le nombre de produits dans le panier : 0 par défaut
        const basketService: BasketService = new BasketService();
        basketService.localBasket().then((basket) => {
            const option = mainOption.getMenu();
            const quantity: JQuery = $('<span>');
            quantity
                .addClass('badge')
                .addClass('badge-warning')
                .addClass('exposant')
                .html(basket.length.toString());
            // Raccroche l'ensemble au wrapper
            option.appendTo(userBasket);
            quantity.appendTo(userBasket);
        });
        
    }

    private getOption(): OptionModel {
        const options: Array<OptionModel> = this.options;

        let index: number = options.findIndex((obj: OptionModel) => { return obj.getSlug() == 'basket'});

        const option = options[index];

        return option;
    }
}