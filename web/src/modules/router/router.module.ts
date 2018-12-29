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
         const url: string = location.pathname.slice(1) || '/';

         console.log('Current url : ' + url);
        
         let module: any = {};

         switch (url) {
             case 'contact':
                module = new ContactModule();
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