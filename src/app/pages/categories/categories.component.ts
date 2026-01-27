import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { CategoryResponse, CreateCategoryRequest } from '../../models/stock.models';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  newCategoryName = '';
  categories: CategoryResponse[] = [];
  isLoading = false;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoriesService.getCategories(0, 100).subscribe({
      next: (response) => {
        this.categories = response.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.isLoading = false;
      }
    });
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.isLoading = true;
    const req: CreateCategoryRequest = { name: this.newCategoryName.trim() };
    this.categoriesService.createCategory(req).subscribe({
      next: (created) => {
        this.categories.push(created);
        this.newCategoryName = '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao criar categoria:', err);
        this.isLoading = false;
      }
    });
  }

  deleteCategory(categoryId: string): void {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    this.isLoading = true;
    this.categoriesService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== categoryId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao excluir categoria:', err);
        alert('Erro ao excluir categoria. Pode haver itens vinculados a esta categoria.');
        this.isLoading = false;
      }
    });
  }
}
