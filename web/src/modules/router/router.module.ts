import { CheckoutModule } from './../basket/checkout.module';
import { DeliveryModule } from './../basket/delivery-module';
import { AuthenticationModule } from './../user/authentication-module';
import { BasketListModule } from './../basket/basket-list.module';
import { CartModule } from './../basket/cart.module';
import { ContactModule } from './../contact/contact.module';
import { AccountModule } from '../user/account-module';
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

         if (url.indexOf('.php') !== -1) {
            //console.info('Mode développement');
            let slicer: number;
            if (url.indexOf('app.php') !== -1) {
               slicer = 8;
            } else {
               slicer = 12;
            }
            url = url.slice(slicer);
         } else {
             console.info('Mode production');
         }

         //console.log('Before slicing : ' + url);

         if (url.indexOf('product/') !== -1 || url.indexOf('products/') !== -1) {
            url = 'product';
         }

         if (url.indexOf('myaccount/') !== -1) {
            url = 'account';
         }

         let deliveryAddress: string;

         if (url.indexOf('checkout/') !== -1) {
            let urlParts: Array<string>;
            urlParts = url.split('/');
            deliveryAddress = urlParts[1];
            url = 'checkout';
         }
         let from: string;
         if (url.indexOf('signin/') !== -1) {
            if (url.indexOf('checkout') !== -1) {
               from = 'checkout';
            } else {
               from = 'anywhere';
            }
            url = 'signin';
            
         }

         //console.log('Current url and module to load : ' + url);

         let module: any = {};

         switch (url) {
             case 'contact':
                module = new ContactModule();
             break;

             case 'product':
                module = new CartModule();
             break;

             case 'signin':
                module = new AuthenticationModule(from);
             break;

             case 'basket':
                module = new BasketListModule();
             break;

             case 'account':
               module = new AccountModule();
             break;

             case 'delivery':
               module = new DeliveryModule();
             break;

             case 'checkout':
               module = new CheckoutModule(deliveryAddress);
             break;
         }

     }

     public changeLocation(location: string): void {
         document.location.replace(location);
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