import { Component, Input } from '@angular/core';
import { StockBatch } from '../../models/stock.models';

@Component({
  selector: 'app-stock-batch-detail',
  templateUrl: './stock-batch-detail.component.html',
  styleUrls: ['./stock-batch-detail.component.scss']
})
export class StockBatchDetailComponent {
  @Input() batches: StockBatch[] = [];
}
