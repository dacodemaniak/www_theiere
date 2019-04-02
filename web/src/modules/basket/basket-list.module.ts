import { StepComponent } from './step-component';
import { RouterModule } from './../router/router.module';
import { UserService } from './../../services/user.service';
import { ToastModule } from './../toast/toast.module';
import { BasketService } from './../../services/basket.service';
import { ProductBasketModel } from './models/product-basket.model';
import { StringToNumberHelper } from '../../helpers/string-to-number.helper';
import { DialogModule } from './../dialog/dialog.module';
import { Constants } from '../../shared/constants';
import { UserModel } from '../user/models/user.model';
import { UserMenuModel } from '../user/models/user-menu.model';

import * as $ from 'jquery';
import { SmoothRemoveHelper } from '../../helpers/smooth-remove.helper';

/**
 * @name BasketListModule
 * @desc Affichage de la liste des produits dans le panier
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules\basket
 * @version 1.0.0
 */
export class BasketListModule {
    private basket: Array<ProductBasketModel>;
    private userService: UserService;
    private stepComponent: StepComponent;

    public constructor() {
        this.userService = new UserService();

        this.userService.hasUser().then((has: boolean) => {
            let disableButton: boolean = false;
            this._init().then((panier) => {
                this.basket = panier;
    
                // Instancie le gestionnaire de progression
                this.stepComponent = new StepComponent(this.userService, this.basket);
                
                // Construit le panier
                const tbody: JQuery = $('#basket-list tbody');
                let granTotal: number = 0;
                let fullTaxTotal: number = 0;
    
                if (this.basket.length) {
                    for (let product of this.basket) {
                        let total: number = product.priceHT * product.quantity;
                        granTotal += total;
    
                        fullTaxTotal += this._getTTC(product, product.product);

                        product.getCardItem().then((card: JQuery) => {
                            $('#basket-list').append(card);
                            $('.gran-total').html(StringToNumberHelper.toCurrency(granTotal.toString()));
                            $('.fulltax-total').html(StringToNumberHelper.toCurrency(fullTaxTotal.toString()));
                        })
                    }
                    $('#basket-list').removeClass('hidden');
                    
                    // Initialise les listeners
                    this._listeners();
                } else {
                    // Le panier est vide...
    
                }
            });

            if (disableButton) {
                $('#next-step').addClass('disabled');
            }
        });

    }

    /**
     * Récupère les produits du panier
     */
    private _init(): Promise<Array<ProductBasketModel>> {
        return new Promise((resolve) => {
            const basketService: BasketService = new BasketService();
            basketService.localBasket().then((panier) => {
                resolve(panier);
            });
        });
    }

    private _listeners(): void {
        $('#basket-list').on(
            'click',
            (event: any): void => this._click(event)
        );
    }

    private _click(event: any): void {
        const element: JQuery = $(event.target);
        const bundleId: string = element.parents('.basket-card').attr('data-rel');

        if (element.hasClass('remove-product')) {
            this._remove(element);
        } else if (element.hasClass('increase')) {
            this._increase(element);
        } else if (element.hasClass('decrease')) {
            this._decrease(element);
        }
    }

    private _remove(element: JQuery): void {
        const productName: string = element.parents('.basket-card').eq(0).find('h3').eq(0).html();
        const dialog: DialogModule = new DialogModule(
            element,
            {
                title: 'Retirer un produit du panier',
                content: 'Etes-vous sûr de vouloir retirer <strong>' + productName + '</strong> de votre panier ?'
            }
        );
        dialog.show();

        element.off('dismiss').on(
            'dismiss',
            (event: any): void => {
                console.info('Dialogue dismissed');
                event.stopPropagation();
            }
        );

        element.off('confirm').on(
            'confirm',
            (event: any) => {
                console.info('Suppression de la ligne ' + $(event.target).attr('data-rel'));
                const basketService: BasketService = new BasketService();
                
                basketService.removeProduct($(event.target).attr('data-rel')).then((result) => {
                    if (result) {
                        // Suppression de la ligne dans le tableau HTML

                        SmoothRemoveHelper.remove($('div#' + $(event.target).attr('data-rel')));
                        
                        const product: ProductBasketModel = basketService.get();
                        // Recalcule les totaux...
                        
                        let totalTTC: number = StringToNumberHelper.toNumber($('.fulltax-total').html());

                        const removeTTC: number = (product.quantity * product.getFullTaxPrice());
                        totalTTC -= removeTTC;

                        // Réaffiche les totaux
                        $('.fulltax-total').html(StringToNumberHelper.toCurrency(totalTTC.toString()));

                        const remainingLines: number = $('#basket-list .basket-card').length;

                        if (remainingLines === 0) {
                            // Si plus aucune ligne dans le panier, on réactive le hidden
                            $('#basket-list').addClass('hidden');

                            // on ajoute un message...
                            const toast: ToastModule = new ToastModule({
                                type: 'info',
                                title: 'Votre panier est vide',
                                position: 'middle-center',
                                message: 'Plus aucun produit dans votre panier.'
                            });
                            toast.show();

                            // on redirige vers l'accueil
                            const router: RouterModule = new RouterModule();
                            router.changeLocation('/');
                        }

                    } else {
                        const toast: ToastModule = new ToastModule({
                            type: 'danger',
                            title: 'Une erreur est survenue',
                            position: 'middle-center',
                            message: 'Une erreur est survenue lors du retrait du produit de votre panier'
                        });
                        toast.show();
                    }
                });
            }
        )
    }

