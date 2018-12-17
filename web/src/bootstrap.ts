import { BasketModule } from './modules/basket/basket.module';
import { UserModule } from "./modules/user/user.module";
import { UserService } from "./services/user.service";

/**
 * @name Bootstrap
 * @desc Lancement de l'application front-end
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @version 1.0.0
 */
export class Bootstrap {
    private userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;

        this.boostrap();
    }

    private boostrap() {
        // Charge le module Utilisateur
        const userModule: UserModule = new UserModule(this.userService);

        const basketModule: BasketModule = new BasketModule(this.userService);

        console.log('Bootstrap application done');
    }
}