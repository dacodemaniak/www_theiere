/**
 * @name EmailHelper
 * @desc Méthodes pour la validation d'adresses e-mail
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr
 * @package helpers
 * @version 1.0.0
 */
export class EmailHelper {
    private static regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    public static validate(email: string) {
        return EmailHelper.regex.test(email.toLowerCase());
    }
}