    private _increase(button: JQuery): void {
        const input: JQuery = button.parent().prev();
        let currentQty: number = parseInt(input.val().toString());
        const max: number = parseInt(input.attr('max'));

        
        let totalTTC: number = StringToNumberHelper.toNumber($('.fulltax-total').html());

        if (currentQty + 1 <= max) {
            currentQty++;
            input.val(currentQty);

            // Met à jour le panier en conséquence
            const productId: string = input.parents('div.basket-card').attr('data-rel');
            const productFullTaxPrice: number = parseFloat(input.parents('div.basket-card').attr('data-pricing'));

            const basketService: BasketService = new BasketService();
            basketService.updateProduct(productId, currentQty).then((product) => {
                if (product) {
                    // Recalcul des totaux
                    let newHT: number = currentQty * product.priceHT;

                    let newTTC: number = currentQty * productFullTaxPrice;

                    let totalIncrement: number = productFullTaxPrice;

                    // Mise à jour de la colonne associée
                    const _total: JQuery = input.parents('div.basket-card').find('div.product-total').eq(0);
                    _total.html(StringToNumberHelper.toCurrency(newTTC.toString()));


                    totalTTC += totalIncrement;

                    $('.fulltax-total').html(StringToNumberHelper.toCurrency(totalTTC.toString()));
                }
            });
        }
    }

    private _decrease(button: JQuery): void {
        const input: JQuery = button.parent().next();
        let currentQty: number = parseInt(input.val().toString());
        const min: number = parseInt(input.attr('max'));

        
        let totalTTC: number = StringToNumberHelper.toNumber($('.fulltax-total').html());

        if (currentQty - 1 <= min) {
            currentQty--;
            input.val(currentQty);

            // Met à jour le panier en conséquence
            const productId: string = input.parents('div.basket-card').attr('data-rel');
            const productFullTaxPrice: number = parseFloat(input.parents('div.basket-card').attr('data-pricing'));


            const basketService: BasketService = new BasketService();
            basketService.updateProduct(productId, currentQty).then((product) => {
                if (product) {
                    // Recalcul des totaux
                    let newHT: number = currentQty * product.priceHT;

                    let newTTC: number = currentQty * productFullTaxPrice;

                    //let newTTC: number = parseFloat(((currentQty * product.priceHT) * (1 + product.product.vat)).toFixed(2));
                    let totalIncrement: number = productFullTaxPrice;

                    // Mise à jour de la colonne associée
                    const _total: JQuery = input.parents('div.basket-card').find('div.product-total').eq(0);
                    _total.html(StringToNumberHelper.toCurrency(newTTC.toString()));


                    totalTTC -= totalIncrement;

                    $('.fulltax-total').html(StringToNumberHelper.toCurrency(totalTTC.toString()));
                }
            });
        }
    }

    private _getTTC(inBasket: ProductBasketModel, product: any): number {
        const priceList: Array<any> = product.pricing;
        
        let price: any;

        if (priceList.length > 1) {
            const index: number = priceList.findIndex((obj: any) => { return obj.quantity == inBasket.servingSize});
            price = priceList[index].ttc;
        } else {
            price = priceList[0].ttc;
        }

        /**
        let vat: number = product.vat;
        if (vat === 0.05) {
            vat = 0.055;
        }
        return inBasket.quantity * (inBasket.priceHT * (1 + vat));
         */
        return inBasket.quantity * price;
    }
}