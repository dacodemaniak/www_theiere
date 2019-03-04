import { UserModel } from './models/user.model';
import { EmailHelper } from '../../helpers/email.helper';
import { ToastModule } from '../toast/toast.module';
import { Constants } from '../../shared/constants';

import * as $ from 'jquery';
/**
 * @name InfoComponent
 * @desc Composant pour la gestion des informations du compte
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package user/components
 * @version 1.0.0
 */
export class InfoComponent {
    private user: UserModel;

    private ids: Map<string, string> = new Map<string, string>();
    private fields: Array<JQuery> = new Array<JQuery>();

    private form: JQuery = $('#account-form');

    private button: JQuery = $('#valid-info');

    public constructor(user: UserModel) {
        this.user = user;

        this.ids
            .set('civility', 'civility')
            .set('name', 'lastName')
            .set('forname', 'firstName')
            .set('company', 'company')
            .set('phone', 'phone');

        this._load();
    }

    private _load(): void {
        this.ids.forEach((rel, id) => {
            let field: JQuery = $('#' + id + '-content');
            field.val(this.user.getContent()[rel]);

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
    }

    private _submit(event: any): void {
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
            url: Constants.apiRoot + 'account/' + this.user.getId(),
            method: 'post',
            dataType: 'json',
            data: formContent,
            success: (datas: any) => {
                console.log(JSON.stringify(datas));
                const toast: ToastModule = new ToastModule({
                    title: 'Vos informations ont été mises à jour',
                    message: 'Vos nouvelles informations ont été mises à jour.',
                    type: 'success'
                });
                toast.show();
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