import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropdownManagerService } from '../../services/dropdown-manager.service';

export interface DropdownItem {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-searchable-dropdown',
  templateUrl: './searchable-dropdown.component.html',
  styleUrls: ['./searchable-dropdown.component.scss']
})
export class SearchableDropdownComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: DropdownItem[] = [];
  @Input() selectedItem: DropdownItem | null = null;
  @Input() placeholder: string = 'Selecionar...';
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() isLoading: boolean = false;
  @Input() emptyMessage: string = 'Nenhum item encontrado';
  @Input() showDescription: boolean = false;
  @Input() disabled: boolean = false;
  @Input() cssClass: string = '';

  @Output() itemSelected = new EventEmitter<DropdownItem>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() addNewItem = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  isOpen = false;
  searchTerm = '';
  filteredItems: DropdownItem[] = [];

  private dropdownId: string;
  private closeSubscription?: Subscription;
  private documentClickListener?: EventListener;

  constructor(private dropdownManager: DropdownManagerService) {
    this.dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
  }

  ngOnInit() {
    this.filteredItems = this.items;

    this.closeSubscription = this.dropdownManager.closeDropdown$.subscribe(
      (dropdownIdToClose) => {
        if (dropdownIdToClose === this.dropdownId && this.isOpen) {
          this.isOpen = false;
        }
      }
    );
  }

  ngOnChanges() {
    if (this.searchTerm) {
      this.filterItems();
    } else {
      this.filteredItems = this.items;
    }
  }

  toggleDropdown() {
    if (this.disabled) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.dropdownManager.openDropdown(this.dropdownId);

      this.searchTerm = '';
      this.filteredItems = this.items;

      setTimeout(() => {
        this.addDocumentClickListener();
      }, 100);

      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 100);
    } else {
      this.removeDocumentClickListener();
      this.dropdownManager.closeDropdown(this.dropdownId);
    }
  }

  /**
   * Adiciona listener para detectar cliques fora do dropdown
   */
  private addDocumentClickListener() {
    // Remove listener anterior se existir
    this.removeDocumentClickListener();

    this.documentClickListener = (event: Event) => {
      const target = event.target as HTMLElement;
      const clickedInside = target.closest('.searchable-dropdown');

      if (!clickedInside && this.isOpen) {
        this.isOpen = false;
        this.dropdownManager.closeDropdown(this.dropdownId);
        this.removeDocumentClickListener();
      }
    };

    // Usa fase de bolha para permitir que o clique no item selecione primeiro.
    document.addEventListener('click', this.documentClickListener as EventListener, false);
  }

  /**
   * Remove listener de cliques do documento
   */
  private removeDocumentClickListener() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener as EventListener, false);
      this.documentClickListener = undefined;
    }
  }

  /**
   * Filtra itens conforme busca
   */
  onSearchChange() {
    this.searchChanged.emit(this.searchTerm);
    this.filterItems();
  }

  /**
   * Filtra itens localmente
   */
  private filterItems() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredItems = this.items;
      return;
    }

    this.filteredItems = this.items.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(term);
      const descMatch = this.showDescription && item.description
        ? item.description.toLowerCase().includes(term)
        : false;
      return nameMatch || descMatch;
    });
  }

  /**
   * Seleciona um item via mousedown (dispara antes do click, evitando conflito com listener global)
   */
  onItemMouseDown(event: MouseEvent, item: DropdownItem) {
    event.preventDefault();
    event.stopPropagation();
    this.selectItem(item);
  }

  /**
   * Seleciona um item
   */
  selectItem(item: DropdownItem) {
    this.itemSelected.emit(item);
    this.isOpen = false;
    this.searchTerm = '';
    this.removeDocumentClickListener();
    this.dropdownManager.closeDropdown(this.dropdownId);
  }

  onAddNewItem(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.addNewItem.emit(this.searchTerm);
    this.isOpen = false;
    this.searchTerm = '';
    this.removeDocumentClickListener();
    this.dropdownManager.closeDropdown(this.dropdownId);
  }
  
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen) {
      this.isOpen = false;
      this.removeDocumentClickListener();
      this.dropdownManager.closeDropdown(this.dropdownId);
    }
  }

  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    this.removeDocumentClickListener();
  }
}
