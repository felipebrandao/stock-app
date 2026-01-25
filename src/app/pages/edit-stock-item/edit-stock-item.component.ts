import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-stock-item',
  templateUrl: './edit-stock-item.component.html',
  styleUrls: ['./edit-stock-item.component.scss']
})
export class EditStockItemComponent implements OnInit {
  itemId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.params['id'] || '';
  }
}
