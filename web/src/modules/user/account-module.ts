import { AddressComponent } from './address-component';
import { DisconnectComponent } from './disconnect-component';
import { PasswordComponent } from './password-component';
import { InfoComponent } from './info-component';
import { UserService } from './../../services/user.service';
import { UserModel } from './models/user.model';
import { MyOrdersComponent } from './my-orders-component';
/**
 * @name AccountModule
 * @desc Chargement des modules pour la gestion des formulaires relatifs au compte utilisateur
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package modules/user
 * @version 1.0.0
 */
export class AccountModule {
    private user: UserModel;

    public constructor() {
        const userService: UserService = new UserService();

        userService.hasUser().then((hasUser) => {
            if (hasUser) {
                this.user = userService.getUser();

                this._init();
            }
        });
    }

    private _init(): void {
        const info: InfoComponent = new InfoComponent(this.user);
        const password: PasswordComponent = new PasswordComponent(this.user);
        const address: AddressComponent = new AddressComponent(this.user);
        const myOrders: MyOrdersComponent = new MyOrdersComponent(this.user);
        const disconnect: DisconnectComponent = new DisconnectComponent(new UserService());
    }
}