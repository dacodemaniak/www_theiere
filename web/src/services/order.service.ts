import { Constants } from './../shared/constants';
import { UserModel } from './../modules/user/models/user.model';
import * as $ from 'jquery';
import { OrderModel } from './../modules/user/models/order.model';

export class OrderService {
    public constructor() {}

    public getOrdersNumber(user: UserModel): Promise<any> {
        const headers: any = {
            'X-Auth-Token': user.getToken()
        };
        return new Promise((resolve) => {
            $.ajax({
                headers: headers,
                url: Constants.apiRoot + 'order/customer/number',
                method: 'get',
                dataType: 'json',
                success: (result) => {
                    resolve(result);
                },
                error: (xhr, error) => {
                    resolve(false);
                }
            })
        });
    }

    public getCustomerOrders(user: UserModel): Promise<any> {
        return new Promise((resolve) => {
            const headers: any = {
                'X-Auth-Token': user.getToken()
            };
            $.ajax({
                headers: headers,
                url: Constants.apiRoot + 'order/customer',
                method: 'get',
                dataType: 'json',
                success: (result: Array<any>) => {
                    const orders: Array<OrderModel> = result.map((order: any) => {
                        return (new OrderModel()).deserialize(order);
                    })
                    resolve(orders);
                },
                error: (xhr, error) => {
                    resolve(false);
                }
            });
        });
    }
}