import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() categories: string[] = ['TODOS'];

  @Output() queryChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();

  query = '';
  selectedCategory = 'TODOS';

  setCategory(c: string) {
    this.selectedCategory = c;
    this.categoryChange.emit(c);
  }

  onQueryInput(value: string) {
    this.query = value;
    this.queryChange.emit(value);
  }
}
