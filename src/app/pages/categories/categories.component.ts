import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  newCategoryName = '';
  categories = [
    'Alimentos Não Perecíveis',
    'Produtos de Limpeza',
    'Higiene Pessoal',
    'Bebidas',
    'Pet Shop',
    'Ferramentas e Manutenção',
    'Laticínios',
    'Hortifruti',
    'Grãos e Farinhas'
  ];

  addCategory(): void {
    if (this.newCategoryName.trim()) {
      this.categories.push(this.newCategoryName.trim());
      this.newCategoryName = '';
    }
  }

  deleteCategory(category: string): void {
    const index = this.categories.indexOf(category);
    if (index > -1) {
      this.categories.splice(index, 1);
    }
  }
}
