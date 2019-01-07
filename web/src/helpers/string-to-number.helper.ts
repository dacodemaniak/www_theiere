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

    public static toCurrency(value: string, currency: string = '&euro;'): string {
        let round: string = parseFloat(value).toFixed(2);
        const asString: string = round.replace('.', ',') + currency;
        console.log('Value : ' + round);
        return round + currency;
    }
}