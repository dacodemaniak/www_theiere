/**
 * @name Constants
 * @desc Définition des constantes de l'application
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package shared
 * @version 1.0.0
 */
export class Constants {
    public static hostname: string = window.location.hostname;
    
    /**
     * Définit le mode d'utilisation du système de paiement
     * Rebuild with false to enable testMode
     */
    public static prodMode: boolean = true;

    public static get apiRoot() {
        if (Constants.hostname === 'api.lessoeurstheiere.com' || Constants.hostname === 'lessoeurstheiere.com' || Constants.hostname === 'www.lessoeurstheiere.com') {
            return 'https://api.lessoeurstheiere.com/';
        }
        return 'http://api.lessoeurstheiere.wrk/';
    }

    public static get paymentUrl(): string {
        return 'https://paiement.systempay.fr/vads-payment/';
    }

    public static get merchantId(): string {
        return '57890042';
    }

    public static get ctxMode(): string {
        if (Constants.hostname === 'api.lessoeurstheiere.com' || Constants.hostname === 'lessoeurstheiere.com' || Constants.hostname === 'www.lessoeurstheiere.com') {
            return Constants.prodMode ? 'PRODUCTION' : 'TEST';
        } else {
            return 'TEST';
        }
    }

    public static get merchantKey(): string {
        if (Constants.hostname === 'api.lessoeurstheiere.com' || Constants.hostname === 'lessoeurstheiere.com' || Constants.hostname === 'www.lessoeurstheiere.com') {
            return Constants.prodMode ? 'uahFCVCn2Iwrz4ol' : '9uGrmuYph7x3JgyS';
        } else {
            return '9uGrmuYph7x3JgyS';
        }
    }

    public static get averageWeight() {
        return 500;
    }
}