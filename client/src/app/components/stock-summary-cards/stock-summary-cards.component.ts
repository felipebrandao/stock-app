import { Component, Input } from '@angular/core';
import { StockSummary } from '../../models/stock.models';

@Component({
  selector: 'app-stock-summary-cards',
  templateUrl: './stock-summary-cards.component.html',
  styleUrls: ['./stock-summary-cards.component.scss']
})
export class StockSummaryCardsComponent {
  @Input() summary: StockSummary | null = null;
}
