import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderComponent } from './add-order/add-order.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  constructor(private dialog: MatDialog) {}

  onAddOrder() {
    this.dialog.open(AddOrderComponent, { width: '550px' });
  }
}
