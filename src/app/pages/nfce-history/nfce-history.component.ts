import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NfceService } from '../../services/nfce.service';
import { NfceHistoryResponse, NfceHistoryPageResponse } from '../../models/nfce.models';

@Component({
  selector: 'app-nfce-history',
  templateUrl: './nfce-history.component.html',
  styleUrls: ['./nfce-history.component.scss']
})
export class NfceHistoryComponent implements OnInit {
  historyData: NfceHistoryPageResponse | null = null;
  nfceList: NfceHistoryResponse[] = [];
  loading = false;
  error: string | null = null;
  retryingNfceIds: Set<string> = new Set();

  currentPage = 0;
  pageSize = 10;

  selectedStatus = 'ALL';

  constructor(
    private nfceService: NfceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.error = null;

    this.nfceService.getHistory(this.selectedStatus, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.historyData = response;
          this.nfceList = response.items;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar histórico:', err);
          this.error = 'Erro ao carregar o histórico de NFC-e. Tente novamente.';
          this.loading = false;
        }
      });
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.loadHistory();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadHistory();
  }

  viewDetails(nfceId: string): void {
    console.log('Navegando para detalhes da NFC-e:', nfceId);
    this.router.navigate(['/nfce', nfceId]);
  }

  retryImport(nfceId: string, event: Event): void {
    event.stopPropagation();

    this.retryingNfceIds.add(nfceId);

    this.nfceService.retryImport(nfceId).subscribe({
      next: () => {
        console.log('NFCe reprocessada com sucesso:', nfceId);
        this.retryingNfceIds.delete(nfceId);
        this.loadHistory();
      },
      error: (err) => {
        console.error('Erro ao reprocessar NFCe:', err);
        this.retryingNfceIds.delete(nfceId);
        alert('Erro ao reprocessar a nota fiscal. Tente novamente.');
      }
    });
  }

  isRetrying(nfceId: string): boolean {
    return this.retryingNfceIds.has(nfceId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return 'R$ --,--';
    }
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  formatAccessKey(accessKey: string | null | undefined): string {
    if (!accessKey) {
      return 'Chave não disponível';
    }

    const cleanKey = accessKey.replace(/\D/g, '');

    if (cleanKey.length !== 44) {
      return accessKey;
    }

    const formatted = cleanKey.match(/.{1,4}/g)?.join(' ') || accessKey;
    return formatted;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'IMPORTED': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'PROCESSED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'ERROR': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  getStatusLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'IMPORTED': 'Importado',
      'PROCESSED': 'Processando',
      'PENDING': 'Pendente',
      'ERROR': 'Erro'
    };
    return labelMap[status] || status;
  }
}
