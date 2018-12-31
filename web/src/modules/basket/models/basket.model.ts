/**
 * @name BasketModel
 * @desc Définition d'un élément du panier
 * @author IDea Factory - Déc. 2018
 * @package modules/basket/models
 * @version 1.0.0
 */
export class BasketModel {
    /**
     * Identifiant du produit dans le panier
     * @var number
     */
    public id: number;

    /**
     * Prix unitaire du produit
     * @var number
     */
    public priceHT: number;

    /**
     * Quantité commandée
     * @var number
     */
    public quantity: number;

    /**
     * Quantité unitaire
     * @var string
     */
    public servingSize?: string;

    public constructor() {}

    public deserialize(basket: any): BasketModel {
        Object.assign(this, basket);
        return this;
    }
}