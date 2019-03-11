
/**
 * @name BasketService
 * @desc Service de gestion du panier de commande
 * @author IDea Factory - Déc. 2018
 * @package services
 * @version 1.0.0
 */
import { BasketModel } from './../modules/basket/models/basket.model';
import { ProductBasketModel } from '../modules/basket/models/product-basket.model';
import { resolve } from 'path';

export class BasketService {
    /**
     * Tableau des produits du panier courant
     * @var Array<BasketModel>
     */
    private basket: Array<ProductBasketModel>;
    private basketModel: BasketModel = new BasketModel();

    /**
     * Produit supprimé
     */
    private product: ProductBasketModel;

    public constructor(){
        this.basket = new Array<ProductBasketModel>();
    }

    public getBasket(): BasketModel {
        return this.basketModel;
    }
    
    public remove(): Promise<boolean> {
        return new Promise((resolve) => {
            this.basketModel = null;
            this.product = null;
            localStorage.removeItem('eshop-basket');
            resolve(true);
        });
    }

    /**
     * Promesse de panier local
     */
    public localBasket(): Promise<Array<ProductBasketModel>> {
        return new Promise((resolve) => {
            const eShopBasket = JSON.parse(localStorage.getItem('eshop-basket'));
            const panier: Array<ProductBasketModel> = new Array<ProductBasketModel>();
            if (eShopBasket) {
                if (eShopBasket.hasOwnProperty('basket')) {
                    const basket: Array<ProductBasketModel> = eShopBasket.basket;
                    // Instancie l'objet Basket
                    this.basketModel
                        .setCarrier((eShopBasket.hasOwnProperty('carrier') && eShopBasket.carrier !== null) ? eShopBasket.carrier : null)
                        .setDeliveryType((eShopBasket.hasOwnProperty('carryingType') && eShopBasket.carryingType !== null) ? eShopBasket.carryingType : null)
                        .setCharge((eShopBasket.hasOwnProperty('carryingCharge') && eShopBasket.carryingCharge !== null) ? eShopBasket.carryingCharge : null)
                        .setBasket(basket);

                    for (let element of basket) {
                        const product = new ProductBasketModel();
                        panier.push(product.deserialize(element));
                    };
                } else {
                    // Nettoyage des anciens paniers
                    localStorage.removeItem('eshop-basket');
                }
            }
            resolve(panier);
        });
    }

    /**
     * Ajoute ou met à jour un produit dans le panier courant
     * @return Promise<Array<BasketModel>>
     */
    public addProduct(product: ProductBasketModel): Promise<Array<ProductBasketModel>> {
        console.log('Ajoute un produit au panier');
        return new Promise((resolve) => {
            this.localBasket().then((basket: Array<ProductBasketModel>) => {
                let panier: Array<ProductBasketModel> = basket;
                if (panier.length) {
                    const index: number = panier.findIndex((obj) => { 
                            return (obj.id == product.id &&
                            obj.servingSize == product.servingSize)

                    });
                    if (index !== -1) {
                        const updateProduct: ProductBasketModel = panier[index];
                        updateProduct.quantity += product.quantity;
                        panier[index] = updateProduct;
                    } else {
                        panier.push(product);
                    }
                } else {
                    panier.push(product);
                }
                // Met à jour le stockage local
                const obj: any = {basket: panier};
                //localStorage.setItem('eshop-basket', JSON.stringify(obj));
                this._persist(panier, 'basket');
                resolve(panier);
            });
        });
    }

    public addDeliveryDatas(deliveryDatas: any) {
        this._persist(deliveryDatas);
    }
    
    public get(): ProductBasketModel {
        return this.product;
    }

    public removeProduct(productId: string): Promise<boolean> {
        console.log('Suppression d\'un produit du panier');
        const productParts: Array<string> = productId.split('_');
        if (productParts[1] === 'null') {
            productParts[1] = null;
        }
        return new Promise((resolve) => {
            this.localBasket().then((panier) => {
                const index: number = panier.findIndex((obj) => { 
                    return (
                        obj.id == parseInt(productParts[0]) &&
                        obj.servingSize == productParts[1]
                    )
                });
                console.log('Elimine la ligne : ' + index);
                if (index !== -1) {
                    this.product = panier[index];
                    panier.splice(index, 1);
                    const obj: any = {basket: panier};
                    //localStorage.setItem('eshop-basket', JSON.stringify(obj));
                    this._persist(panier, 'basket');
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    public updateProduct(productId: string, newQty: number): Promise<ProductBasketModel> {
        return new Promise((resolve) => {
            console.log('Suppression d\'un produit du panier');
            const productParts: Array<string> = productId.split('_');
            if (productParts[1] === 'null') {
                productParts[1] = null;
            }
            
            this.localBasket().then((panier) => {
                const index: number = panier.findIndex((obj) => { 
                    return (
                        obj.id == parseInt(productParts[0]) &&
                        obj.servingSize == productParts[1]
                    )
                });
                console.log('Met à jour la ligne : ' + index);
                if (index !== -1) {
                    this.product = panier[index];
                    this.product.quantity = newQty;
                    panier[index] = this.product;
                    const obj: any = {basket: panier};
                    //localStorage.setItem('eshop-basket', JSON.stringify(obj));
                    this._persist(panier, 'basket');
                    resolve(this.product);
                } else {
                    resolve(null);
                }
            });
        });
    }

    private _persist(obj: any, key: string = null): void {
        let eShop: any = JSON.parse(localStorage.getItem('eshop-basket'));
        if (eShop === null) {
            eShop = {};
        }
        if (key !== null) {
            eShop[key] = obj;
        } else {
            eShop.carrier = obj.carrier;
            eShop.carryingType = obj.carryingType;
            eShop.carryingCharge = obj.carryingCharge;
        }
        
        localStorage.setItem('eshop-basket', JSON.stringify(eShop));
    }
}