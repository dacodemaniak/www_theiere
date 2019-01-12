/**
 * @name DialogInterface
 * @desc Définition des paramètres des boîtes de dialogue
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package modules/dialog/interfaces
 * @version 1.0.0
 */
export interface DialogInterface {
    title: string;
    content: string;
    showClass?: string;
    dismissClass?: string;
    type?: string;
    cancelContent?: string;
    confirmContent?: string;
}