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
