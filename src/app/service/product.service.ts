import { Injectable } from '@angular/core';
import { MProduct } from '../model/product.model';
import { MOrder } from '../model/order.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productsChanged = new Subject<MProduct[]>();
  orderChanged = new Subject<MOrder[]>();
  constructor() {}
}
