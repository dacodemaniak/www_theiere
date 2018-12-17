import { MenuModel } from "../../menu/models/menu.model";
import { OptionModel } from "../../menu/models/option.model";

/**
 * @name UserMenuModel
 * @desc Instance du menu Utilisateur soit anonyme, soit identifié
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules/user/models
 * @version 1.0.0
 */
import * as $ from 'jquery';

/**
 * @name UserMenuModel
 * @desc Menu utilisateur spécifique
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules/user
 * @version 1.0.0
 */
export class UserMenuModel extends MenuModel {
    private isAnonymous: boolean = true;

    public render() {
        const userMenu: JQuery = $('#user-menu').children('.wrapper').eq(0);

        const mainOption: OptionModel = this.getOption();

        console.log('Option : ' + JSON.stringify(mainOption) + ' dans ' + userMenu);

        mainOption.getMenu().appendTo(userMenu);
    }

    private getOption(): OptionModel {
        const options: Array<OptionModel> = this.options;

        let index: number = options.findIndex((obj: OptionModel) => { return obj.getSlug() == 'signin'});

        if (index === -1) {
            index = options.findIndex((obj: OptionModel) => { return obj.getSlug() == 'my-account'});
            this.isAnonymous = false;
        }

        const option = options[index];

        return option;
    }
}