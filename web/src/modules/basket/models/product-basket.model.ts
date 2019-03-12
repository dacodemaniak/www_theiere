import { Constants } from './../../../shared/constants';
import { ProductService } from '../../../services/product.service';
import { StringToNumberHelper } from '../../../helpers/string-to-number.helper';

import * as $ from 'jquery';

/**
 * @name BasketModel
 * @desc Définition d'un élément du panier
 * @author IDea Factory - Déc. 2018
 * @package modules/basket/models
 * @version 1.0.0
 */
export class ProductBasketModel {
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
     * Taux de TVA pour le produit courant
     */
    public vat: number;

    /**
     * Prix TTC du produit
     */
    public priceTTC: number;

    /**
     * Quantité unitaire
     * @var string
     */
    public servingSize?: string;

    /**
     * Instance du produit issu du service distant
     */
    public product: any;

    /**
     * Instance de ProductService pour récupérer le produit distant
     */
    private productService: ProductService;

    public constructor() {
        this.productService = new ProductService();
    }

    public getFullTaxTotal(): number {
        const quantity: number = this.quantity;
        const fullTaxPrice: number = this._getFullTaxPrice();
        let total: number = 0;

        return quantity * fullTaxPrice;
    }

    public getFullLoad(): number {
        const quantity: number = this.quantity;
        if (this.servingSize !== null) {
            return parseInt(this.servingSize) * quantity;
        }

        return this._getServingSize() * quantity;
    }

    public getCardItem(): Promise<JQuery> {
        return new Promise((resolve) => {
            const product: any = this.product;

            this.vat = product.vat;
            if (this.vat === 0.05) {
                    this.vat = 0.055;
            }

            this.priceTTC = (this.priceHT * (1 + this.vat)) * this.quantity;

            const unitFullTaxPrice: number = this.priceHT * (1 + product.vat);

            const _card: JQuery = $('<div>');
            _card
                .addClass('basket-card')
                .addClass('col-12')
                .attr('data-rel', this.id + '_' + this.servingSize)
                .attr('data-pricing', unitFullTaxPrice.toFixed(2))
                .attr('id', this.id + '_' + this.servingSize);
            
            const _cardHeader: JQuery = $('<div>');
            _cardHeader
                .addClass('basket-card-header');
            
            const icon: JQuery = $('<i>');
                icon
                .addClass('icon-cross')
                .addClass('remove-product')
                .attr('data-rel', this.id + '_' + this.servingSize);
            icon.appendTo(_cardHeader);

            _cardHeader.appendTo(_card);

            const _cardBody: JQuery = $('<div>');
            _cardBody
                .addClass('basket-card-body')
                .addClass('row');

            const _productDetail: JQuery = $('<div>');
            _productDetail
                .addClass('col-xl-7')
                .addClass('col-lg-7')
                .addClass('col-md-7')
                .addClass('col-sm-12')
                .addClass('col-12');
            const _productTitle: JQuery = $('<h3>');
            _productTitle.html(product.title.fr)
            
            _productTitle.appendTo(_productDetail);

            // Colonne pour le type de service
            const _productServingSize: JQuery = $('<div>');
            _productServingSize
                .addClass('col-6')
                .addClass('product-serving-size')
                .html(this.servingSize)
                .appendTo(_productDetail);

            const _productInfo: JQuery = $('<blockquote>');
            const _content: string = '<p class="product-detail">' + product.abstract.fr + '</p>' +
                '<strong class="product-unit-price">Prix : ' + StringToNumberHelper.toCurrency(unitFullTaxPrice.toString()) + '</strong></>'
            
            _productInfo.html(_content);
            _productInfo.appendTo(_productDetail);

            _productDetail.appendTo(_cardBody);
            
            // Champ pour l'incrémentation / décrémentation des quantités
            const _productUpdate: JQuery = $('<div>');
            _productUpdate
                .addClass('basket-product-update')
                .addClass('col-xl-5')
                .addClass('col-lg-5')
                .addClass('col-md-5')
                .addClass('col-sm-12')
                .addClass('col-12')
                .attr('data-id', this.id);

            this._input(product).appendTo(_productUpdate);

            // Colonnne pour le prix total pour ce produit
            const total: number = this.priceHT * this.quantity;
            const _productTotal: JQuery = $('<div>');
            _productTotal
                .addClass('product-total')
                .html(StringToNumberHelper.toCurrency(this.priceTTC.toString()))
                .appendTo(_productUpdate);


            _productUpdate.appendTo(_cardBody);

            _cardBody.appendTo(_card);

            resolve(_card);
            
        });
    }Met à jour le panier pour le produit

