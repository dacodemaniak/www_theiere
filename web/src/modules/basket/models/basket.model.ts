import { ProductBasketModel } from "./product-basket.model";

/**
 * @name BasketModel
 * @desc Modèle de l'instance d'un panier :
 *  - Tableau des produits du panier,
 *  - Slug de l'adresse de livraison
 *  - L'opérateur de livraison (Colissimo, Mondial Relay, ...)
 *  - Le type de livraison (signed, unsigned, picking)
 *  - Montant des frais de port
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package modules/basket/models
 * @version 1.0.0
 */

 export class BasketModel {
     private deliverySlug?: string;
     private carrier: string;
     private deliveryType: string;
     private charge: number;
     private basket: Array<ProductBasketModel>;

     public setCarrier(carrier: string): BasketModel {
         this.carrier = carrier;
         return this;
     }

     public setDeliveryType(deliveryType: string): BasketModel {
         this.deliveryType = deliveryType;
         return this;
     }

     public setCharge(charge: number): BasketModel {
         this.charge = charge;
         return this;
     }

     public getCharge(): number {
        return this.charge;
     }

     public setBasket(basket: Array<ProductBasketModel>): BasketModel {
         this.basket = basket;
         return this;
     }
     
 }