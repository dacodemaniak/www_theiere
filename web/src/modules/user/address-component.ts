import { UserModel } from './models/user.model';
import { EmailHelper } from '../../helpers/email.helper';
import { ToastModule } from '../toast/toast.module';
import { Constants } from '../../shared/constants';
/**
 * @name AddressComponent
 * @desc Composant pour la gestion de l'adresse de facturation
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package user/components
 * @version 1.0.0
 */
export class AddressComponent {
    private user: UserModel;

    private ids: Map<string, string> = new Map<string, string>();
    private fields: Array<JQuery> = new Array<JQuery>();

    private form: JQuery = $('#address-form');

    private button: JQuery = $('#manage-address');

    public constructor(user: UserModel) {
        this.user = user;

        this.ids
            .set('address', 'address')
            .set('zipcode', 'zipcode')
            .set('city', 'city')
            .set('country', 'country')
            .set('billing', 'asDelivery');

        // Détermine le libellé du bouton
        if (!this.user.hasAddresses()) {
            this.button
                .addClass('btn-add')
                .html('Ajouter');
        } else {
            this.button
                .addClass('btn-upd')
                .html('Mettre à jour');
            // Masquer le switch
            const toggle: JQuery = $('[for="billing-content"]');
            toggle.hide();
        }

        this._load();
    }

    private _load(): void {
        this.ids.forEach((rel, id) => {
            let field: JQuery = $('#' + id + '-content');
            if (this.user.hasAddresses()) {
                this.button.removeAttr('disabled');
                console.info("Utilisateur avec adresses");
                const billingAddress: any = this.user.getBillingAddressContent();

                if (!field.attr('readonly')) {
                    field.val(billingAddress[rel]);
                }
            } else {
                console.warn('Aucune adresse définie');
            }

            this.fields.push(field);
        });

        // Définit les gestionnaires d'événements
        this.form.on(
            'keyup',
            (event: any): void => this._manageForm(event)
        ).on(
            'submit',
            (event: any): void => this._submit(event)
        );
    }

    private _manageForm(event: any): void {
        for (const field of this.fields) {
            if (field.val() !== '') {
                if (field.attr('id') === 'zipcode-content') {
                    if (field.val().toString().length < 5) {
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

        let formContent: any = {};

        for (let field of this.fields) {
            let propertyName: string = field.data('rel');
            formContent[propertyName] = field.val();
        }

        console.log('Contenu : ' + JSON.stringify(formContent));

        const headers: any = {
            'X-Auth-Token': this.user.getToken()
        };

        // Appel à l'API pour la création du compte
        $.ajax({
            headers: headers,
            url: Constants.apiRoot + 'account/address/billing',
            method: this.button.hasClass('btn-add') ? 'post' : 'put',
            dataType: 'json',
            data: formContent,
            success: (datas: any) => {
                console.log(JSON.stringify(datas));
                const toast: ToastModule = new ToastModule({
                    title: 'Vos informations ont été mises à jour',
                    message: 'Votre adresse de facturation a été mise à jour',
                    type: 'success'
                });
                toast.show();

                // Mettre à jour l'utilisateur
                this.user.setAddresses(datas);

                if (this.button.hasClass('btn-add')) {
                    // Changer le type du bouton
                    this.button.html('Mettre à jour');
                    this.button
                        .removeClass('btn-add')
                        .addClass('btn-upd');
                    const toggle: JQuery = $('[for="billing-content"]');
                    toggle.hide();
                }
            },
            error: (xhr: JQueryXHR, error) => {
                console.log(JSON.stringify(xhr));
                const toast: ToastModule = new ToastModule({
                    title: 'Une erreur est survenue !',
                    message: xhr.responseJSON,
                    duration: 4,
                    position: 'middle-center',
                    type: 'warning'
                });
                toast.show();
            } 
        });        
    }
}