import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-stock-item',
  templateUrl: './add-stock-item.component.html',
  styleUrls: ['./add-stock-item.component.scss']
})
export class AddStockItemComponent implements OnInit {
  itemId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.params['id'] || '';
  }
}
