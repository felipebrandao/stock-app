import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ResultModalType = 'success' | 'success-with-link' | 'error';

export interface ItemRegistrationResult {
  itemName: string;
  message?: string;
  linkedToImport?: boolean;
}

@Component({
  selector: 'app-item-registration-result-modal',
  templateUrl: './item-registration-result-modal.component.html',
  styleUrls: ['./item-registration-result-modal.component.scss']
})
export class ItemRegistrationResultModalComponent {
  @Input() isOpen = false;
  @Input() type: ResultModalType = 'success';
  @Input() result?: ItemRegistrationResult;
  @Output() close = new EventEmitter<void>();
  @Output() continue = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  get title(): string {
    return this.type === 'error'
      ? 'Erro ao Cadastrar Item'
      : 'Item Cadastrado com Sucesso!';
  }

  get icon(): string {
    return this.type === 'error' ? 'cancel' : 'check_circle';
  }

  get iconColor(): string {
    return this.type === 'error'
      ? 'text-red-600 dark:text-red-500'
      : 'text-primary';
  }

  get iconBgColor(): string {
    return this.type === 'error'
      ? 'bg-red-50 dark:bg-red-900/20'
      : 'bg-green-50 dark:bg-green-900/20';
  }

  get primaryButtonText(): string {
    if (this.type === 'error') return 'Tentar Novamente';
    if (this.type === 'success-with-link') return 'Continuar Importação';
    return 'Ok, entendi';
  }

  get showSecondaryButton(): boolean {
    return this.type === 'error';
  }

  onClose(): void {
    this.close.emit();
  }

  onPrimaryAction(): void {
    if (this.type === 'error') {
      this.retry.emit();
    } else if (this.type === 'success-with-link') {
      this.continue.emit();
    } else {
      this.close.emit();
    }
  }

  onSecondaryAction(): void {
    this.close.emit();
  }
}
