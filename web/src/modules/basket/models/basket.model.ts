import { ProductService } from './../../../services/product.service';
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

    private productService: ProductService;

    public constructor() {
        this.productService = new ProductService();
    }

    public getTableRow(): Promise<JQuery> {
        return new Promise((resolve) => {
            const _tr: JQuery = $('<tr>');

            const _productTD: JQuery = $('<td>');
            _productTD.attr('data-rel', this.id);
    
            this.productService.getProduct(this.id).then((product) => {
                _productTD.html(product.product.title.fr);
                _productTD.appendTo(_tr);
    
                const _servingTD: JQuery = $('<td>');
                _servingTD.html(this.servingSize);
                _servingTD.appendTo(_tr);
    
                const _quantityTD: JQuery = $('<td>');
                _quantityTD.html(this.quantity.toString());
                _quantityTD.appendTo(_tr);
    
                const _priceTD: JQuery = $('<td>');
                _priceTD.html(this.priceHT.toString());
                _priceTD.appendTo(_tr);
    
                const _totalTD: JQuery = $('<td>');
                const total: number = this.priceHT * this.quantity;
                _totalTD.html(total.toString());
                _totalTD.appendTo(_tr);
    
                const _removeTD: JQuery = $('<td>');
                _removeTD.html('&nbsp;');
                _removeTD.appendTo(_tr);
    
                resolve(_tr);
    
            });
        });



        
    }

    public deserialize(basket: any): BasketModel {
        Object.assign(this, basket);
        return this;
    }
}