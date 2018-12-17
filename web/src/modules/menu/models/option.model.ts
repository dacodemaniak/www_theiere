/**
 * @name OptionModel
 * @desc Définition des options des menus
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @package modules/menu
 * @version 1.0.0
 */

import * as $ from 'jquery';


export class OptionModel {
    protected id: number;
    protected content: any;
    protected ordre: number;
    protected route: string;
    protected slug: string;
    protected nodes?: Array<OptionModel>;

    public getSlug(): string {
        return this.slug;
    }

    public getTitleFr(): string {
        if (this.content.hasOwnProperty('icon')) {
            return '<i class="' + this.content.icon + '"></i>' + this.content.title[0].fr;
        }
        return this.content.title[0].fr;
    }

    public getMenu(): JQuery {
        const mainOption: JQuery = $('<a>');
    
        mainOption
            .attr('data-rel', this.id)
            .attr('data-slug', this.slug)
            .attr('href', this.route)
            .html(this.getTitleFr());
        return mainOption;
    }

    public deserialize(datas: any) {
        this.id = datas.id;
        this.content = datas.content;
        this.ordre = datas.ordre;
        this.route = '#' + datas.route;
        this.slug = datas.slug;
        this.nodes = datas.nodes;
    }
}