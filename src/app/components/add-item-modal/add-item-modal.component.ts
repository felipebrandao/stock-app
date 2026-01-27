import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { CategoryResponse, CreateProductRequest, ProductResponse } from '../../models/stock.models';

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
    this.isLoading = true;
    this.categoriesService.getCategories(0, 100).subscribe({
      next: (response) => {
        this.categories = response.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Erro ao carregar categorias';
        this.isLoading = false;
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
        this.itemCreated.emit(product);
        this.resetForm();
        this.close.emit();
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.errorMessage = 'Erro ao criar produto. Tente novamente.';
        this.isSaving = false;
      }
    });
  }

  isFormValid(): boolean {
    return !!(this.itemName.trim() && this.selectedCategoryId && this.selectedUnit);
  }

  resetForm(): void {
    this.itemName = '';
    this.selectedCategoryId = '';
    this.selectedUnit = '';
    this.minStock = undefined;
    this.errorMessage = '';
  }
}
