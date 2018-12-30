import { CartModule } from './../basket/cart.module';
import { ContactModule } from './../contact/contact.module';
/**
 * @name RouterModule
 * @desc Listener sur les changements de routes pour activer les modules spécifiques
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules/router
 * @version 1.0.0
 */

 export class RouterModule {
     public constructor() {
         let url: string = location.pathname.slice(1) || '/';

         
        
         console.info(url.indexOf('.php'));

         if (url.indexOf('.php')) {
            console.info('Mode développement');
            url = url.slice(12);
         } else {
             console.info('Mode production');
         }

         console.log('Current url : ' + url);

         if (url.indexOf('product/')) {
            url = 'product';
         }

         let module: any = {};

         switch (url) {
             case 'contact':
                module = new ContactModule();
             break;

             case 'product':
                module = new CartModule();
             break;
         }

     }

     private _setListeners() {
         $(window).on(
             'hashchange',
             (event: any): void => this._loadModule() 
         );
     }

     private _loadModule(): void {
        console.log('Charge les modules spécifiques');
     }
 }