/**
 * @name UserModel
 * @desc Définition d'un utilisateur
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules/user
 * @version 1.0.0
 */

export class UserModel {
    private id: number;
    private groupeId: number;
    private login: string;
    private salt: string;
    private isValid: boolean;
    private createdAt: any;
    private lastLogin: any;
    private content: any;

    public constructor() {}

    
}