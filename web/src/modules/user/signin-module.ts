import { Constants } from './../../shared/constants';

import * as $ from 'jquery';

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

    public constructor() {
        this.fields = new Array<JQuery>();
        this.fields.push($('#civility-content'));
        this.fields.push($('#name-content'));
        this.fields.push($('#forname-content'));
        this.fields.push($('#company-content'));
        this.fields.push($('#phone-content'));
        this.fields.push($('#email-content'));
        this.fields.push($('#original-password-content'));
        this.fields.push($('#confirm-password-content'));

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
        for (const field of this.fields) {
            if (field.attr('id') !== 'civility-content') {
                if (field.val() === '') {
                    this.button.attr('disabled', 'disabled');
                    return;
                }
            }
        }

        this.button.removeAttr('disabled');
    }

}