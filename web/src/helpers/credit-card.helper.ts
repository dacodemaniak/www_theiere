/**
 * @name CreditCardHelper
 * @desc Outils de contrôle et de formatage des numéros de carte bancaire
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package helpers
 * @version 1.0.0
 */

interface ValidationInterface{
    code: number;
    message: string;
}
export class CreditCardHelper {
    private static cardType: string = 'visa';

    public static validation(creditCardNumber: string): ValidationInterface[] {
        const validator: ValidationInterface[] = new Array<ValidationInterface>();

        if (creditCardNumber.length < 4) {
            validator.push({
                code: -1000,
                message: 'Nombre de caractères insuffisant'
            });
        } else {
            if (/[^0-9-\s]+/.test(creditCardNumber)) {
                validator.push({
                    code: -1001,
                    message: 'Le numéro de carte bancaire ne peut comporter que des chiffres.'
                });
            } else {
                if (!CreditCardHelper.validatePattern(creditCardNumber) && creditCardNumber.length === 16) {
                    validator.push({
                        code: -1002,
                        message: 'Le numéro de carte saisi est incorrect.'
                    });                
                } else {
                    validator.push(
                        CreditCardHelper.getType(creditCardNumber)
                    );
                }
            }
        }

        return validator;
    }

    /**
     * Détermine la validité du numéro de carte
     * @see Luhn algorithm
     */
    private static validatePattern(creditCardNumber: string): boolean {
        let nCheck: number = 0;
        let nDigit: number = 0; 
        let bEven: boolean = false;

        creditCardNumber = creditCardNumber.replace(/\D/g, "");
    
        for (let n: number = creditCardNumber.length - 1; n >= 0; n--) {
            let cDigit: string = creditCardNumber.charAt(n);
            nDigit = parseInt(cDigit, 10);
    
            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }
    
            nCheck += nDigit;
            bEven = !bEven;
        }
    
        return (nCheck % 10) == 0;
    }

    private static getType(systemNumber: string): ValidationInterface {
        let code: number = 1000;

        if (systemNumber.length < 16) {
            code = 1001;
        }
        if (systemNumber.substring(0, 2) === "34" || systemNumber.substring(0, 2) === "37") {
            return {
                code: code,
                message: 'amex'
            }
        }

        if (systemNumber.substring(0, 2) === "50" || systemNumber.substring(0, 2) === "55") {
            return {
                code: code,
                message: 'mastercard'
            }
        }

        if (systemNumber.substring(0, 1) === "4") {
            return {
                code: code,
                message: 'visa'
            }
        }

        return {
            code: code,
            message: 'autre'
        }
    }
}