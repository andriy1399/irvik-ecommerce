import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductTranslate } from 'src/app/shared/models/product-translate.model';
import { IProduct } from '../../shared/interfaces/product.interface';
import { BasketService } from '../../shared/services/basket.service';

@Component({
  selector: 'app-bag',
  templateUrl: './bag.component.html',
  styleUrls: ['./bag.component.scss'],
})
export class BagComponent implements OnInit {
  percent!: string;
  orders: IProduct[] = [];
  constructor(
    private basketService: BasketService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getOrders();
    setTimeout(() => {
      if (this.orders.length) {
        const translatedProducts = new ProductTranslate(
          this.orders,
          this.translate
        );
        translatedProducts.prepareToTranslate();
      }
    }, 300);
    this.basketService.count.subscribe(() => {
      this.getOrders();
      this.basketService.basketTotalPrice.next(
        this.basketService.sumPriceOfOrders()
      );
    });
  }

  private getOrders(): void {
    this.orders = this.basketService.orders;
  }
  public deleteOrder(id: string | number | undefined): void {
    if (id) {
      this.basketService.deleteOrder(id);
      this.getOrders();
      this.basketService.basketTotalPrice.next(
        this.basketService.sumPriceOfOrders()
      );
    }
  }
  incrementOrderCount(order: IProduct): void {
    order.count++;
    this.checkCount(order);
  }

  decrementOrderCount(order: IProduct): void {
    order.count--;
    this.checkCount(order);
  }
  private changeCount(order: IProduct): void {
    if (order.discount && order.discountPercent) {
      const priceWithDiscount =
        order.price - (order.price * parseFloat(order.discountPercent)) / 100;
      order.totalPrice = priceWithDiscount * order.count;
    } else {
      order.totalPrice = order.price * order.count;
    }

    const orderIndex = this.orders.findIndex((o) => o.id === order.id);
    this.orders.splice(orderIndex, 1, order);

    localStorage.setItem('orders', JSON.stringify(this.orders));
  }
  public parse(str: string): number {
    if (typeof parseFloat(str) === 'number') {
      return parseFloat(str);
    } else {
      return 0;
    }
  }

  public checkCount(order: IProduct): void {
    if (order && order.count <= 0) {
      order.count = 1;
    }
    if (order && order.count >= 10000) {
      order.count = 10000;
    }

    this.changeCount(order);
    this.basketService.count.next('changed count');
  }
  public convertToSnakeCase(str: string): string {
    return str.split(' ').join('_');
  }
}
