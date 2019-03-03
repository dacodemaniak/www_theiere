import * as $ from 'jquery';
import * as moment from 'moment';
import 'bootstrap';

import { Bootstrap } from './src/bootstrap';
import { UserService } from './src/services/user.service';

/**
$(window).on(
    'load',
    (event: any) => {
        // Charge les différents services
        const userService: UserService = new UserService();
        console.log('app is running');
        const bootstrap = new Bootstrap(userService);
    }
)
**/
$(document).ready(
    (event: any) => {
        const userService: UserService = new UserService();
        const bootstrap = new Bootstrap(userService);       
    }
);