/**
 * @name Constants
 * @desc Définition des constantes de l'application
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package shared
 * @version 1.0.0
 */
export class Constants {
    public static hostname: string = window.location.hostname;

    public static get apiRoot() {
        if (Constants.hostname === 'api.lessoeurstheiere.com' || Constants.hostname === 'lessoeurstheiere.com' || Constants.hostname === 'www.lessoeurstheiere.com') {
            return 'https://api.lessoeurstheiere.com/';
        }
        return 'http://api.lessoeurstheiere.wrk/';
    }

    public static get paymentUrl(): string {
        return 'https://paiement.systempay.fr/vads-payement/';
    }

    public static get averageWeight() {
        return 500;
    }
}