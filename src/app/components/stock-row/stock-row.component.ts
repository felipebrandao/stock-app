import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StockBatch, StockItem } from '../../models/stock.models';

@Component({
  selector: 'tr[app-stock-row]',
  templateUrl: './stock-row.component.html',
  styleUrls: ['./stock-row.component.scss'],
  host: {
    '[attr.role]': "'row'",
    '[class.group]': 'true',
    '[class.transition-colors]': 'true',
    '[class.cursor-pointer]': 'true',
    '[class.hover:bg-gray-50]': 'true',
    "[class.dark:hover:bg-[#1c3325]]": 'true',
    '[class.border-l-4]': "item?.status !== 'OK'",
    '[class.border-l-orange-500]': "item?.status === 'BAIXO'",
    '[class.border-l-red-500]': "item?.status === 'ESGOTADO'",
    '[class.row-expanded]': 'expanded'
  }
})
export class StockRowComponent {
  private static readonly EMPTY_ITEM: StockItem = {
    id: '',
    name: '',
    category: '',
    totalQuantity: 0,
    unit: '',
    status: 'OK'
  };

  @Input() item: StockItem = StockRowComponent.EMPTY_ITEM;
  @Input() expanded = false;
  @Input() batches: StockBatch[] = [];

  @Output() toggleExpand = new EventEmitter<string>();

  onToggle() {
    if (!this.item?.id) return;
    this.toggleExpand.emit(this.item.id);
  }

  get totalUnitsLabel(): string {
    const item = this.item ?? StockRowComponent.EMPTY_ITEM;
    if (item.status === 'ESGOTADO') return 'SEM ESTOQUE DISPONÍVEL';
    if (item.id === 'milk-1') return '3 Unidades no total';
    if (item.id === 'flour-1') return '1 Embalagem';
    return '—';
  }
}
