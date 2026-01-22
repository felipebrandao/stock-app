export type StockStatus = 'OK' | 'BAIXO' | 'ESGOTADO' | 'VALIDADE_PROXIMA';

export interface StockItem {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  unit: string;
  status: StockStatus;
}

export interface StockBatch {
  batchId: string;
  itemId: string;
  label: string;
  qtyLabel: string;
  locationLabel: string;
  expiresAtLabel: string;
  expiresAtTone: 'ok' | 'warn' | 'danger';
}

export interface StockFilter {
  query: string;
  categories: string[];
  status: StockStatus[];
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StockSummary {
  total: number;
  low: number;
  out: number;
  expSoon: number;
}
