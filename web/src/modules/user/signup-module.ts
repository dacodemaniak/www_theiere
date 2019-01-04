import { Constants } from './../../shared/constants';

import * as $ from 'jquery';

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

}