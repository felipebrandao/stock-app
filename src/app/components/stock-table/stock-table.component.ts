import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { StockBatch, StockItem } from '../../models/stock.models';
import { StockStoreService } from '../../state/stock-store.service';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss']
})
export class StockTableComponent {
  @Input() items: StockItem[] = [];
  @Input() expandedItemId: string | null = null;
  @Input() loading = false;

  @Output() toggleExpand = new EventEmitter<string>();

  readonly expandedBatches$: Observable<StockBatch[]> = this.store.expandedItemId$.pipe(
    switchMap(id => (id ? this.store.batchesForItem$(id) : of([])))
  );

  constructor(private readonly store: StockStoreService) {}

  onToggle(itemId: string) {
    this.toggleExpand.emit(itemId);
  }

  batchesForRow(itemId: string, expandedBatches: StockBatch[]): StockBatch[] {
    return this.expandedItemId === itemId ? expandedBatches : [];
  }

  statusBadgeClass(status: StockItem['status']): string {
    switch (status) {
      case 'BAIXO':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-800';
      case 'ESGOTADO':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800';
      case 'VALIDADE_PROXIMA':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800';
      case 'OK':
      default:
        return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-800';
    }
  }

  statusCardBorderClass(status: StockItem['status']): string {
    switch (status) {
      case 'BAIXO':
        return 'border-l-orange-500';
      case 'ESGOTADO':
        return 'border-l-red-500 opacity-75';
      case 'VALIDADE_PROXIMA':
        return 'border-l-blue-500';
      case 'OK':
      default:
        return 'border-l-green-500';
    }
  }

  categoryBadgeClass(category: string): string {
    switch (category) {
      case 'Laticínios':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Grãos':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Temperos':
        return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  }

  batchIcon(label: string): string {
    const normalized = (label || '').toLowerCase();
    if (normalized.includes('em uso')) return 'label';
    return 'inventory_2';
  }

  batchToneClass(label: string): string {
    const normalized = (label || '').toLowerCase();
    if (normalized.includes('em uso')) return 'text-purple-500';
    return 'text-gray-400';
  }

  batchTitleClass(label: string): string {
    const normalized = (label || '').toLowerCase();
    if (normalized.includes('em uso')) return 'text-purple-600 dark:text-purple-400';
    return 'text-gray-500 dark:text-gray-400';
  }

  isDangerExpiry(tone: string): boolean {
    return tone === 'danger';
  }
}
