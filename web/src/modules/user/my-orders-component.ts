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
                    }
                })
            }
        });
    }

    private _display(): void {
        const body: JQuery = $('#my-orders-table tbody');

        this.orders.forEach((order) => {
            let tr: JQuery = $('<tr>');

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
        });
    }
}