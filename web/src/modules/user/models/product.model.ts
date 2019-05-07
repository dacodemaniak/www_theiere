export class ProductModel {
    private id: number;
    private priceHT: number;
    private quantity: number;
    private servingSize: string;
    private title: string;
    private carrier: string;
    private carryingType: string;

    public deserialize(data: any): ProductModel {
        this.title = data.product.title.fr;
        this.id = data.id;
        this.quantity = data.quantity;

        return this;
    }
}