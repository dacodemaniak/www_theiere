import { ProductSearchComponent } from './shared/product-search-component';
import { BannerComponent } from './shared/banner-component';
import { RouterModule } from './modules/router/router.module';
import { BasketModule } from './modules/basket/basket.module';
import { UserModule } from "./modules/user/user.module";
import { UserService } from "./services/user.service";

/**
 * @name Bootstrap
 * @desc Lancement de l'application front-end
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @version 1.0.0
 * @version 1.0.1 Ajout de la recherche live dans le menu
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

        const routerModule: RouterModule = new RouterModule();
        
        const productSearch: ProductSearchComponent = new ProductSearchComponent();
        
        console.log('Bootstrap application done');

        // Affichage de la bannière Cookies et RGPD
        const banner: BannerComponent = new BannerComponent();
    }
}