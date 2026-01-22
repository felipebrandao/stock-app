import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 10;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    const size = Math.max(1, this.pageSize || 1);
    return Math.max(1, Math.ceil((this.total || 0) / size));
  }

  get canGoPrev(): boolean {
    return (this.page || 1) > 1;
  }

  get canGoNext(): boolean {
    return (this.page || 1) < this.totalPages;
  }

  prev() {
    if (!this.canGoPrev) return;
    this.pageChange.emit((this.page || 1) - 1);
  }

  next() {
    if (!this.canGoNext) return;
    this.pageChange.emit((this.page || 1) + 1);
  }
}
