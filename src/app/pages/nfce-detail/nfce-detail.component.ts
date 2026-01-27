import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NfceService } from '../../services/nfce.service';
import { NfceImportReviewResponse, NfceImportReviewItemResponse } from '../../models/nfce.models';

@Component({
  selector: 'app-nfce-detail',
  templateUrl: './nfce-detail.component.html',
  styleUrls: ['./nfce-detail.component.scss']
})
export class NfceDetailComponent implements OnInit {
  nfceId: string = '';
  reviewData: NfceImportReviewResponse | null = null;
  items: NfceImportReviewItemResponse[] = [];
  loading = false;
  error: string | null = null;

  isModalOpen = false;
  selectedItem: NfceImportReviewItemResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nfceService: NfceService
  ) {}

  ngOnInit(): void {
    this.nfceId = this.route.snapshot.params['id'];
    if (this.nfceId) {
      this.loadNfceDetails();
    } else {
      this.error = 'ID da NFC-e não encontrado';
    }
  }

  loadNfceDetails(): void {
    this.loading = true;
    this.error = null;

    this.nfceService.getImportReview(this.nfceId).subscribe({
      next: (response) => {
        this.reviewData = response;
        this.items = response.items;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes da NFC-e:', err);
        this.error = 'Erro ao carregar os detalhes da NFC-e. Tente novamente.';
        this.loading = false;
      }
    });
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  getTotalValue(): number {
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getMappedCount(): number {
    return this.items.filter(item => item.status === 'MAPPED').length;
  }

  getPendingCount(): number {
    return this.items.filter(item => item.status === 'UNMAPPED' || item.status === 'PENDING').length;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'MAPPED': 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
      'UNMAPPED': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
      'PENDING': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      'ERROR': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
    };
    return statusMap[status] || 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
  }

  getStatusLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'MAPPED': 'Mapeado',
      'UNMAPPED': 'Não Mapeado',
      'PENDING': 'Pendente',
      'ERROR': 'Erro'
    };
    return labelMap[status] || status;
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'MAPPED': 'check_circle',
      'UNMAPPED': 'help',
      'PENDING': 'pending',
      'ERROR': 'error'
    };
    return iconMap[status] || 'info';
  }

  goBack(): void {
    this.router.navigate(['/nfce-history']);
  }

  approveImport(): void {
    if (!this.nfceId) return;

    this.loading = true;
    this.nfceService.approveImport(this.nfceId).subscribe({
      next: () => {
        alert('NFC-e aprovada e itens adicionados ao estoque!');
        this.router.navigate(['/nfce-history']);
      },
      error: (err) => {
        console.error('Erro ao aprovar importação:', err);
        alert('Erro ao aprovar a importação. Verifique se todos os itens estão mapeados.');
        this.loading = false;
      }
    });
  }

  editItem(itemId: string): void {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      this.selectedItem = item;
      this.isModalOpen = true;
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onModalConfirm(data: any): void {
    console.log('Dados do modal:', data);
    // TODO: Implementar lógica para atualizar o item via API
    // this.nfceService.updateImportReview(...)
    this.closeModal();
  }
}
