import { UserService } from './src/services/user.service';
import * as $ from 'jquery';

import { Bootstrap } from './src/bootstrap';

$(window).on(
    'load',
    (event: any) => {
        // Charge les différents services
        const userService: UserService = new UserService();
        console.log('app is running');
        const bootstrap = new Bootstrap(userService);
    }
)