import { ToastModule } from './../toast/toast.module';
import { Constants } from './../../shared/constants';

import * as $ from 'jquery';
import { EmailHelper } from '../../helpers/email.helper';
import { RouterModule } from '../router/router.module';

/**
 * @name SigninModule
 * @desc Gestion du formulaire d'identification d'un utilisateur
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package user
 * @version 1.0.0
 */

export class SigninModule {
    /**
     * Contenu du formulaire
     */
    private formContent: any = {};

    /**
     * Formulaire d'identification
     */
    private form: JQuery = $('#signin');

    private fields: Array<JQuery>;

    /**
     * Bouton Login
     */
    private button: JQuery = $('#signin-btn');

    private fromInstance: string;

    public constructor(from: string) {
        this.fields = new Array<JQuery>();
        this.fields.push($('#civility-content'));
        this.fields.push($('#name-content'));
        this.fields.push($('#forname-content'));
        this.fields.push($('#company-content'));
        this.fields.push($('#phone-content'));
        this.fields.push($('#email-content'));
        this.fields.push($('#original-password-content'));
        this.fields.push($('#confirm-password-content'));

        this.fromInstance = from;

        this._init();
    }

    /**
     * Initialise les gestionnaires d'événements du formulaire d'identification
     */
    private _init(): void {
        this.form.on(
            'keyup',
            (event: any): void => this._manageUserEntries(event)
        );

        $('#civility-content').on(
            'change',
            (event: any): void => this._manageUserEntries(event)
        );

        this.form.on(
            'submit',
            (event: any): void => this._register(event)
        );
    }

    /**
     * Active ou désactive le bouton de login
     */
    private _manageUserEntries(event: any): void {
        for (const field of this.fields) {
            if (field.attr('id') !== 'civility-content') {
                if (field.val() === '') {
                    this.button.attr('disabled', 'disabled');
                    return;
                } else {
                    if (field.attr('id') === 'email-content') {
                        if (!EmailHelper.validate(field.val().toString())) {
                            this.button.attr('disabled', 'disabled');
                            return;
                        }
                    }
                }
            } else {
                const selectedLine = field.find('option:selected');
                if (selectedLine.val() === '') {
                    this.button.attr('disabled', 'disabled');
                    return;
                }
            }
        }

        // Contrôler la validité des mots de passe
        if (!this._checkPassword()) {
            this.button.attr('disabled', 'disabled');
            return;            
        }

        this.button.removeAttr('disabled');
    }

    private _register(event: any): void {
        event.preventDefault();

        let formContent: any = {};

        for (let field of this.fields) {
            if (field.attr('id').substr(0, 7) !== 'confirm') {
                let propertyName: string = field.data('rel');
                if (field.data('content')) {
                    propertyName += '_';
                }
                formContent[propertyName] = field.val();
            }
        }

        console.log('Contenu : ' + JSON.stringify(formContent));

        // Appel à l'API pour la création du compte
        $.ajax({
            url: Constants.apiRoot + 'register',
            method: 'put',
            dataType: 'json',
            data: formContent,
            success: (datas: any) => {
                console.log(JSON.stringify(datas));
                const toast: ToastModule = new ToastModule({
                    title: 'Bienvenue sur le site des Soeurs Théière',
                    message: 'Bonjour ' + datas.name + '\n<br>Confirmez votre inscription en vérifiant votre boîte de réception et en suivant le lien indiqué.',
                    duration: 5,
                    type: 'success'
                });
                toast.show();

                // Reset le formulaire
                this._resetForm();

                // Redirige vers la page d'accueil
                const router: RouterModule = new RouterModule();
                if (this.fromInstance == 'checkout') {
                    router.changeLocation('/basket');
                } else {
                    router.changeLocation('/');
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
                this._resetForm();
            } 
        })
    }

    private _resetForm(): void {
        for (let field of this.fields) {
            if (field.attr('id') === 'civility-content') {
                const selectedLine = field.find('option:selected');
                selectedLine.removeAttr('selected');
                field.prop('selectedIndex', 0);
            } else {

                if (field.attr('id') === 'company-content') {
                    field.val('Particulier');
                } else {
                    field.val('');
                }
            }

            this.button.attr('disabled', 'disabled');
        }
    }
    /**
     * Contrôle l'égalité entre les deux mots de passe
     */
    private _checkPassword(): boolean {
        const password: JQuery = $('#original-password-content');
        const confirm: JQuery = $('#confirm-password-content');

        if (password.val() !== '' && confirm.val() !== '') {
            if (password.val() !== confirm.val()) {
                return false;
            }
        }

        if (password.val() === '' || confirm.val() === '') {
            return false;
        }

        return true;
    }

    private isDirty(field: JQuery): void {
        const message: JQuery = $('[data-rel="' + field.attr('id') + '"]');
        if (field.val() === '') {
            message.toggleClass('hidden');
        } else {
            if (field.attr('id') === 'email-content') {
                if (!EmailHelper.validate(field.val() as string)) {
                    message.toggleClass('hidden');
                }
            }
        }
    }

}