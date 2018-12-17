/**
 * @name UserService
 * @desc Service de gestion des utilisateurs (frontend - backend)
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @version 1.0.0
 */
import * as $ from 'jquery';

export class UserService {
    private apiRoot: string = 'http://api.lessoeurstheiere.wrk/';

    public constructor() {}

    /**
     * Retourne l'existence d'un utilisateur dans localStorage
     */
    public hasUser(): boolean {
        const localUser = localStorage.getItem('eshopUser');

        return localUser ? true : false;
    }

    public getAnonymouseUser(): Promise<any> {
        return new Promise((resolve: any) => {
            $.ajax({
                url: this.apiRoot + 'nouser',
                dataType: 'json',
                method: 'get',
                success: (datas) => {
                    resolve(datas);
                },
                error: (xhr, error) => {
                    resolve(false);
                }
            });
        })
    }
}