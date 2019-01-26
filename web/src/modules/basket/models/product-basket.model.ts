import { ProductService } from '../../../services/product.service';
import { StringToNumberHelper } from '../../../helpers/string-to-number.helper';
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

    public _input(col: JQuery, product: any): JQuery {
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

        group.appendTo(col);

        return col;

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
        return parseInt(this.product.pricing[0].quantity);
    }

    public deserialize(basket: any): ProductBasketModel {
        Object.assign(this, basket);
        return this;
    }
}