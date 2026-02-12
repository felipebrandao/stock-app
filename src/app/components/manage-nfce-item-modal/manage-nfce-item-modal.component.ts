import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { NfceImportReviewItemResponse } from '../../models/nfce.models';
import { ProductResponse, LocationResponse } from '../../models/stock.models';
import { NfceItemContext } from '../add-item-modal/add-item-modal.component';
import { ProductsService } from '../../services/products.service';
import { LocationsService } from '../../services/locations.service';
import { DropdownItem } from '../searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-manage-nfce-item-modal',
  templateUrl: './manage-nfce-item-modal.component.html',
  styleUrls: ['./manage-nfce-item-modal.component.scss']
})
export class ManageNfceItemModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() item: NfceImportReviewItemResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<any>();

  quantity = 1;
  unit = 'un';
  locationId = '';
  expiryDate = '';
  status = 'CLOSED';

  products: ProductResponse[] = [];
  selectedProduct: ProductResponse | null = null;
  isLoadingProducts = false;

  locations: LocationResponse[] = [];
  selectedLocation: LocationResponse | null = null;
  isLoadingLocations = false;

  selectedUnit: { value: string; label: string } | null = null;

  isAddItemModalOpen = false;
  nfceItemContext?: NfceItemContext;

  constructor(
    private productsService: ProductsService,
    private locationsService: LocationsService
  ) {}

  get productDropdownItems(): DropdownItem[] {
    return this.products.map(p => ({ id: p.id, name: p.name }));
  }

  get selectedProductDropdownItem(): DropdownItem | null {
    return this.selectedProduct ? { id: this.selectedProduct.id, name: this.selectedProduct.name } : null;
  }

  get locationDropdownItems(): DropdownItem[] {
    return this.locations.map(l => ({
      id: l.id,
      name: l.name,
      description: l.description
    }));
  }

  get selectedLocationDropdownItem(): DropdownItem | null {
    return this.selectedLocation ? {
      id: this.selectedLocation.id,
      name: this.selectedLocation.name,
      description: this.selectedLocation.description
    } : null;
  }

  get unitDropdownItems(): DropdownItem[] {
    return this.units.map(u => ({
      id: u.value,
      name: u.value.toUpperCase(),
      description: u.label
    }));
  }

  get selectedUnitDropdownItem(): DropdownItem | null {
    if (!this.selectedUnit) return null;
    return {
      id: this.selectedUnit.value,
      name: this.selectedUnit.value.toUpperCase(),
      description: this.selectedUnit.label
    };
  }

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

  ngOnInit() {
    this.loadProducts();
    this.loadLocations();
    this.selectedUnit = this.units.find(u => u.value === this.unit) || this.units[0];
  }

  ngOnChanges() {
    if (this.item) {
      this.quantity = this.item.quantity || 1;
      this.unit = this.item.unit || 'un';
      // Atualiza a unidade selecionada
      this.selectedUnit = this.units.find(u => u.value === this.unit) || this.units[0];
    }
  }

  loadProducts() {
    this.isLoadingProducts = true;
    this.productsService.getProducts(0, 100).subscribe({
      next: (response) => {
        this.products = response.content;
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.isLoadingProducts = false;
      }
    });
  }

  loadLocations() {
    this.isLoadingLocations = true;
    this.locationsService.getLocations(0, 100).subscribe({
      next: (response) => {
        this.locations = response.content.filter(loc => loc.active);
        this.isLoadingLocations = false;
      },
      error: (error) => {
        console.error('Erro ao carregar locais:', error);
        this.isLoadingLocations = false;
      }
    });
  }

  onProductSelected(item: DropdownItem) {
    this.selectedProduct = this.products.find(p => p.id === item.id) || null;
  }

  onLocationSelected(item: DropdownItem) {
    this.selectedLocation = this.locations.find(l => l.id === item.id) || null;
    this.locationId = item.id;
  }

  onUnitSelected(item: DropdownItem) {
    this.selectedUnit = this.units.find(u => u.value === item.id) || null;
    this.unit = item.id; // Mantém compatibilidade com código existente
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  onConfirm() {
    const data = {
      itemId: this.item?.id,
      productId: this.selectedProduct?.id,
      productName: this.selectedProduct?.name,
      quantity: this.quantity,
      unit: this.unit,
      locationId: this.locationId,
      expiryDate: this.expiryDate,
      status: this.status
    };
    this.confirm.emit(data);
    this.resetForm();
  }

  resetForm() {
    this.selectedProduct = null;
    this.selectedLocation = null;
    this.selectedUnit = this.units.find(u => u.value === 'un') || this.units[0];
    this.quantity = 1;
    this.unit = 'un';
    this.locationId = '';
    this.expiryDate = '';
    this.status = 'CLOSED';
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

  onAddNewItemFromDropdown(searchTerm: string) {
    if (this.item) {
      this.nfceItemContext = {
        description: searchTerm || this.item.description,
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
    this.products.push(product);
    this.selectedProduct = product;
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
