import { DialogInterface } from './interfaces/dialog-interface';

import * as $ from 'jquery';

/**
 * @name DialogModule
 * @desc Gestion des boîtes de dialogue
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package modules/dialog
 * @version 1.0.0
 */
export class DialogModule {
    /**
     * Element boîte de dialogue
     */
    private static dialogElement: JQuery = $('#dialog');
    private static dialogHeader: JQuery = $('#dialog .dialog.inner header h4');
    private static dialogContent: JQuery = $('#dialog .dialog.inner blockquote');
    private static cancelButtonContent: JQuery = $('#dialog .dialog.inner footer button#btn-cancel span');
    private static confirmButtonContent: JQuery = $('#dialog .dialog.inner footer button#btn-confirm span');
    private static cancelButton: JQuery = $('#dialog .dialog.inner footer button#btn-cancel');
    private static confirmButton: JQuery = $('#dialog .dialog.inner footer button#btn-confirm');

    private params: DialogInterface;
    private initiator: JQuery;

    public constructor(element: JQuery, params: DialogInterface) {
        this.params = {
            title: params.title,
            type: params.type ? params.type : 'warning',
            content: params.content,
            showClass: params.showClass ? params.showClass : 'zoomIn',
            dismissClass: params.dismissClass ? params.dismissClass : 'zoomOut',
            cancelContent: params.cancelContent ? params.cancelContent : 'Non',
            confirmContent: params.confirmContent ? params.confirmContent : 'Oui'
        };

        this.initiator = element;
    }

    public show(): void {
        // Construit les différents éléments
        DialogModule.dialogHeader.html(this.params.title);
        DialogModule.dialogContent.html(this.params.content);
        DialogModule.cancelButtonContent.html(this.params.cancelContent);
        DialogModule.confirmButtonContent.html(this.params.confirmContent);

        DialogModule.dialogElement
            .removeClass('hidden')
            .addClass('animated')
            .addClass(this.params.showClass);

        // Définit les événements
        DialogModule.cancelButton.on(
            'click',
            (event: any): void => {
                this._disable();
                this.initiator.trigger('dismiss'); 
            }
        );

        DialogModule.confirmButton.on (
            'click',
            (event: any): void => {
                this._disable();
                this.initiator.trigger('confirm');
            }
        );
    }

    private _disable(): void {
        DialogModule.dialogElement
        .removeClass(this.params.showClass)
        .addClass(this.params.dismissClass);
    setTimeout(
        () => {
            DialogModule.dialogElement
                .removeClass('animated')
                .removeClass(this.params.dismissClass)
                .addClass('hidden');
            
        },
        1500
    ); 
    }
}