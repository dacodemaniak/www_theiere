import { RouterModule } from './../router/router.module';
import { UserService } from './../../services/user.service';
import { Constants } from './../../shared/constants';

import * as $ from 'jquery';
import { ToastModule } from '../toast/toast.module';

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

    public constructor() {
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
                router.changeLocation('/');

            },
            error: (xhr, error) => {
                const httpError: number = xhr.status;
                const response: string = xhr.responseJSON;

                const toast: ToastModule = new ToastModule(
                    {
                        title: 'Erreur d\'identification',
                        message: response,
                        type: 'danger'
                    }
                );
                toast.show();

                // Reset le formulaire
                this.login.val('');
                this.password.val('');
                this.button.attr('disabled', 'disabled');
            }
        })
    }

}