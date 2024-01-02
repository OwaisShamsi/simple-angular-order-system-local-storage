import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { addProduct } from 'src/app/model/addProduct.model';
import { MOrder } from 'src/app/model/order.model';
import { MProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
})
export class AddOrderComponent implements OnInit {
  MOrder: MOrder;
  products: MProduct[] = [];
  dataArray: any = [];
  addProduct = new addProduct();

  constructor(
    private dialogRef: DialogRef<AddOrderComponent>,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.MOrder = new MOrder();
  }

  ngOnInit(): void {
    const records = localStorage.getItem('productList');
    if (records !== null) {
      this.products = JSON.parse(records);
    }
    this.dataArray.push(this.addProduct);
  }

  getNewOrderId() {
    const oldRecords = localStorage.getItem('orderList');
    if (oldRecords !== null) {
      const orderList = JSON.parse(oldRecords);
      return orderList.length + 1;
    } else {
      return 1;
    }
  }

  onOrderSubmit() {
    const orderList = JSON.parse(localStorage.getItem('orderList')!);
    if(!orderList){
      localStorage.setItem('orderList', JSON.stringify([]));
    }
    const productList = JSON.parse(localStorage.getItem('productList')!);
    for (let i = 0; i < this.dataArray.length; i++) {
      debugger;

      let selectedProduct = this.dataArray[i].product_Name;
      const currentProduct = productList.find(
        (p: any) => p.name == selectedProduct
      );
      if (orderList) {
        if (this.dataArray[i].quantity <= currentProduct.quantity) {
          currentProduct.quantity =
            currentProduct.quantity - this.dataArray[i].quantity;
          localStorage.setItem('productList', JSON.stringify(productList));
          // console.log(currentProduct.quantity);

          const latestId = this.getNewOrderId();
          this.MOrder.id = latestId;
          // this.MOrder.product_Name.push('asda');
          this.MOrder.product_Name.push(this.dataArray[i].product_Name);
          this.MOrder.quantity.push(this.dataArray[i].quantity);
          console.log(this.MOrder.product_Name);
          console.log(this.MOrder.quantity);

          // console.log(this.MOrder.product_Name);

          // this.MOrder.product_Name = this.dataArray[i].product_Name;
          // this.MOrder.quantity = this.dataArray[i].quantity;
          // console.log(this.MOrder);

          console.log(this.dataArray[i]);

          this.productService.orderChanged.next(orderList);
        } else {
          this.snackBar.open(
            ' Not Added Max Qtn for ' +
              this.dataArray[i].product_Name +
              ' is ' +
              currentProduct.quantity,
            'GOT IT!',
            {
              duration: 3000,
            }
          );
          break;
          // alert('Max Quantity available is ' + currentProduct.quantity);
        }
      }
      // } else {
      //   if (this.MOrder.quantity! <= currentProduct.quantity) {
      //     const orderArr = [];
      //     orderArr.push(this.MOrder);
      //     localStorage.setItem('orderList', JSON.stringify(orderArr));
      //     this.productService.orderChanged.next(orderArr);
      //     this.dialogRef.close();
      //   }
      // }
    }
    orderList.push(this.MOrder);
    localStorage.setItem('orderList', JSON.stringify(orderList));
    this.dialogRef.close();
  }

  onAddProduct() {
    this.addProduct = new addProduct();
    this.dataArray.push(this.addProduct);
  }

  onRemoveProduct(index: number) {
    // console.log(index);
    // console.log(this.dataArray[index]);

    this.dataArray.splice(index, 1);
  }

  onValChange(event: any) {
    console.log(event);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
