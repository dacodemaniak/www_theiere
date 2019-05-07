import { StringToNumberHelper } from './../../../helpers/string-to-number.helper';
import * as moment from 'moment';
import { ProductModel } from './product.model';


export class OrderModel {
    private id: number;
    private reference: string;
    private convertDate: moment;
    private convertTime: moment;
    private paymentMode: string;
    private fullTaxTotal: number;
    private carrier: string;
    private carryingType: string;
    private basket: Array<ProductModel> = new Array<ProductModel>();

    public getId(): string {
        return this.id.toString();
    }

    public getConvertDate(): string {
        return this.convertDate.format('DD-MM-YYYY');
    }

    public getRefence(): string {
        return this.reference;
    }

    public getFullTaxTotal(): string {
        return StringToNumberHelper.toCurrency(this.fullTaxTotal.toString());
    }

    public getBasket(): Array<ProductModel> {
        return this.basket;
    }
    public deserialize(data: any): OrderModel {
        // Conversion du content en JSON
        const content = JSON.parse(data.content);
        content.basket.forEach((element: any) => {
            let product: ProductModel = (new ProductModel()).deserialize(element);
            this.basket.push(product);
        });
        this.id = data.id;
        this.reference = data.reference;
        this.convertDate = moment(data.convertDate);
        this.convertTime = moment(data.convertTime);
        this.paymentMode = data.paymentMode;
        this.fullTaxTotal = data.fullTaxTotal;

        return this;
    }
}