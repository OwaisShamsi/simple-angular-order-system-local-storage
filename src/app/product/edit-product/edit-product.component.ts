import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  i: number = this.data.index;
  name: string = this.data.name;

  MProduct: MProduct;

  constructor(
    private dialogRef: DialogRef<EditProductComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.MProduct = new MProduct();
  }

  ngOnInit(): void {
    this.getCurrentProduct();
    // console.log(this.data);
  }

  getCurrentProduct() {
    const oldRecords = localStorage.getItem('productList');
    if (oldRecords !== null) {
      const productList = JSON.parse(oldRecords);
      // console.log(this.i);
      const currentProduct = productList.find((m: any) => m.name == this.name);
      if (currentProduct !== undefined) {
        // this.MProduct.id = currentProduct.id;
        this.MProduct.name = currentProduct.name;
        this.MProduct.description = currentProduct.description;
        this.MProduct.quantity = currentProduct.quantity;
        this.MProduct.amount = currentProduct.amount;
      }
    }
  }

  onEditSubmit() {
    const oldRecords = localStorage.getItem('productList');
    if (oldRecords !== null) {
      const productList = JSON.parse(oldRecords);
      const currentList = productList.find((a: any) => a.name === this.name);
      if (currentList !== null) {
        currentList.name = this.MProduct.name;
        currentList.description = this.MProduct.description;
        currentList.quantity = this.MProduct.quantity;
        currentList.amount = this.MProduct.amount;
      }
      localStorage.setItem('productList', JSON.stringify(productList));
      this.productService.productsChanged.next(productList);
      this.dialogRef.close();
    }
  }

  onCancel() {
    // console.log(this.i);
    this.dialogRef.close();
  }
}
