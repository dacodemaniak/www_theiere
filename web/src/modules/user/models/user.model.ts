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
    private name: string;
    private token: string;
    private isValid?: boolean;
    private createdAt?: any;
    private lastLogin?: any;
    private content: any;
    private menus: any;

    public constructor() {}

    public getMenus(): any {
        return this.menus;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }
    
    public deserialize(datas: any) {
        Object.assign(this, datas);
        this.content = datas.userDetails;

    }

    
}