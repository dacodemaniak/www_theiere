/**
 * @name StringToNumberHelper
 * @desc Utilitaire de conversion de chaînes en nombre
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package helpers
 * @version 1.0.0
 */
export class StringToNumberHelper {
    public static toNumber(value: string, currency: string = '&euro;'): number {
        // Supprimer la monnaie
        if (value.indexOf(currency) !== -1) {
            value = value.substr(0, value.indexOf(currency));
        }

        return parseFloat(value.replace(/,/g, '.'));
    }
}