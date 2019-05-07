export class ProductModel {
    private id: number;
    private priceHT: number;
    private quantity: number;
    private servingSize: string;
    private title: string;

    public getTitle(): string {
        return this.title;
    }

    public getQuantity(): string {
        return this.quantity.toString();
    }

    public getServingSize(): string {
        return this.servingSize;
    }
    
    public deserialize(data: any): ProductModel {
        this.title = data.product.title.fr;
        this.id = data.id;
        this.quantity = data.quantity;

        return this;
    }
}