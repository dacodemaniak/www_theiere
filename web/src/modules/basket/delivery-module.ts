import { RouterModule } from './../router/router.module';
import { BasketModel } from "./models/basket.model";
import { UserService } from "../../services/user.service";
import { StepComponent } from "./step-component";
import { BasketService } from "../../services/basket.service";
import { Constants } from "../../shared/constants";
import { ToastModule } from "../toast/toast.module";

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
    private ids: Map<string, string> = new Map<string, string>();
    private fields: Array<JQuery> = new Array<JQuery>();
    private button: JQuery;

    public constructor() {
        this.button = $('#manage-address');

        this.userService = new UserService();

        this.ids
            .set('name', 'name')
            .set('address', 'address')
            .set('zipcode', 'zipcode')
            .set('city', 'city')
            .set('country', 'country');
        this.userService.hasUser().then((has) => {
            this._init().then((panier) => {
                this.basket = panier;
    
                // Instancie le gestionnaire de progression
                this.stepComponent = new StepComponent(this.userService, this.basket);
                this.stepComponent.markAsComplete('basketStep');
                // Initialise la liste des Adresses de livraison
                this.deliveryAddresses = this.userService.getUser().getDeliveryAddresses();
    
                // Passe les données au formulaire
                this._setForm();

                // Définit les listeners
                this._setListeners();
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

    private _setForm(): void {
        if (this.deliveryAddresses.size > 1) {
            // Créer la liste des adresses de livraison
            
        }
            

        // Juste alimenter le formulaire en parcourant le Map
        const delivery: any = this.deliveryAddresses.get('Principale');
            
        this.ids.forEach((rel, id) => {
            let field: JQuery = $('#' + id + '-content');
    
            if (!field.attr('readonly')) {
                field.val(delivery[rel]);
            }

            this.fields.push(field);
        });
        this.button
            .removeAttr('disabled')
            .html('Commander >>');
    }

    private _setListeners(): void {
        $('#btn-add-address').on(
            'click',
            (event: any): void => this._addForm(event)
        );

        $('#form-selected-address').on(
            'keyup',
            (event: any): void => this._manageForm(event)
        ).on(
            'submit',
            (event: any): void => this._submit(event)
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
            console.info('Passer à l\'étape suivante avec l\'adresse principale');
            router.changeLocation('/checkout/Principale');
        }
    }
}