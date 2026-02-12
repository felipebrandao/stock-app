// Backend API Models
export type StockItemState = 'CLOSED' | 'IN_USE' | 'CONVERTED' | 'WRITTEN_OFF';

export type StockMovementType = 'IN' | 'OUT' | 'TRANSFER' | 'STATE_CHANGE' | 'CONVERSION';

export interface StockItemResponse {
  id: string;
  productId: string;
  locationId: string;
  quantity: number;
  state: StockItemState;
  expiryDate?: string; // ISO date format
  createdAt: string; // ISO datetime format
  updatedAt: string; // ISO datetime format
}

export interface ProductResponse {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  createdAt: string;
}

export interface LocationResponse {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

export interface UnitResponse {
  id: string;
  name: string;
  abbreviation: string;
  createdAt: string;
}

export interface StockMovementResponse {
  id: string;
  type: StockMovementType;
  productId: string;
  quantity: number;
  fromLocationId?: string;
  toLocationId?: string;
  note?: string;
  occurredAt: string;
  createdAt: string;
}

export interface PageResponse<T> {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Request Models
export interface CreateProductRequest {
  name: string;
  categoryId: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface CreateLocationRequest {
  name: string;
  description?: string;
}

export interface CreateUnitRequest {
  name: string;
  abbreviation: string;
}

export interface CreateStockMovementRequest {
  type: StockMovementType;
  productId: string;
  quantity: number;
  fromLocationId?: string;
  toLocationId?: string;
  note?: string;
  occurredAt?: string; // ISO datetime format
}

export interface TransferStockItemRequest {
  targetLocationId: string;
  note?: string;
}

export interface OpenStockItemRequest {
  quantity: number;
  targetLocationId: string;
  note?: string;
}

export interface ConvertStockItemRequest {
  destinationQuantities: number[];
  note?: string;
}

export interface ConsumeStockItemRequest {
  quantity: number;
  note?: string;
}

// Frontend UI Models (mantidos para compatibilidade com componentes existentes)
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
