import { UserService } from './../../services/user.service';
/**
 * @name StepComponent
 * @desc Gestion du bandeau d'étapes de validation du panier
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package modules/basket/components
 * @version 1.0.0
 */

 import * as $ from 'jquery';
import { BasketModel } from './models/basket.model';

export class StepComponent {
    private signinStep: JQuery;
    private basketStep: JQuery;
    private deliveryStep: JQuery;
    private paymentStep: JQuery;

    private userService: UserService;
    private basket: Array<BasketModel>;

    public constructor(userService: UserService, basket: Array<BasketModel>) {
        this.userService = userService;
        this.basket = basket;

        this.signinStep = $('#signin');
        this.basketStep = $('#basket-checkin');

        this._init();
    }

    private _init(): void {
        console.info('Step Component in loading');

        // Contrôle de l'étape 1
        this._userStep();

        // Contrôle l'étape 2
        this._basketStep();
    }

    private _userStep(): void {
        this.userService.hasUser().then((result) => {
            if (result) {
                // Désactiver l'étape Identification
                this.signinStep.addClass('disabled');
            }
        })
    }

    private _basketStep(): void {
        if (this.basket.length === 0) {
            this.basketStep.addClass('disabled');
            this.basketStep.children('.bs-wizard-info').eq(0).html('Parcourez notre catalogue et ajoutez des produits dans votre panier');
        }
    }
}