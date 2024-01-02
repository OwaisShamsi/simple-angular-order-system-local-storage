import { DialogRef } from '@angular/cdk/dialog';

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  MProduct: MProduct;
  productList!: MProduct;
  addForm!: FormGroup;
  orignalQuantity!: number | undefined;

  constructor(
    private productService: ProductService,
    private dialogRef: DialogRef<AddProductComponent>
  ) {
    this.MProduct = new MProduct();
  }
  ngOnInit(): void {}

  getNewProductId() {
    const oldRecords = localStorage.getItem('productList');
    if (oldRecords !== null) {
      const productList = JSON.parse(oldRecords);
      return productList.length + 1;
    } else {
      return 1;
    }
  }

  onFormSubmit() {
    const latestId = this.getNewProductId();
    this.MProduct.id = latestId;
    const oldRecords = localStorage.getItem('productList');
    if (oldRecords !== null) {
      const productList = JSON.parse(oldRecords!);
      this.orignalQuantity = this.MProduct.quantity;
      console.log(this.orignalQuantity);

      productList.push(this.MProduct);
      localStorage.setItem('productList', JSON.stringify(productList));
      this.productService.productsChanged.next(productList);
    } else {
      const productArr = [];
      productArr.push(this.MProduct);
      localStorage.setItem('productList', JSON.stringify(productArr));
    }
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
