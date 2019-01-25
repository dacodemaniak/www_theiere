/**
 * @name SiteService
 * @desc Service de récupération des données du site
 * @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
 * @package services
 * @version 1.0.0
 */

import { Constants } from './../shared/constants';
import * as $ from 'jquery';

export class SiteService {

    public getSite(): Promise<any> {
        return new Promise((resolve) => {
            $.ajax({
                url: Constants.apiRoot + 'site',
                method: 'get',
                dataType: 'json',
                success: (data) => {
                    resolve(data);
                },
                error: (xhr, error) => {
                    resolve({});
                }
            })
        });
    }
}