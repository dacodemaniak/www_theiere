import { RouterModule } from './../router/router.module';
import { ProductBasketModel } from "./models/product-basket.model";
import { UserService } from "../../services/user.service";
import { StepComponent } from "./step-component";
import { BasketService } from "../../services/basket.service";
import { Constants } from "../../shared/constants";
import { ToastModule } from "../toast/toast.module";

/**
 * @name CheckoutModule
 * @desc Validation du panier
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package modules/basket
 * @version 1.0.0
 */
export class CheckoutModule {
    private basket: Array<ProductBasketModel>;
    private userService: UserService;
    private stepComponent: StepComponent;
    private deliveryAddressLabel: string;
    private billingAddress: any;
    private deliveryAddress: any;
    private totalBasket: string;
    private poidsTotalGr: number;

    private button: JQuery;

    public constructor(deliveryAddress: string) {

        this.deliveryAddressLabel = deliveryAddress;

        this.userService = new UserService();

        this.userService.hasUser().then((has) => {
            this._init().then((panier) => {
                this.basket = panier;
                
                // Calcule le total à payer
                this.totalBasket = this._totalize() + '&euro;';
                this.poidsTotalGr = this._poids();
                
                $('#total-basket div').children('span').eq(0).html(this.totalBasket);

                // Instancie le gestionnaire de progression
                this.stepComponent = new StepComponent(this.userService, this.basket);
                this.stepComponent.markAsComplete('signin');
                this.stepComponent.markAsComplete('basket-checkin');
                this.stepComponent.markAsActive('payment');
            });

            // Récupérer l'adresse de facturation
            this.billingAddress = this.userService.getUser().getBillingAddressContent();

            // Récupérer l'adresse de livraison
            const deliveryAddresses: Map<string, any> = this.userService.getUser().getDeliveryAddresses();
            this.deliveryAddress = deliveryAddresses.get(this.deliveryAddressLabel);

            // Alimente les adresses de facturation et livraison
            this._hydrateBilling($('#billing-address ul'));
            this._hydrateDelivery($('#delivery-address ul'));

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

    private _hydrateBilling(address: JQuery): void {
        console.log('Facturation : ' + this.billingAddress.address);
        address.children('.address').eq(0).html(this.billingAddress.address);
        address.children('.city').eq(0).html(
            this.billingAddress.zipcode + ' ' + this.billingAddress.city
        );
        address.children('.country').eq(0).html(this.billingAddress.country);
    }

    private _hydrateDelivery(address: JQuery): void {
        address.children('.address').eq(0).html(this.deliveryAddress.address);
        address.children('.city').eq(0).html(
            this.deliveryAddress.zipcode + ' ' + this.deliveryAddress.city
        );
        address.children('.country').eq(0).html(this.deliveryAddress.country);
    }

    private _totalize(): string {
        let total: number = 0;

        for (const product of this.basket) {
            const vat: number = product.product.vat === 0.05 ? 0.055 : product.product.vat;
            total += product.priceHT * (1 + vat);
        }

        return total.toFixed(2);
    }

    private _poids(): number {
        let poids: number = 0;
        for (const product of this.basket) {
            poids += this._getPoids(product);
        }
        return poids;
    }

    private _getPoids(product: ProductBasketModel) {
        let index: number = 0;
        const pricing: Array<any> = product.product.pricing;
        if (pricing.length > 0) {
            index = pricing.findIndex((obj) => { return obj.quantity == product.servingSize});
        }
        const regex = /gr/gi;
        return parseInt(pricing[index].quantity.replace(regex, ''));
    }
}