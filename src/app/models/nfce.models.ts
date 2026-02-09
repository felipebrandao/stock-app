// Backend API Models
export interface NfceItemResponse {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  productId?: string;
}

export interface NfceResponse {
  id: string;
  qrCodeUrl?: string;
  accessKey: string;
  storeName?: string;
  status: string;
  purchaseDate?: string; // ISO date format
  totalValue?: number;
  items: NfceItemResponse[];
}

export interface ImportNfceRequest {
  qrCodeUrl?: string;
  accessKey?: string;
}

export interface NfceImportReviewItemResponse {
  id: string;
  itemNumber: number;
  description: string;
  ean?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId?: string;
  status: string;
  expiryDate?: string; // ISO date format
  locationId?: string;
}

export interface NfceImportReviewResponse {
  id: string;
  status: string;
  items: NfceImportReviewItemResponse[];
}

export interface UpdateNfceImportReviewItemRequest {
  id: string;
  productId?: string;
  quantity?: number;
  expiryDate?: string; // ISO date format
  locationId?: string;
  saveMapping?: boolean;
}

export interface UpdateNfceImportReviewRequest {
  items: UpdateNfceImportReviewItemRequest[];
}

export interface NfceHistoryResponse {
  id: string;
  accessKey: string;
  documentNumber: string | null;
  importedAt: string;
  processedAt?: string | null;
  status: string;
  errorMessage?: string | null;
  itemCount: number | null;
  itemsSummary: string | null;
  totalValue: number | null;
}

export interface NfceHistoryPageResponse {
  items: NfceHistoryResponse[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalImported: number;
  totalProcessed: number;
  totalPending: number;
  totalErrors: number;
}

// Frontend UI Models (mantidos para compatibilidade)
export interface NFCeQRCodeData {
  chaveAcesso: string;
  url: string;
  dataEmissao?: Date;
  valorTotal?: number;
  cnpjEmissor?: string;
}

export interface NFCeItem {
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
}

export interface NFCeData {
  chaveAcesso: string;
  numeroNota: string;
  serie: string;
  dataEmissao: Date;
  cnpjEmissor: string;
  nomeEmissor: string;
  valorTotal: number;
  itens: NFCeItem[];
}

export enum ScanStatus {
  IDLE = 'idle',
  SCANNING = 'scanning',
  SUCCESS = 'success',
  ERROR = 'error',
  PROCESSING = 'processing'
}
