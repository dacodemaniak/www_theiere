import { RouterModule } from './../router/router.module';
import { UserService } from './../../services/user.service';
import { Constants } from './../../shared/constants';
import { ToastModule } from '../toast/toast.module';

import * as $ from 'jquery';
import { EmailHelper } from '../../helpers/email.helper';

/**
 * @name SignupModule
 * @desc Gestion du formulaire d'identification d'un utilisateur
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package user
 * @version 1.0.0
 */

export class SignupModule {
    /**
     * Contenu du formulaire
     */
    private formContent: any = {};

    /**
     * Formulaire d'identification
     */
    private form: JQuery = $('#signup');

    /**
     * Champ login du formulaire
     */
    private login: JQuery = $('#login-content');

    /**
     * Mot de passe pour l'identification
     */
    private password: JQuery = $('#password-content');

    /**
     * Bouton Login
     */
    private button: JQuery = $('#login-btn');

    private forgotPasswordLink: JQuery = $('#forgot-password');


    private fromInstance: string;

    public constructor(from: string) {
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

        this.form.on(
            'submit',
            (event: any): void => this._authenticate(event)
        );

        $('#passwordRecovering-modal').on(
            'hidden.bs.modal',
            (event: any): void => this.closeModal(event)
        );

        $('#modal-passwordrecovering-form').on(
            'keyup',
            (event: any) => this._manageRecoveryForm(event)
        );

        $('#modal-passwordrecovering-form').on(
            'submit',
            (event: any) => this._sendRecoveryQuery(event)
        );
    }

    /**
     * Active ou désactive le bouton de login
     */
    private _manageUserEntries(event: any): void {
        if (this.login.val() !== '' && this.password.val() !== '') {
            console.log('Login : ' + this.login.val() + ' Pass : ' + this.password.val());
            this.button.removeAttr('disabled');
        } else {
            this.button.attr('disabled', 'disabled');
        }
    }

    /**
     * Authentifie l'utilisateur et affiche un toast avant redirection
     * vers la page d'accueil
     */
    private _authenticate(event: any): void {
        event.preventDefault();

        const button: JQuery = $(event.target);
        const position: any = button.offset();

        this.formContent = {
            login: this.login.val(),
            password: this.password.val()
        };

        $.ajax({
            url: Constants.apiRoot + 'signin',
            method: 'post',
            dataType: 'json',
            data: this.formContent,
            success: (datas) => {
                console.log('Authentication success');
                const toast: ToastModule = new ToastModule({
                    title: 'Bonjour ' + datas.name,
                    message: datas.name + ' bienvenue sur la boutique des Soeurs Théière',
                    type: 'success',
                    position: 'top-center'
                });
                toast.show();

                // Reset le formulaire
                this.login.val('');
                this.password.val('');
                this.button.attr('disabled', 'disabled');

                // Met à jour le menu Utilisateur
                
                // Ajoute le token dans le localStorage
                const userService: UserService = new UserService();
                userService.setToken(datas.token);

                // Redirige vers la page d'accueil
                const router: RouterModule = new RouterModule();
                if (this.fromInstance == 'checkout') {
                    router.changeLocation('/basket');
                } else {
                    router.changeLocation('/');
                }

            },
            error: (xhr, error) => {
                const httpError: number = xhr.status;
                const response: string = xhr.responseJSON;

                const toast: ToastModule = new ToastModule(
                    {
                        title: 'Erreur d\'identification',
                        message: response,
                        type: 'danger',
                        top: position.top,
                        left: position.left + 50,
                        duration: 4
                    }
                );
                toast.show();

                // Reset le formulaire
                this.login.val('');
                this.password.val('');
                this.button.attr('disabled', 'disabled');
            }
        });
    }

    private closeModal(event: any): void {}

    private _manageRecoveryForm(event: any): void {
        const fields: Array<JQuery> = new Array<JQuery>(
            $('#loginEmail-content'),
            $('#userName-content')
        );

        let enableButton: boolean = true;

        const _invalidEMailAlert: JQuery = $('#invalid-email');
        const _invalidPairAlert: JQuery = $('#invalid-pair');

        fields.forEach((element) => {
            if (element.val() === '') {
                enableButton = false;
            } else {
                if (element.attr('id') === 'loginEmail-content') {
                    if (!EmailHelper.validate(element.val().toString())) {
                        enableButton = false;
                    } else {
                        $.ajax({
                            url: Constants.apiRoot + 'user/email/' + element.val(),
                            method: 'get',
                            dataType: 'json',
                            success: (datas: any) => {
                                _invalidEMailAlert.addClass('hidden');
                            },
                            error: (xhr, error) => {
                                _invalidEMailAlert.removeClass('hidden');
                                enableButton = false;
                            }
                        });
                    }
                }
            }
        });

        if (enableButton) {
            $.ajax({
                url: Constants.apiRoot + 'user/email/' + $('#loginEmail-content').val() + '/' + $('#userName-content').val(),
                method: 'get',
                dataType: 'json',
                success: (datas: any) => {
                    _invalidPairAlert.addClass('hidden');
                },
                error: (xhr, error) => {
                    _invalidPairAlert.removeClass('hidden');
                    $('#modal-recovering').attr('disabled', 'disabled');
                }
            });
            $('#modal-recovering').removeAttr('disabled');
        } else {
            $('#modal-recovering').attr('disabled', 'disabled');
        }
    }

    private _sendRecoveryQuery(event: any): void {
        event.preventDefault();
        const _data: any = {
            login: $('#loginEmail-content').val()
        };

        // Envoyer la requête au serveur
        $.ajax({
            url: Constants.apiRoot + 'user/recover',
            method: 'post',
            data: _data,
            dataType: 'json',
            success: (result) => {
                $('.toggle').hide();
                $('.modal-body').append(result);
                // Masque le bouton submit
                $('#modal-recovering').hide().attr('disabled', 'disabled');
                // Change le contenu du bouton Annuler
                $('#recover-modal-dismiss').html('Fermer');
            },
            error: (xhr, error) => {
                // TODO Toast pour indiquer l'erreur
            }
        });
    }
}