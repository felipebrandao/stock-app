import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NfceImportReviewItemResponse } from '../../models/nfce.models';
import { ProductResponse } from '../../models/stock.models';
import { NfceItemContext } from '../add-item-modal/add-item-modal.component';

@Component({
  selector: 'app-manage-nfce-item-modal',
  templateUrl: './manage-nfce-item-modal.component.html',
  styleUrls: ['./manage-nfce-item-modal.component.scss']
})
export class ManageNfceItemModalComponent {
  @Input() isOpen = false;
  @Input() item: NfceImportReviewItemResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<any>();

  productSearch = '';
  quantity = 1;
  unit = 'un';
  locationId = '';
  expiryDate = '';
  status = 'CLOSED';

  isAddItemModalOpen = false;
  nfceItemContext?: NfceItemContext;

  units = [
    { value: 'un', label: 'Unidade (UN)' },
    { value: 'kg', label: 'Quilograma (KG)' },
    { value: 'cx', label: 'Caixa (CX)' },
    { value: 'pct', label: 'Pacote (PCT)' },
    { value: 'gar', label: 'Garrafa (GAR)' },
    { value: 'lat', label: 'Lata (LAT)' },
    { value: 'l', label: 'Litro (L)' },
    { value: 'g', label: 'Grama (G)' }
  ];

  ngOnChanges() {
    if (this.item) {
      this.quantity = this.item.quantity || 1;
      this.unit = this.item.unit || 'un';
    }
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    const data = {
      itemId: this.item?.id,
      productSearch: this.productSearch,
      quantity: this.quantity,
      unit: this.unit,
      locationId: this.locationId,
      expiryDate: this.expiryDate,
      status: this.status
    };
    this.confirm.emit(data);
  }

  openAddItemModal() {
    if (this.item) {
      this.nfceItemContext = {
        description: this.item.description,
        unit: this.item.unit,
        quantity: this.item.quantity
      };
      this.isAddItemModalOpen = true;
    }
  }

  closeAddItemModal() {
    this.isAddItemModalOpen = false;
    this.nfceItemContext = undefined;
  }

  onItemCreated(product: ProductResponse) {
    console.log('Novo produto criado:', product);
    this.productSearch = product.name;
    this.closeAddItemModal();
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  getPreviewText(): string {
    if (!this.item) return '';
    return `Serão adicionados ${this.quantity} itens de ${this.item.description} como ${this.getUnitLabel(this.unit)} ao estoque.`;
  }

  getUnitLabel(value: string): string {
    const unit = this.units.find(u => u.value === value);
    return unit ? unit.label : value;
  }
}
