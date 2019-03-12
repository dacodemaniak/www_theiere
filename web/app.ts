import * as $ from 'jquery';
import * as moment from 'moment';
import 'bootstrap';

import { Bootstrap } from './src/bootstrap';
import { UserService } from './src/services/user.service';

$(document).ready(
    (event: any) => {
        const userService: UserService = new UserService();
        const bootstrap = new Bootstrap(userService);       
    }
);