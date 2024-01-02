import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { addProduct } from 'src/app/model/addProduct.model';

import { MOrder } from 'src/app/model/order.model';
import { MProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
})
export class EditOrderComponent implements OnInit {
  i: number = this.data.index;
  name: string = this.data.customer_Name;

  MOrder: MOrder;
  products: MProduct[] = [];
  dataArray: any = [];
  addProduct = new addProduct();

  constructor(
    private dialogRef: DialogRef<EditOrderComponent>,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.MOrder = new MOrder();
  }
  ngOnInit(): void {
    this.getCurrentProduct();
    const records = localStorage.getItem('productList');
    if (records !== null) {
      this.products = JSON.parse(records);
    }
  }

  getCurrentProduct() {
    debugger;
    const oldRecords = localStorage.getItem('orderList');
    const orderList = JSON.parse(oldRecords!);
    const currentOrder = orderList.find((m: any) => m.id == this.i + 1);

    if (oldRecords !== null) {
      // console.log(this.i);
      if (currentOrder !== undefined) {
        // this.MOrder.id = currentOrder.id;
        this.MOrder.customer_Name = currentOrder.customer_Name;
        this.MOrder.purchased_Date = currentOrder.purchased_Date;
        this.MOrder.delivery_date = currentOrder.delivery_date;
      }
    }
    for (let i = 0; i < currentOrder.product_Name.length; i++) {
      this.addProduct = new addProduct();
      this.dataArray.push(this.addProduct);

      this.dataArray[i].quantity = currentOrder.quantity[i];
      this.addProduct.product_Name = currentOrder.product_Name[i];
      // console.log(this.dataArray[i]);
    }
  }

  onAddProduct() {
    debugger;
    this.addProduct = new addProduct();
    this.dataArray.push(this.addProduct);
  }

  onRemoveProduct(index: number) {
    debugger;
    console.log(this.dataArray[index]);
    let previousProductName = this.dataArray[index].product_Name;
    let previousProductQuantity = this.dataArray[index].quantity;
    console.log(previousProductName);

    this.dataArray.splice(index, 1);
    const orderList = JSON.parse(localStorage.getItem('orderList')!);
    const productList = JSON.parse(localStorage.getItem('productList')!);
    let currentOrder = orderList.find((m: any) => m.id == this.i + 1);
    currentOrder.product_Name.splice(index, 1);
    currentOrder.quantity.splice(index, 1);
    console.log(currentOrder);

    const currentProduct = productList.find(
      (p: any) => p.name == previousProductName
    );
    console.log(currentProduct);

    currentProduct.quantity += previousProductQuantity;
    // currentOrder.splice(index, 1);
    localStorage.setItem('productList', JSON.stringify(productList));
    localStorage.setItem('orderList', JSON.stringify(orderList));
    this.productService.orderChanged.next(orderList);

    console.log(currentOrder);
  }

  onEditSubmit() {
    debugger;

    const orderList = JSON.parse(localStorage.getItem('orderList')!);
    const productList = JSON.parse(localStorage.getItem('productList')!);
    const currentOrder = orderList.find((m: any) => m.id == this.i + 1);
    for (let i = 0; i < this.dataArray.length; i++) {
      let previousOrderName = currentOrder.product_Name[i];
      if (previousOrderName != undefined) {
        let previousOrderQuantity = currentOrder.quantity[i];
        const previousProduct = productList.find(
          (p: any) => p.name == previousOrderName
        );
        previousProduct.quantity += previousOrderQuantity;
        console.log(previousProduct);
      }

      const currentProduct = productList.find(
        (p: any) => p.name == this.dataArray[i].product_Name
      );
      if (this.dataArray[i].quantity <= currentProduct.quantity) {
        currentProduct.quantity -= this.dataArray[i].quantity;
        localStorage.setItem('productList', JSON.stringify(productList));
        console.log(currentProduct);
        //for order list
        const currentList = orderList.find(
          (a: any) => a.customer_Name === this.name
        );
        if (currentList !== null) {
          currentList.customer_Name = this.MOrder.customer_Name;
          currentList.purchased_Date = this.MOrder.purchased_Date;
          currentList.delivery_date = this.MOrder.delivery_date;
          currentList.quantity[i] = this.dataArray[i].quantity;
          currentList.product_Name[i] = this.dataArray[i].product_Name;
        }
        localStorage.setItem('orderList', JSON.stringify(orderList));
        this.productService.orderChanged.next(orderList);
        this.dialogRef.close();
        console.log(orderList);
        console.log(productList);
      } else {
        this.snackBar.open(
          currentProduct.name +
            ' Not Added Max Qtn is ' +
            currentProduct.quantity,
          'GOT IT!',
          {
            duration: 4000,
          }
        );
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
