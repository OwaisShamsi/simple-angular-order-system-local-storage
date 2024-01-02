import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  productList: MProduct[];

  constructor(
    private dialog: MatDialog,
    private productService: ProductService
  ) {
    this.productList = [];
  }

  ngOnInit(): void {
    this.productService.productsChanged.subscribe((products: MProduct[]) => {
      console.log(products);
      this.productList = products;
    });
    const records = localStorage.getItem('productList');
    if (records !== null) {
      this.productList = JSON.parse(records);
    }
  }

  onEdit(i: number) {
    let name = this.productList[i].name;
    this.dialog.open(EditProductComponent, { data: { index: i, name: name } });
  }

  onDelete(id: number) {
    console.log(id);

    const oldRecords = localStorage.getItem('productList');
    if (oldRecords !== null) {
      const productList = JSON.parse(oldRecords);
      productList.splice(
        productList.findIndex((a: any) => a.id == id + 1),
        1
      );
      localStorage.setItem('productList', JSON.stringify(productList));
      this.productService.productsChanged.next(productList);
    }
  }
}
