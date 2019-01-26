import { StringToNumberHelper } from './../../helpers/string-to-number.helper';
import { RouterModule } from './../router/router.module';
import { BasketModel } from "./models/basket.model";
import { UserService } from "../../services/user.service";
import { StepComponent } from "./step-component";
import { BasketService } from "../../services/basket.service";
import { SiteService } from "./../../services/site.service";
import { Constants } from "../../shared/constants";
import { ToastModule } from "../toast/toast.module";
import { CarryingModel } from "./models/carrying.model";
/**
 * @name DeliveryModule
 * @desc Sélection de l'adresse de livraison du panier
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package modules/basket
 * @version 1.0.0
 */
export class DeliveryModule {
    private basket: Array<BasketModel>;
    private userService: UserService;
    private stepComponent: StepComponent;
    private deliveryAddresses: Map<string, any>;
    private carriers: Map<string, CarryingModel> = new Map<string, CarryingModel>();
    private ids: Map<string, string> = new Map<string, string>();
    private fields: Array<JQuery> = new Array<JQuery>();
    private button: JQuery;

    private fullTaxBasket: number = 0;
    private fullLoad: number = 0;
    private loadCharges: Map<string, any> = new Map<string, any>();

    public constructor() {
        this.button = $('#manage-address');

        this.userService = new UserService();

        const siteService: SiteService = new SiteService();

        this.ids
            .set('name', 'name')
            .set('address', 'address')
            .set('zipcode', 'zipcode')
            .set('city', 'city')
            .set('country', 'country');
        siteService.getSite().then((siteDatas) => {
            // Récupère la liste des tarifs d'expédition
            siteDatas.carrying.forEach((carrier: any) => {
                const port: CarryingModel = new CarryingModel();
                port.deserialize(carrier);
                this.carriers.set(port.getName(), port);
            });

            this.userService.hasUser().then((has) => {
                this._init().then((panier) => {
                    this.basket = panier;
                    
                    // Calcule les totaux : prix TTC et Poids totaux
                    this._getBasketTotals();
    
                    
                    // Instancie le gestionnaire de progression
                    this.stepComponent = new StepComponent(this.userService, this.basket);
                    this.stepComponent.markAsComplete('basketStep');
                    // Initialise la liste des Adresses de livraison
                    this.deliveryAddresses = this.userService.getUser().getDeliveryAddresses();
                    
                    if (this.deliveryAddresses.size === 0) {
                        $('#manage-address').attr('disabled', 'disabled');
                    } else {
                        if (this.deliveryAddresses.size > 1) {
                            // Créer la liste des adresses de livraison
                            this._addOptions();
                        }                    
                    }
                    
                    // Choix du mode de livraison
                    this._carryingModePicker();

                    // Passe les données au formulaire
                    this._setForm();
    
                    // Définit les listeners
                    this._setListeners();
                });
            });
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

    private _setForm(address: string = 'Principale'): void {

        // Juste alimenter le formulaire en parcourant le Map
        const delivery: any = this.deliveryAddresses.get(address);

        
            
        this.ids.forEach((rel, id) => {
            let field: JQuery = $('#' + id + '-content');
    
            if (!field.attr('readonly')) {
                field.val(delivery[rel]);
            }

            this.fields.push(field);
        });
        // Le bouton reste inactif tant que le mode de livraison n'a pas été sélectionné
        this.button
            //.removeAttr('disabled')
            .html('Commander >>');
    }

    private _setListeners(): void {
        $('#btn-add-address').on(
            'click',
            (event: any): void => this._addForm(event)
        );

        // Sélection dans la liste des adresses
        $('#address-selector-content').on(
            'change',
            (event: any): void => this._loadAddress(event)
        );

        $('#form-selected-address').on(
            'keyup',
            (event: any): void => this._manageForm(event)
        ).on(
            'submit',
            (event: any): void => this._submit(event)
        );

        // Gestionnaire du choix du mode de livraison
        $('#picker').on(
            'click',
            '.selector',
            (event: any): any => this._selectCarryingMode(event) 
        );
    }

    private _addForm(event: any): void {
        this.ids.forEach((rel, id) => {
            let field: JQuery = $('#' + id + '-content');
    
            if (!field.attr('readonly')) {
                field.val('');
            }
        });
        this.button
            .attr('disabled', 'disabled')
            .addClass('btn-add');
    }

    private _manageForm(event: any): void {
        for (const field of this.fields) {
            if (field.val() !== '') {
                if (field.attr('id') === 'zipcode-content') {
                    if (field.val().toString().length < 5) {
                        this.button.attr('disabled', 'disabled');
                        return;
                    }
                } else if (field.attr('id') === 'name-content') {
                    if (field.val().toString() === 'Principale') {
                        this.button.attr('disabled', 'disabled');
                        return;                        
                    }
                }
            } else {
                this.button.attr('disabled', 'disabled');
                return;               
            }
        }
        this.button.removeAttr('disabled');        
    }

    private _submit(event: any): void {
        event.preventDefault();
        
        const router: RouterModule = new RouterModule();

        if (this.button.hasClass('btn-add')) {
            console.info('Ajouter une adresse et passer à l\'étape suivante');
            let formContent: any = {};

            for (let field of this.fields) {
                let propertyName: string = field.data('rel');
                formContent[propertyName] = field.val();
            }
    
            console.log('Contenu : ' + JSON.stringify(formContent));
            
            
            
            const headers: any = {
                'X-Auth-Token': this.userService.getUser().getToken()
            };

            $.ajax({
                headers: headers,
                url: Constants.apiRoot + 'account/address/delivery',
                method: 'post',
                dataType: 'json',
                data: formContent,
                success: (datas) => {
                    console.log('Adresse : ' + JSON.stringify(datas));
                    router.changeLocation('/checkout/' + datas.name);
                },
                error: (xhr, error) => {
                    const toast: ToastModule = new ToastModule({
                        title: 'Une erreur est survenue',
                        message: xhr.responseJSON(),
                        type: 'danger',
                        position: 'middle-center'
                    });
                    toast.show();
                }
            });
        } else {
            console.info('Passer à l\'étape suivante avec l\'adresse sélectionnée');
            let addressSlug: string = 'Principale';

            const addressSelector: JQuery = $('#address-selector-content');
            if (!addressSelector.parent('div').hasClass('hidden')) {
                addressSlug = addressSelector.find(':selected').val().toString();
            }

            // Ajouter les informations :
            //  - Transporteur
            //  - Choix du mode de livraison
            //  - Montant du port
            

            router.changeLocation('/checkout/' + addressSlug);
        }
    }

    private _addOptions(): void {
        const selector: JQuery = $('#address-selector-content');
        selector.children('option').removeAttr('selected');
        let indice: number = 0;
        this.deliveryAddresses.forEach((address, title) => {
            const option: JQuery = $('<option>');
            option
                .attr('value', title)
                .html(title);
            if (indice === 0) {
                option.attr('selected', 'selected');
            }
            option.appendTo(selector);
            indice++;
        });
        // Montrer la liste
        $('#address-selector-group').removeClass('hidden');
    }

    private _loadAddress(event: any): void {
        const selectedAddress: string = $(event.target).find(':selected').val().toString();
        this._setForm(selectedAddress);
    }

    private _getBasketTotals(): void {
        for (let basket of this.basket) {
            this.fullTaxBasket = this.fullTaxBasket + basket.getFullTaxTotal();
            this.fullLoad += basket.getFullLoad();
        }

        // Affiche les totaux
        const fullTaxTotal: JQuery = $('.full-tax-total');
        const fullLoad: JQuery = $('.full-load');
        const amount: JQuery = $('.amount');

        this.fullLoad = this.fullLoad / 1000;
        fullTaxTotal
            .html(StringToNumberHelper.toCurrency(this.fullTaxBasket.toString()))
            .attr('data-price', this.fullTaxBasket);
        amount.html(StringToNumberHelper.toCurrency(this.fullTaxBasket.toString()));
        fullLoad.html((this.fullLoad).toString() + " Kg");

        // Déterminer les coûts supplémentaires pour les modes de livraison
        this._evaluateCarryingCharge();
        
    }

    private _evaluateCarryingCharge(): void {
        this.carriers.forEach((carrier, name) => {
            const tarifs = carrier.getPrices();
            console.log("Tarifs : " + JSON.stringify(tarifs));
            let found: boolean = false;
            tarifs.forEach((tarif) => {
                if (!found) {
                    if (this.fullLoad <= tarif.weight) {
                        let load: any = {};
                        const tarifGrid: any = tarif;
                        if (carrier.notOnlyPicking()) {
                            carrier.getModes().forEach((mode) => {
                                let loadTaxFree: number = tarifGrid[mode.key];
                                let loadFullTax: number = loadTaxFree * 1.2;
                                load[mode.key] = loadFullTax;
                            });
                        } else {
                            load.picking = tarif.picking * 1.2;
                        }
                        this.loadCharges.set(carrier.getSlug(), load);
                        found = true;
                    }
                }
            });
        });
    }

    private _carryingModePicker() {
        const placeholder: JQuery = $('#picker');

        // Boucle sur les modes de livraison
        this.carriers.forEach((carrier, name) => {
            const line: JQuery = $('<li>');
            line.attr('data-rel', carrier.getSlug());

            const logo: JQuery = $('<img>');
            console.log('Logo : ' + carrier.getLogo());
            logo
                .attr('src', '/images/' + carrier.getLogo())
                .attr('height', 50)
                .attr('width', 150)
                .addClass('img-responsive');
            logo.appendTo(line);
            // Si unsigned, signed ajouter une sous-liste
            if (carrier.notOnlyPicking()) {
                const sublist: JQuery = $('<ul>');
                sublist
                    .addClass('list-unstyled')
                    .addClass('subpicker')
                    .addClass('hidden');
                carrier.getModes().forEach((mode: any) => {
                    const subline: JQuery = $('<li>');
                    const charge: number = this.loadCharges.get(carrier.getSlug())[mode.key];
                    subline.attr('data-price', this.loadCharges.get(carrier.getSlug())[mode.key].toFixed(2));
                    subline.html(mode.value + ' : + <span class="charge">' + StringToNumberHelper.toCurrency(charge.toString()) + '</span>')
                        .attr('data-rel', mode.key)
                        .addClass('selector');
                    subline.appendTo(sublist);
                });
                sublist.appendTo(line);
            } else {
                const sublist: JQuery = $('<ul>');
                sublist
                    .addClass('list-unstyled')
                    .addClass('subpicker')
                    .addClass('hidden');

                    const subline: JQuery = $('<li>');
                    subline.attr('data-price', this.loadCharges.get(carrier.getSlug())["picking"].toFixed(2));
                    const charge = this.loadCharges.get(carrier.getSlug())["picking"];
                    subline.html('Point retrait : + <span class="charge">' + StringToNumberHelper.toCurrency(charge.toString()) + '</span>')
                        .attr('data-rel', 'picking')
                        .addClass('selector');
                    subline.appendTo(sublist);

                sublist.appendTo(line);
            }
            line.appendTo(placeholder);
        });
    }

    private _selectCarryingMode(event: any): void {
        const choice: JQuery = $(event.target);
        const amount: JQuery = $('.amount');

        // Enlève la classe "active" sur toutes les lignes "selector"
        $('#picker .subpicker li.selector').removeClass('active');

        // Ajoute la classe active sur l'élément sélectionné
        choice.addClass('active');

        // Récupère le montant des frais de port
        const price: number = parseFloat(choice.attr('data-price'));

        // Recalcule le montant total
        const newTotal: number = this.fullTaxBasket + price;
        amount.html(StringToNumberHelper.toCurrency(newTotal.toString()));

        this.button.removeAttr('disabled');
    }
}