import { SigninModule } from './signin-module';
import { SignupModule } from './signup-module';

/**
 * @name AuthenticationModule
 * @desc Regroupe les modules de login et de registration d'un utilisateur
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package user
 * @version 1.0.0
 */
export class AuthenticationModule {
    public constructor(from: string) {
        const signin = new SigninModule(from);
        const signup = new SignupModule(from);
    }
}