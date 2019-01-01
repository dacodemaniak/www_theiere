import { Constants } from './../shared/constants';
import * as $ from 'jquery';
/**
 * @name ProductService
 * @desc Service de gestion des produits du back-end
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package services
 * @version 1.0.0
 */

export class ProductService {
    /**
     * Retourne une promesse de produit
     */
    public getProduct(id: number): Promise<any> {
        return new Promise((resolve) => {
            $.ajax({
                url: Constants.apiRoot + 'product/' + id,
                method: 'get',
                dataType: 'json',
                success: (datas) => {
                    resolve(datas)
                },
                error: (xhr, error) => {
                    resolve(false)
                }
            });
        })
    }
}