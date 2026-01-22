import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, switchMap, tap } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { PagedResult, StockBatch, StockFilter, StockItem, StockSummary } from '../models/stock.models';
import { StockService } from '../services/stock.service';

const DEFAULT_FILTER: StockFilter = {
  query: '',
  categories: [],
  status: [],
  page: 1,
  pageSize: 50
};

@Injectable({
  providedIn: 'root'
})
export class StockStoreService {
  private readonly filterSubject = new BehaviorSubject<StockFilter>(DEFAULT_FILTER);
  readonly filter$ = this.filterSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly expandedItemIdSubject = new BehaviorSubject<string | null>('milk-1');
  readonly expandedItemId$ = this.expandedItemIdSubject.asObservable();

  readonly itemsPage$: Observable<PagedResult<StockItem>> = this.filter$.pipe(
    tap(() => this.loadingSubject.next(true)),
    switchMap(filter => this.stockService.getItems(filter)),
    tap(() => this.loadingSubject.next(false)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly items$: Observable<StockItem[]> = this.itemsPage$.pipe(map(p => p.items));

  readonly summary$: Observable<StockSummary> = this.stockService.getSummary().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly batchesCacheSubject = new BehaviorSubject<Record<string, StockBatch[]>>({});
  readonly batchesCache$ = this.batchesCacheSubject.asObservable();

  constructor(private readonly stockService: StockService) {}

  setQuery(query: string) {
    const current = this.filterSubject.value;
    this.filterSubject.next({ ...current, query, page: 1 });
  }

  setCategories(categories: string[]) {
    const current = this.filterSubject.value;
    this.filterSubject.next({ ...current, categories, page: 1 });
  }

  setPage(page: number) {
    const current = this.filterSubject.value;
    const nextPage = Math.max(1, Number.isFinite(page as number) ? page : 1);
    this.filterSubject.next({ ...current, page: nextPage });
  }

  toggleExpand(itemId: string) {
    this.expandedItemIdSubject.next(this.expandedItemIdSubject.value === itemId ? null : itemId);
  }

  loadBatchesIfNeeded(itemId: string) {
    const cache = this.batchesCacheSubject.value;
    if (cache[itemId]) return;

    this.stockService.getBatches(itemId).subscribe(batches => {
      this.batchesCacheSubject.next({ ...this.batchesCacheSubject.value, [itemId]: batches });
    });
  }

  batchesForItem$(itemId: string): Observable<StockBatch[]> {
    return this.batchesCache$.pipe(map(cache => cache[itemId] ?? []));
  }

  readonly expandedBatches$ = combineLatest([this.expandedItemId$, this.batchesCache$]).pipe(
    map(([id, cache]) => (id ? cache[id] ?? [] : []))
  );
}
