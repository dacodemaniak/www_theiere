
import { CreditCardHelper } from './../../helpers/credit-card.helper';
import { StringToNumberHelper } from './../../helpers/string-to-number.helper';
import { RouterModule } from './../router/router.module';
import { ProductBasketModel } from "./models/product-basket.model";
import { UserService } from "../../services/user.service";
import { StepComponent } from "./step-component";
import { BasketService } from "../../services/basket.service";
import { Constants } from "../../shared/constants";
import { ToastModule } from "../toast/toast.module";
import { CryptoHelper } from './../../helpers/crypto-helper';

import * as $ from 'jquery';
import * as moment from 'moment';
/**
 * @name CheckoutModule
 * @desc Validation du panier
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package modules/basket
 * @version 1.0.0
 */
export class CheckoutModule {
    private basketService: BasketService;

    private basket: Array<ProductBasketModel>;
    private userService: UserService;
    private stepComponent: StepComponent;
    private deliveryAddressLabel: string;
    private billingAddress: any;
    private deliveryAddress: any;
    

    private fullTaxBasket: number = 0;
    private carryingCharge: number = 0;
    private totalBasket: number = 0;

    private button: JQuery = $('#confirm-payment');
    private buttonEnableState: boolean = false;

    private cardNumber: JQuery = $('#cardnumber-content');
    
    private formContent: Array<JQuery> = new Array<JQuery>();

    private vads: any = {};

    public constructor(deliveryAddress: string) {

        this.deliveryAddressLabel = deliveryAddress;

        this.userService = new UserService();

        // Définit les éléments du formulaire
        this.formContent.push($('#owner-content'));
        this.formContent.push($('#cardnumber-content'));
        this.formContent.push($('#expirationmonth-content'));
        this.formContent.push($('#expirationyear-content'));
        this.formContent.push($('#cvv-content'));

        this.userService.hasUser().then((has) => {
            this._init().then((panier) => {
                this.basket = panier;
                
                // Calcule les totaux : prix TTC et Poids totaux
                this._getBasketTotals();
                $('#total-basket .amount').html(StringToNumberHelper.toCurrency(this.fullTaxBasket.toString()));

                // Récupère les frais de port associés
                this.carryingCharge = this.basketService.getBasket().getCharge();
                $('#total-basket .carrying-charge').html(
                    StringToNumberHelper.toCurrency(this.carryingCharge.toString())
                );

                // Total à payer
                this.totalBasket = this.fullTaxBasket + this.carryingCharge;
                $('#total-basket .full-amount').html(
                    StringToNumberHelper.toCurrency(this.totalBasket.toString())
                ).attr('data-price', this.totalBasket);

                // Années valides pour la date d'expiration de la carte
                this._populateCardYears();

                // Instancie le gestionnaire de progression
                this.stepComponent = new StepComponent(this.userService, this.basket);
                this.stepComponent.markAsComplete('signin');
                this.stepComponent.markAsComplete('basket-checkin');
                this.stepComponent.markAsActive('payment');

                // Définit les valeurs du formulaire de paiement en ligne
                const transaction: string = this._getUTCDate().toString();
                const transId: string = this._generateId();

                const ccForm: JQuery = $('#credit-card-form');
                ccForm.attr('action', Constants.paymentUrl);

                this.vads.vads_site_id = Constants.merchantId;
                this.vads.vads_ctx_mode = Constants.ctxMode;
                this.vads.vads_trans_date = transaction;
                this.vads.vads_trans_id = transId;
                this.vads.vads_amount = (this.totalBasket * 100).toFixed(0);
                this.vads.vads_currency = 978;
                this.vads.vads_action_mode = 'INTERACTIVE';
                this.vads.vads_page_action = 'PAYMENT';
                this.vads.vads_version = 'V2';
                this.vads.vads_payment_config = 'SINGLE';
                this.vads.vads_capture_delay = 0;
                this.vads.vads_validation_mode = 0;
                this.vads.vads_cust_id = this.userService.getUser().getId();
                this.vads.signature = this._packSignature(this.vads, Constants.merchantKey);

                $('#site-id').val(Constants.merchantId);
                $('#ctx-mode').val(Constants.ctxMode);
                $('#trans-id').val(transId);
                $('#trans-date').val(transaction);
                $('#amount').val(this.vads.vads_amount);
                $('#cust-id').val(this.vads.vads_cust_id);
                $('#signature').val(this.vads.signature);
            });

            // Récupérer l'adresse de facturation
            this.billingAddress = this.userService.getUser().getBillingAddressContent();

            // Récupérer l'adresse de livraison
            const deliveryAddresses: Map<string, any> = this.userService.getUser().getDeliveryAddresses();
            this.deliveryAddress = deliveryAddresses.get(this.deliveryAddressLabel);

            // Alimente les adresses de facturation et livraison
            this._hydrateBilling($('#billing-address ul'));
            this._hydrateDelivery($('#delivery-address ul'));

            // Définit les listeners
            this._setListeners();

        });

    }

