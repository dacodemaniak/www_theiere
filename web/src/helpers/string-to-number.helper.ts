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
        let amount: number = parseFloat(value);
        const power: number = Math.pow(10, amount);
        amount = Math.round((amount * power)) / power;
        

        let round: string = amount.toFixed(3).substring(0, amount.toFixed(3).indexOf('.') + 3);

        console.log('Montant arrondi : ' + round);
        const asString: string = round.replace('.', ',') + currency;
        console.log('Value : ' + asString);
        return asString;
    }
}