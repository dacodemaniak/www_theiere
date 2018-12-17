/**
 * @name BasketModule
 * @desc Gestion du panier utilisateur
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules/basket
 * @version 1.0.0
 */
import { UserModel } from './../user/models/user.model';
import { UserService } from './../../services/user.service';
import { BasketMenuModel } from './models/basket-menu.model';

export class BasketModule {
    private userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;

        this.init();
    }

    /**
     * Initialisation du module Basket
     */
    private init() {
        if (this.userService.hasUser()) {
            console.log('Un utilisateur dans localStorage');
        } else {
            this.userService.getAnonymouseUser().then((response) => {
                const menus: Array<any> = response.menus;
                const basketMenu = menus.filter(
                    (element) => { return element.region === '_top'}
                );
                const menu = new BasketMenuModel();
                menu.deserialize(basketMenu[0]);
                
                menu.render();
            })
        }
    }
}