import { BasketService } from './../../services/basket.service';
import { BasketModel } from './models/basket.model';
/**
 * @name BasketListModule
 * @desc Affichage de la liste des produits dans le panier
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules\basket
 * @version 1.0.0
 */
export class BasketListModule {
    private basket: Array<BasketModel>;

    public constructor() {
        console.log('BasketListModule works !');
        this._init().then((panier) => {
            this.basket = panier;

            // Construit le panier
            const tbody: JQuery = $('#basket-list tbody');

            if (this.basket.length) {
                for (let product of this.basket) {
                    product.getTableRow().then((row) => {
                        tbody.append(row);
                    });
                }
            }

            $('#basket-list').removeClass('hidden');
        });
    }

    /**
     * Récupère les produits du panier
     */
    private _init(): Promise<Array<BasketModel>> {
        return new Promise((resolve) => {
            const basketService: BasketService = new BasketService();
            basketService.localBasket().then((panier) => {
                resolve(panier);
            });
        });
        
    }
}