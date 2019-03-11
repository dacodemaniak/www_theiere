/**
 * @name UserModule
 * @desc Chargement des éléments du module Utilisateur
 * @package modules/user
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @version 1.0.0
 * @version 1.0.1
 *  - Ajout des boutons dans la barre de menu en mode responsive
 */
import { UserModel } from  './models/user.model';
import { UserService } from '../../services/user.service';
import { MenuModel } from '../menu/models/menu.model';
import { UserMenuModel } from './models/user-menu.model';

export class UserModule {
    private userService: UserService;
    public user: UserModel;

    public constructor(userService: UserService) {
        this.userService = userService;

        this.init();
    }

    /**
     * Initialisation du module Utilisateur
     */
    private init() {
        this.userService.hasUser().then((datas) => {
            if (datas) {
                const user: UserModel = this.userService.getUser();
                const menus: Array<any> = user.getMenus();

                const accountMenu = menus.filter(
                    (element) => { return element.region === '_top-left'}
                );
                const userMenu = new UserMenuModel();
                userMenu.deserialize(accountMenu[0]);

                userMenu.render(user);

            } else {
                this.userService.getAnonymouseUser().then((response) => {
                    const menus: Array<any> = response.menus;

                    const accountMenu = menus.filter(
                        (element) => { return element.region === '_top-left'}
                    );
                    const userMenu = new UserMenuModel();
                    userMenu.deserialize(accountMenu[0]);
                    
                    userMenu.render();
                })
            }
        });
    }
}