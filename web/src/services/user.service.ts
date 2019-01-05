import { UserModel } from './../modules/user/models/user.model';
import { RouterModule } from './../modules/router/router.module';

/**
 * @name UserService
 * @desc Service de gestion des utilisateurs (frontend - backend)
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @version 1.0.0
 */
import * as $ from 'jquery';
import { Constants } from './../shared/constants';
import { Jwt } from './../../node_modules/@coolgk/jwt/jwt';

export class UserService {
    //private apiRoot: string = 'http://api.lessoeurstheiere.wrk/';
    private apiRoot: string = 'https://api.lessoeurstheiere.com/';

    /**
     * Système de gestion des tokens
     */
    private jwt: Jwt;

    /**
     * Utilisateur identifié
     */
    private user: UserModel;

    public constructor() {
        this.jwt = new Jwt({
            secret: 'K1K@2018!'
        });
    }

    /**
     * Retourne l'utilisateur identifié
     */
    public getUser(): UserModel {
        return this.user;
    }

    /**
     * Retourne l'existence d'un utilisateur dans localStorage
     */
    public hasUser(): Promise<boolean> {
        return new Promise((resolve) => {
            const localUser = localStorage.getItem('eshopUser');

            if (localUser) {
                resolve(this._check(localUser));
            }
            resolve(false);
        });

    }

    public setToken(token: string): void {
        localStorage.setItem('eshopUser', token);
    }

    public getToken(): string {
        return localStorage.getItem('eshopUser');
    }

    public getAnonymouseUser(): Promise<any> {
        return new Promise((resolve: any) => {
            $.ajax({
                url: Constants.apiRoot + 'nouser',
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

    private _check(token: string): Promise<boolean> {
        console.log('Contrôle : ' + token);
        return new Promise((resolve) => {
            $.ajax({
                url: Constants.apiRoot + 'token/' + token,
                method: 'get',
                dataType: 'json',
                success: (datas) => {
                    console.log('Authentification du token réussie');
                    // Définit l'utilisateur courant
                    this.user = new UserModel();
                    this.user.deserialize(datas);
                    resolve(true);
                },
                error: (xhr, error) => {
                    console.log('Token invalide ou expiré');
                    localStorage.removeItem('eshopUser');
                    const router: RouterModule = new RouterModule();
                    router.changeLocation('/signin');
                    resolve(false);
                }
            })
        });
    }
}