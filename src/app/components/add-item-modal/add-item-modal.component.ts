import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { CategoryResponse, CreateProductRequest, ProductResponse } from '../../models/stock.models';
import { ItemRegistrationResult, ResultModalType } from '../item-registration-result-modal/item-registration-result-modal.component';
import { DropdownItem } from '../searchable-dropdown/searchable-dropdown.component';

export interface NewItemData {
  name: string;
  categoryId: string;
  unit: string;
  minStock?: number;
}

export interface NfceItemContext {
  description: string;
  unit?: string;
  quantity?: number;
}

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss']
})
export class AddItemModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() nfceContext?: NfceItemContext;
  @Output() close = new EventEmitter<void>();
  @Output() itemCreated = new EventEmitter<ProductResponse>();

  itemName = '';
  selectedCategoryId = '';
  selectedUnit = '';
  minStock?: number;

  categories: CategoryResponse[] = [];
  categoryDropdownItems: DropdownItem[] = [];
  selectedCategoryDropdownItem: DropdownItem | null = null;
  isLoadingCategories = false;
  units = [
    { value: 'UN', label: 'UN (Unidade)' },
    { value: 'L', label: 'L (Litro)' },
    { value: 'KG', label: 'KG (Quilograma)' },
    { value: 'CX', label: 'CX (Caixa)' },
    { value: 'G', label: 'G (Grama)' },
    { value: 'ML', label: 'ML (Mililitro)' },
    { value: 'PCT', label: 'PCT (Pacote)' }
  ];

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  showResultModal = false;
  resultModalType: ResultModalType = 'success';
  resultModalData?: ItemRegistrationResult;

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    if (this.nfceContext) {
      this.itemName = this.formatSuggestedName(this.nfceContext.description);
      if (this.nfceContext.unit) {
        this.selectedUnit = this.nfceContext.unit.toUpperCase();
      }
    }
  }

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.categoriesService.getCategories(0, 100).subscribe({
      next: (response) => {
        this.categories = response.content;
        this.categoryDropdownItems = response.content.map(cat => ({
          id: cat.id,
          name: cat.name
        }));
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Erro ao carregar categorias';
        this.isLoadingCategories = false;
      }
    });
  }

  formatSuggestedName(description: string): string {
    return description
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onCategorySelected(item: DropdownItem): void {
    this.selectedCategoryDropdownItem = item;
    this.selectedCategoryId = item.id;
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const request: CreateProductRequest = {
      name: this.itemName.trim(),
      categoryId: this.selectedCategoryId
    };

    this.productsService.createProduct(request).subscribe({
      next: (product) => {
        this.isSaving = false;

        this.resultModalType = this.nfceContext ? 'success-with-link' : 'success';
        this.resultModalData = {
          itemName: product.name,
          linkedToImport: !!this.nfceContext
        };
        this.showResultModal = true;

        this.itemCreated.emit(product);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.isSaving = false;

        this.resultModalType = 'error';
        this.resultModalData = {
          itemName: this.itemName.trim()
        };
        this.showResultModal = true;
      }
    });
  }

  isFormValid(): boolean {
    return !!(this.itemName.trim() && this.selectedCategoryId && this.selectedUnit);
  }

  resetForm(): void {
    this.itemName = '';
    this.selectedCategoryId = '';
    this.selectedCategoryDropdownItem = null;
    this.selectedUnit = '';
    this.minStock = undefined;
    this.errorMessage = '';
  }

  onResultModalClose(): void {
    this.showResultModal = false;

    if (this.resultModalType !== 'error') {
      this.resetForm();
      this.close.emit();
    }
  }

  onResultModalContinue(): void {
    this.showResultModal = false;
    this.resetForm();
    this.close.emit();
  }

  onResultModalRetry(): void {
    this.showResultModal = false;
  }
}
