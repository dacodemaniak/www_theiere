import { ProductModel } from './models/product.model';
import { UserModel } from './models/user.model';
import { OrderService } from './../../services/order.service';

import * as $ from 'jquery';
import { OrderModel } from './models/order.model';

/**
 * @name MyOrdersComponent
 * @description Charge les éventuelles commandes passées par l'utilisateur identifié
 */
export class MyOrdersComponent {

    private user: UserModel;
    private orderService: OrderService = new OrderService();
    private orders: Array<OrderModel> = new Array<OrderModel>();

    public constructor(user: UserModel) {
        this.user = user;
        this._init();
    }

    private _init(): void {
        this.orderService.getOrdersNumber(this.user).then((result) => {
            if (result && result > 0)  {
                // On peut activer l'onglet mes commandes
                const tab: JQuery = $('#order-tab');
                tab.removeClass('disabled');
                let tabContent: string = tab.html();
                tabContent += ' (' + result + ')';
                tab.html(tabContent);

                // Alimenter les commandes converties
                this.orderService.getCustomerOrders(this.user).then((orders: any) => {
                    if (orders) {
                        this.orders = orders;
                        this._display();

                        // Then set animation toggling
                        $('#my-orders-table tbody').on(
                            'click',
                            'tr',
                            (event: any): void => this._toggleRow(event)
                        );
                    }
                })
            }
        });
    }

    private _display(): void {
        const body: JQuery = $('#my-orders-table tbody');

        this.orders.forEach((order) => {
            let tr: JQuery = $('<tr>');
            tr
                .attr('id', order.getId())
                .addClass('toggle-detail');

            let convertTd: JQuery = $('<td>');
            convertTd.html(order.getConvertDate());

            let referenceTd: JQuery = $('<td>');
            referenceTd.html(order.getRefence());

            let totalTd: JQuery = $('<td>');
            totalTd.html(order.getFullTaxTotal());

            tr
                .append(convertTd)
                .append(referenceTd)
                .append(totalTd);

            tr.appendTo(body);

            // Add order detail below in a hidden row
            let detailTr: JQuery = $('<tr>');
            detailTr
                .attr('data-rel', order.getId())
                .addClass('hidden')
                .addClass('order-products-detail');

            let detailTd: JQuery = $('<td>');
            detailTd.attr('colspan', 3);

            // Create product table inside the detail column
            let detailTable: JQuery = $('<table>');
            detailTable
                .addClass('table')
                .addClass('table-condensed');

            order.getBasket().forEach((product: ProductModel) => {
                let productTr = $('<tr>');

                let productTitleTd: JQuery = $('<td>');
                productTitleTd.html(product.getTitle());

                let servingSizeTd: JQuery = $('<td>');
                servingSizeTd.html(product.getServingSize());

                let quantityTd: JQuery = $('<td>');
                quantityTd.html(product.getQuantity());

                productTr
                    .append(productTitleTd)
                    .append(servingSizeTd)
                    .append(quantityTd);
                detailTable.append(productTr);
            });
            detailTd.append(detailTable);
            detailTr.append(detailTd);

            detailTr.appendTo(body);
        });
    }

    private _toggleRow(event: any): void {
        const target: JQuery = $(event.target).parent('tr');
        

        if (target.hasClass('toggle-detail')) {
            console.log('Toggle visibility');
            const detailRow: JQuery = target.next('tr');
            detailRow
                .removeClass('animated')
                .removeClass('slideInDown')
                .removeClass('slideOutUp');

            if (detailRow.hasClass('hidden')) {
                detailRow
                    .addClass('animated')
                    .addClass('slideInDown')
                    .removeClass('hidden');
            } else {
                detailRow
                    .addClass('animated')
                    .addClass('slideOutUp');
                setTimeout(
                    (): void => { detailRow.addClass('hidden'); },
                    1300
                );
                
            }
           
        }
    }
}