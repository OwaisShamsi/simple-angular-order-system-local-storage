import { LocalizedString } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MOrder } from 'src/app/model/order.model';
import { MProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';
import { EditOrderComponent } from '../edit-order/edit-order.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  orderList!: MOrder[];
  productList!: MProduct[];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {
    this.orderList = [];
  }

  ngOnInit(): void {
    this.productService.orderChanged.subscribe((orders: MOrder[]) => {
      // console.log(orders);
      this.orderList = orders;
    });
    const records = localStorage.getItem('orderList');
    if (records !== null) {
      this.orderList = JSON.parse(records);
    }
  }

  onEditOrder(i: number) {
    let customer_Name = this.orderList[i].customer_Name;
    this.dialog.open(EditOrderComponent, {
      data: { index: i, customer_Name: customer_Name },
      width: '550px',
    });
  }

  onDeleteOrder(id: number) {
    debugger;
    const orderList = JSON.parse(localStorage.getItem('orderList')!);
    const productList = JSON.parse(localStorage.getItem('productList')!);

    const currentOrder = orderList.find((m: any) => m.id == id + 1);
    for (let i = 0; i < currentOrder.quantity.length; i++) {
      const currentProduct = productList.find(
        (p: any) => p.name == currentOrder.product_Name[i]
      );
      currentProduct.quantity =
        currentProduct.quantity + currentOrder.quantity[i];
      // console.log(currentProduct.name);
      // console.log(currentProduct.quantity);
    }
    this.orderList = orderList;
    if (orderList !== null) {
      orderList.splice(
        orderList.findIndex((a: any) => a.id == id + 1),
        1
      );
      // currentProduct.quantity = currentProduct.quantity + currentOrder.quantity;
      localStorage.setItem('orderList', JSON.stringify(orderList));
      localStorage.setItem('productList', JSON.stringify(productList));
      this.productService.orderChanged.next(orderList);
    }
  }
}