    /**
     * Récupère les produits du panier
     */
    private _init(): Promise<Array<ProductBasketModel>> {
        return new Promise((resolve) => {
            this.basketService = new BasketService();
            this.basketService.localBasket().then((panier) => {
                resolve(panier);
            });
        });
    }

    private _setListeners(): void {
        $('#credit-card-form').on(
            'keyup',
            (event: any): void => this._validForm(event)
        );

        $('#check-payment-form').on(
            'submit',
            (event: any): void => this._submit(event)
        );

        $('#credit-card-form').one(
            'submit',
            (event: any): void => {
                this._processCC(event)
            } 
        );

        $('#expirationmonth-content, #expirationyear-content').on(
            'change',
            (event: any): void => this._validForm(event)
        );

        this.cardNumber.on(
            'keyup',
            (event: any): void => this._checkCardNumber(event)
        );
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

    private _validForm(event: any): void {
        const element: JQuery = $(event.target);

        if (this._checkForm()) {
            this.button.removeAttr('disabled');
        } else {
            this.button.attr('disabled', 'disabled');
        }
    }

    private _checkForm(): boolean {
        let buttonEnableState: boolean = true;
        this.formContent.forEach((element: JQuery) => {
            if (element.is('input')) {
                if (element.attr('id') === 'cardnumber-content') {
                    const creditCardValidator: any = CreditCardHelper.validation(element.val().toString());
                    if (creditCardValidator[0].code !== 1000) {
                        buttonEnableState = false;
                    }
                } else {
                    if (element.attr('id') === 'cvv-content') {
                        if (element.val().toString().length < 3) {
                            buttonEnableState = false;
                        }
                    } else {
                        if (element.val() === '') {
                            buttonEnableState = false;
                        }
                    }
                }
            } else {
                if (element.val() === '') {
                    buttonEnableState = false;
                }
            }
        });
        // Tous les contrôles sont passés...
        return buttonEnableState;
    }

    private _checkCardNumber(event: any): void {
        const cardNumber: JQuery = $(event.target);
        const validationState: any = CreditCardHelper.validation(cardNumber.val().toString());

        const alert: JQuery = $('#cardnumber-alert');

        console.log('Trace : ' + validationState[0].code + ' <=> -1000');

        if (validationState[0].code < -1000) {
            
            alert
                .removeClass('hidden')
                .html(validationState[0].message);
        } else if (validationState[0].code === 1001) {
            const logo: JQuery = $('#' + validationState[0].message);
            $('#cards-logo img').removeClass('active');
            logo.addClass('active');
        } else if (validationState[0].code === 1000) {
            const logo: JQuery = $('#' + validationState[0].message);
            $('#cards-logo img').removeClass('active');
            logo.addClass('active');
            
            alert.addClass('hidden');
        }
    }

    private _getBasketTotals(): void {
        for (let basket of this.basket) {
            this.fullTaxBasket = this.fullTaxBasket + basket.getFullTaxTotal();
        }
    }

    /**
     * Alimente la liste des années valides pour la carte
     */
    private _populateCardYears(): void {

        const yearList: JQuery = $('.expiration-date #expirationyear-content');

        console.warn('Années : ' + yearList.attr('data-rel'));

        const today: Date = new Date();
        let currentYear: number = today.getFullYear();

        for(let i: number = 0; i < 5; i++) {
            const option: JQuery = $('<option>');
            option
                .attr('value', currentYear)
                .html(currentYear.toString());
            yearList.append(option);
            currentYear++;
        }
    }

    /**
     * Soumission du formulaire de paiement
     */
    private _submit(event: any): void {
        
        // Quel formulaire a été validé
        const formToSubmit = $(event.target).attr('id');
        let paymentMode: string;

        if (formToSubmit === 'credit-card-form') {
            paymentMode = 'cc';
        } else if (formToSubmit === 'check-payment-form') {
            paymentMode = 'ch';
        }

        // Authentification de la requête
        const header: any = {
            'X-Auth-Token': this.userService.getUser().getToken()
        };

        // Définition des données à transmettre
        const datas: any = {};
        datas.paymentMode = paymentMode;
        datas.amount = $('.full-amount').attr('data-price');
        const amount = parseFloat(datas.amount) * 100;

        // Détermine l'adresse de livraison
        const deliveryAddress = $('#delivery-address ul li.address').html() + 
        $('#delivery-address ul li.city').html();
        datas.deliveryAddress = deliveryAddress;

        // Mode de livraison
        datas.carrier = this.basketService.getBasket().getCarrier();
        datas.carryingType = this.basketService.getBasket().getDeliveryType();
        datas.basket = this.basket;

        // Effectue l'appel à l'API
        if (paymentMode !== 'cc') {
            event.preventDefault();
            $.ajax({
                headers: header,
                url: Constants.apiRoot + 'checkout/process',
                method: 'post',
                dataType: 'json',
                data: datas,
                success: (datas, textStatus, response) => {
                    if (response.status === 200) {
                        const toast: ToastModule = new ToastModule({
                            title: "Votre commande a été envoyée",
                            message: datas,
                            type: 'success',
                            position: 'middle-center',
                            duration: 4
                        });
                        toast.show();

                        // Vider le panier...
                        console.log('Vidage du panier en cours...');
                        this.basketService.remove().then(() => {
                            const userBasketQuantity: JQuery = $('#user-basket span');
                            userBasketQuantity.html('0');
                            console.info('Panier vidé, redirection');
                            const router: RouterModule = new RouterModule();
                            router.changeLocation('/');
                        });
                    }
                },
                error: (xhr, error) => {
                    console.log('Call error : ' + error);
                }
            });
        } else {
            
            $.ajax({
                headers: header,
                url: Constants.apiRoot + 'checkout/process',
                method: 'post',
                dataType: 'html',
                data: this.vads,
                success: () => {
                    alert('Enregistrement de la commande okay');
                },
                error: (xhr, error) => {
                    alert('Erreur de stockage de la commande : ' + error);
                    event.stopPropagation();
                }
            });            
        }

    }

    /**
     * Traitement du paiement par carte bancaire
     * @param event Initiateur de l'événement
     * @return void
     */
    private _processCC(event: any): void {
        event.preventDefault();

        // Authentification de la requête
        const header: any = {
            'X-Auth-Token': this.userService.getUser().getToken()
        };
       // Définition des données à transmettre
       const datas: any = {};
       datas.paymentMode = 'cc';
       datas.amount = $('.full-amount').attr('data-price');

       // Détermine l'adresse de livraison
       const deliveryAddress = $('#delivery-address ul li.address').html() + 
       $('#delivery-address ul li.city').html();
       datas.deliveryAddress = deliveryAddress;

       // Mode de livraison
       datas.carrier = this.basketService.getBasket().getCarrier();
       datas.carryingType = this.basketService.getBasket().getDeliveryType();
       datas.basket = this.basket;
       datas.transId = this.vads.vads_trans_id;
        $.ajax({
            headers: header,
            url: Constants.apiRoot + 'checkout/process',
            method: 'post',
            dataType: 'json',
            data: datas,
            success: () => {
                // Vider le panier avant soumission du formulaire
                this.basketService.remove();
                $(event.target).submit();
            },
            error: (xhr, error) => {
                // TODO Inclure le toast d'erreur de traitement de l'enregistrement
                event.stopPropagation();
            }
        });
    }

    private _getUTCDate(): number {
        const jsDate: string = new Date().toUTCString();
        const now = moment(jsDate);

        return parseInt(now.format('YYYYMMDDHHmmss'));
        
    }

    private _generateId(): string {
        const jsDate: string = new Date().toUTCString();
        const now = moment(jsDate);

        return now.format('ammSS');        
    }
    private _packSignature(datas: any, certificat: string): string {
        const signature = 
            datas.vads_action_mode + '+' + // INTERACTIVE
            datas.vads_amount + '+'  + // 2805
            datas.vads_capture_delay + '+'  + // 0
            datas.vads_ctx_mode + '+'  + // TEST
            datas.vads_currency + '+'  + // 978 (?)
            datas.vads_cust_id + '+' + // Identifiant du client
            datas.vads_page_action + '+'  + // PAYMENT
            datas.vads_payment_config + '+'  + // SINGLE
            datas.vads_site_id + '+'  + // 57890042
            datas.vads_trans_date + '+'  +
            datas.vads_trans_id + '+'  +
            datas.vads_validation_mode + '+'  +
            datas.vads_version + '+'  + 
            certificat;
        // Pour test, gérer la signature en clair
        $('#signature').attr('data-rel', signature);

        //console.info('Signature à encoder : ' + signature);
        return CryptoHelper.SHA(signature);
    }
}