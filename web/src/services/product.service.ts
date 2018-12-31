/**
 * @name ProductService
 * @desc Service de gestion des produits du back-end
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package services
 * @version 1.0.0
 */

import * as $ from 'jquery';

export class ProductService {
    private apiRoot: string = 'http://api.lessoeurstheiere.wrk/';

    /**
     * Retourne une promesse de produit
     */
    public getProduct(id: number): Promise<any> {
        return new Promise((resolve) => {
            $.ajax({
                url: this.apiRoot + 'product/' + id,
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