    public getTableRow(): Promise<JQuery> {
        return new Promise((resolve) => {
            const _tr: JQuery = $('<tr>');
            _tr.attr('id', this.id + '_' + this.servingSize);

            const _productTD: JQuery = $('<td>');
            _productTD.attr('data-rel', this.id);
    
            const product: any = this.product;

            this.vat = product.vat;
            if (this.vat === 0.05) {
                    this.vat = 0.055;
            }

            this.priceTTC = (this.priceHT * (1 + this.vat)) * this.quantity;
            console.log('Prix TTC : ' + this.priceTTC);

            let unitFullTaxPrice: number = this.priceHT * (1 + this.vat);

            _productTD.html(product.title.fr);
            _productTD.appendTo(_tr);
    
            const _servingTD: JQuery = $('<td>');
            _servingTD.html(this.servingSize);
            _servingTD.appendTo(_tr);
    

            const _quantityTD: JQuery = this._input($('<td>'), product);
            _quantityTD.appendTo(_tr);
    
            const _priceTD: JQuery = $('<td>');
            _priceTD.html(StringToNumberHelper.toCurrency(unitFullTaxPrice.toString()));
            _priceTD.appendTo(_tr);
    
            const _totalTD: JQuery = $('<td>');
            const total: number = this.priceHT * this.quantity;
            _totalTD.html(StringToNumberHelper.toCurrency(this.priceTTC.toString()));
            _totalTD.appendTo(_tr);
    
            const _removeTD: JQuery = this._removeElement($('<td>'));
            _removeTD.appendTo(_tr);
    
            resolve(_tr);
        });
    }

    private _removeElement(col: JQuery): JQuery {
        const icon: JQuery = $('<i>');
        icon
            .addClass('icon-cross')
            .addClass('remove-product')
            .attr('data-rel', this.id + '_' + this.servingSize);
        icon.appendTo(col);

        return col;
    }

    public _input(product: any): JQuery {
        const group: JQuery = $('<div>');
        group
            .addClass('input-group')
            .addClass('mb-3');
        
        const prepend: JQuery = $('<div>');
        prepend
            .addClass('input-group-prepend');
        
        const downButton: JQuery = $('<button>');
        downButton
            .addClass('btn')
            .addClass('btn-outline-secondary')
            .addClass('decrease')
            .attr('type', 'button')
            .html('-')
            .attr('data-rel', 'input-quantity-' + this.id);
        downButton.appendTo(prepend);

        prepend.appendTo(group);

        const input: JQuery = $('<input>');
        input
            .addClass('form-control')
            .attr('id', 'input-quantity-' + this.id)
            .attr('type', 'number')
            .attr('min', 1)
            .attr('max', this._getMax(product))
            .attr('readonly', 'readonly')
            .val(this.quantity);
        input.appendTo(group);

        const append: JQuery = $('<div>');
        append
            .addClass('input-group-append');

        const upButton: JQuery = $('<button>');
        upButton
            .addClass('btn')
            .addClass('btn-outline-secondary')
            .addClass('increase')
            .attr('type', 'button')
            .html('+')
            .attr('data-rel', 'input-quantity-' + this.id);
        upButton.appendTo(append);

        append.appendTo(group);

        return group;

    }

    private _getMax(product: any): number {
        const pricing: Array<any> = product.pricing;

        if (pricing.length === 1) {
            const stock: number = pricing[0].stock;
            const thresold: number = pricing[0].thresold;
            const maxPerOrder: number = pricing[0].maxPerOrder;

            if ((stock - thresold) < maxPerOrder) {
                return stock - thresold;
            }
            return maxPerOrder;
        } else {
            const index: number = pricing.findIndex((obj: any) => { return obj.quantity == this.servingSize});
            const price: any = pricing[index];

            const stock: number = price.stock;
            const thresold: number = price.thresold;
            const maxPerOrder: number = price.maxPerOrder;

            if ((stock - thresold) < maxPerOrder) {
                return stock - thresold;
            }
            return maxPerOrder;
        }
    }

    private _getFullTaxPrice(): number {
        if (this.servingSize === null) {
            // Le prix total est le prix de la seule ligne de prix
            return this.product.pricing[0].ttc;
        }

        // Chercher le prix ttc en fonction de la quantité servie
        const pricing: any[] = this.product.pricing;
        const index: number = pricing.findIndex((obj) => { return obj.quantity == this.servingSize});
        return pricing[index].ttc;
    }

    private _getServingSize(): number {
        
        // Le prix total est le prix de la seule ligne de prix
        if (!isNaN(parseInt(this.product.pricing[0].quantity))) {
            return parseInt(this.product.pricing[0].quantity);
        }

        return Constants.averageWeight;
    }

    public deserialize(basket: any): ProductBasketModel {
        Object.assign(this, basket);
        return this;
    }
}