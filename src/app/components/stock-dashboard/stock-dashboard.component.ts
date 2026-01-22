import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult, StockItem, StockSummary } from '../../models/stock.models';
import { StockStoreService } from '../../state/stock-store.service';

@Component({
  selector: 'app-stock-dashboard',
  templateUrl: './stock-dashboard.component.html',
  styleUrls: ['./stock-dashboard.component.scss']
})
export class StockDashboardComponent {
  readonly itemsPage$: Observable<PagedResult<StockItem>> = this.store.itemsPage$;
  readonly items$: Observable<StockItem[]> = this.store.items$;
  readonly summary$: Observable<StockSummary> = this.store.summary$;
  readonly loading$: Observable<boolean> = this.store.loading$;
  readonly expandedItemId$ = this.store.expandedItemId$;

  readonly categories = ['TODOS', 'LATICÍNIOS', 'HORTIFRUTI'];

  constructor(private readonly store: StockStoreService) {}

  onQueryChange(query: string) {
    this.store.setQuery(query);
  }

  onCategoryChange(category: string) {
    if (category === 'TODOS') {
      this.store.setCategories([]);
      return;
    }

    const normalized = category.charAt(0) + category.slice(1).toLowerCase();
    this.store.setCategories([normalized]);
  }

  onToggleExpand(itemId: string) {
    this.store.toggleExpand(itemId);
    this.store.loadBatchesIfNeeded(itemId);
  }

  onPageChange(page: number) {
    this.store.setPage(page);
  }
}
