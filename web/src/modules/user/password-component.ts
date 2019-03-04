import { ToastModule } from './../toast/toast.module';
import { Constants } from './../../shared/constants';
import { UserModel } from './models/user.model';

import * as $ from 'jquery';

/**
 * @name PasswordComponent
 * @desc Gestion du formulaire de modification du mot de passe
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package user/components
 * @version 1.0.0
 */
export class PasswordComponent {
    private user: UserModel;

    private form: JQuery = $('#change-password-form');

    private button: JQuery = $('#change-password-btn');

    public constructor(user: UserModel) {
        this.user = user;

        this._load();
    }

    private _load(): void {
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
        const original: JQuery = $('#original-password-content');
        const confirm: JQuery = $('#confirm-password-content');

        if (original.val() !== '') {
            if (original.val() === confirm.val()) {
                this.button.removeAttr('disabled');
                return;
            }
        }
        this.button.attr('disabled', 'disabled');
    }

    private _submit(event: any): void {
        event.preventDefault();

        const formDatas: any = {
            password: $('#original-password-content').val()
        };

        const headers: any = {
            'X-Auth-Token': this.user.getToken()
        };

        $.ajax({
            headers: headers,
            url: Constants.apiRoot + 'account/password/update',
            method: 'post',
            data: formDatas,
            dataType: 'json',
            success: (datas) => {
                const toast: ToastModule = new ToastModule({
                    title: 'Mot de passe mis à jour',
                    message: datas,
                    type: 'success',
                    position: 'middle-center'
                });
                toast.show();

                this._reset();
            },
            error: (xhr, error) => {
                const toast: ToastModule = new ToastModule({
                    title: 'Mot de passe mis à jour',
                    message: xhr.responseJSON,
                    type: 'danger',
                    position: 'middle-center'
                });
                toast.show();

                this._reset();
            }
        });
    }

    private _reset(): void {
        $('#original-password-content').val('');
        $('#confirm-password-content').val('');

        this.button.attr('disabled', 'disabled');
    }
}