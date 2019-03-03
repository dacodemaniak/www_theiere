import { ComponentInterface } from './interfaces/component-interface';
import { debounce } from 'ts-debounce';
import { Constants } from './constants';

import * as $ from 'jquery';

/**
 * @name ProductSearchComponent
 * @desc Live Search des produits
 * @author IDea Factory (dev-team@ideafactory.fr)
 * @package shared
 * @version 1.0.0
 */

export class ProductSearchComponent implements ComponentInterface {
    private _button: JQuery = $('#search-form button');
    private _searchInput: JQuery = $('#search-form input[type="search"]');
    private _searchResult: JQuery = $('#search-result');
    private _itemsNumber: JQuery = $('.items-number');
    public constructor() {
        this.setListeners();
        this.init();
    }

    public setListeners(): void {
        this._searchInput.on(
            'keyup',
            (event: any): any => debounce(this._search(event), 450)
        );
    }

    public init(): void {
        this._button.attr('disabled', 'disabled');
    }

    private _search(event: any): void {
        console.log('Recherche en live avec : ' + $(event.target).val());
        if ($(event.target).val().toString().length > 5) {
            // Appel de l'API de recherche FULLTEXT
            const searchTerm: string = $(event.target).val().toString();
            $.ajax({
                url: Constants.apiRoot + 'product/search/for/' + searchTerm,
                method: 'get',
                dataType: 'json',
                success: (datas: Array<any>) => {
                    $('#product-items').children('li').remove();
                    this._itemsNumber.html(datas.length.toString());
                    datas.forEach((item: any) => {
                        $('#product-items').append(this._addLine(item));
                    });
                    // Affiche les résultats
                    this._searchResult.removeClass('hidden');
                },
                error: (xhr, datas, error) => {
                    $('#product-items').children('li').remove();
                    this._itemsNumber.html('');
                    this._searchResult.addClass('hidden');
                }
            })
        }
    }

    private _addLine(item: any) {
        console.log('Item : ' + JSON.stringify(item));
        const line: JQuery = $('<li>');
        const link: JQuery = $('<a>');
        link
            .attr('href', '/product/' + item.id + '/' + item.category.id)
            .attr('title', item.content.title.fr)
            .addClass('item-product')
            .html(item.content.title.fr);
        link.appendTo(line);
        // Ajoute la catégorie
        const p: JQuery = $('<p>');
        p
            .addClass('item-category')
        const catLink: JQuery = $('<a>');
        catLink
            .attr('href', '/products/category/' + item.category.id)
            .html(item.category.title);
        
        catLink.appendTo(p);
        p.appendTo(line);

        return line;
    }

    private _debounce(func: any, timeout: number): any {
        let timer: any;
        console.log('Debounce : ' + func + ' ' + timeout);
        return () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func();
            }, timeout);
        }
    }

}