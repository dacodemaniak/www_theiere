import { RouterModule } from './../router/router.module';
import { UserService } from './../../services/user.service';

import * as $ from 'jquery';

/**
 * @name DisconnectComponent
 * @desc Déconnexion de l'utilisateur
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package user/component
 * @version 1.0.0
 */
export class DisconnectComponent {
    private form: JQuery = $('#disconnect-form');

    private button: JQuery = $('#disconnect-btn');

    private userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;

        this._load();
    }

    private _load() {
        this.button.on(
            'click',
            (event: any): void => this._disconnect(event)
        );
    }

    private _disconnect(event: any) {
        event.preventDefault();
        this.userService.disconnect().then((done) => {
            const router: RouterModule = new RouterModule();
            router.changeLocation('/');
        });

    }
}